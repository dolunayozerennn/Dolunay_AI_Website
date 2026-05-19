#!/usr/bin/env python3
"""
Generate 6 founder portrait variants for dolunay.ai "Hakkımızda" section.

Source of truth = `Dolunay_Otonom_Kapak/assets/cutouts/` (transparent-bg subject cutouts).
Each variant uses ONE selected cutout as the image-to-image reference, so the
output is a NEW founder portrait built from raw subject material — NOT a
re-interpretation of the existing /public/portrait.webp.

Pipeline (Kie GPT-Image-2 image-to-image + Gemini vision review):
  1. Upload selected cutout PNG to Catbox
  2. Call gpt-image-2-image-to-image with founder/CEO prompt
  3. Vision-review face fidelity against the SAME cutout
  4. Retry once on drift (score < 8)
  5. Save webp 1024x1024 to public/portrait_alternatives/portrait_v{N}.webp
"""
from __future__ import annotations

import io
import json
import os
import sys
import time
from pathlib import Path

import requests
from PIL import Image

# ─── Config ──────────────────────────────────────────────────────────────────
ROOT = Path("/Users/dolunayozeren/Desktop/Antigravity")
MASTER_ENV = ROOT / "_knowledge" / "credentials" / "master.env"
CUTOUTS_DIR = ROOT / "Projeler" / "Dolunay_Otonom_Kapak" / "assets" / "cutouts"
OUTPUT_DIR = ROOT / "Projeler" / "Dolunay_AI_Website" / "public" / "portrait_alternatives"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

REQUEST_TIMEOUT = 60
KIE_CREATE_URL = "https://api.kie.ai/api/v1/jobs/createTask"
KIE_POLL_URL_TPL = "https://api.kie.ai/api/v1/jobs/recordInfo?taskId={task_id}"
KIE_MAX_POLL_SECONDS = 600
FACE_SCORE_THRESHOLD = 8  # 8+ tut (kullanıcı talebi)


def load_env():
    env = {}
    with open(MASTER_ENV) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    return env


ENV = load_env()
KIE_API_KEY = ENV.get("KIE_API_KEY") or ENV.get("KIE_AI_API_KEY")
GEMINI_API_KEY = ENV.get("GEMINI_API_KEY")
if not KIE_API_KEY:
    sys.exit("KIE_API_KEY missing")
if not GEMINI_API_KEY:
    sys.exit("GEMINI_API_KEY missing")


# ─── Catbox upload ───────────────────────────────────────────────────────────
def upload_to_catbox(image_path: Path) -> str:
    print(f"[upload] {image_path.name} -> Catbox")
    with open(image_path, "rb") as f:
        r = requests.post(
            "https://catbox.moe/user/api.php",
            data={"reqtype": "fileupload"},
            files={"fileToUpload": f},
            timeout=REQUEST_TIMEOUT,
        )
    r.raise_for_status()
    url = r.text.strip()
    if "catbox.moe" not in url:
        raise RuntimeError(f"Catbox bad response: {url}")
    print(f"[upload] {url}")
    return url


# ─── Kie GPT-Image-2 ─────────────────────────────────────────────────────────
def kie_create_task(payload: dict) -> str:
    headers = {"Authorization": f"Bearer {KIE_API_KEY}", "Content-Type": "application/json"}
    r = requests.post(KIE_CREATE_URL, headers=headers, json=payload, timeout=REQUEST_TIMEOUT)
    if r.status_code != 200:
        print(f"[kie] createTask FAILED HTTP {r.status_code}: {r.text}")
        return None
    data = r.json().get("data") or {}
    return data.get("taskId")


def kie_poll(task_id: str) -> str:
    headers = {"Authorization": f"Bearer {KIE_API_KEY}"}
    url = KIE_POLL_URL_TPL.format(task_id=task_id)
    start = time.time()
    while True:
        if time.time() - start > KIE_MAX_POLL_SECONDS:
            print(f"[kie] timeout {task_id}")
            return None
        try:
            r = requests.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
            if r.status_code != 200:
                time.sleep(10)
                continue
        except requests.exceptions.RequestException:
            time.sleep(10)
            continue
        data = r.json().get("data") or {}
        state = data.get("state")
        if state == "success":
            result_json = data.get("resultJson", "{}")
            try:
                rd = json.loads(result_json)
            except Exception:
                rd = result_json
            if isinstance(rd, list) and rd:
                return rd[0]
            if isinstance(rd, dict):
                if "resultUrls" in rd and rd["resultUrls"]:
                    return rd["resultUrls"][0]
                if "images" in rd and rd["images"]:
                    return rd["images"][0].get("url")
                if "url" in rd:
                    return rd["url"]
            print(f"[kie] could not parse: {result_json}")
            return None
        if state == "failed":
            print(f"[kie] failed: {data.get('failMsg')}")
            return None
        time.sleep(10)


def kie_gpt_image_2(reference_url: str, prompt: str) -> str:
    payload = {
        "model": "gpt-image-2-image-to-image",
        "input": {
            "prompt": prompt,
            "aspect_ratio": "1:1",
            "resolution": "1K",
            "input_urls": [reference_url],
        },
    }
    task_id = kie_create_task(payload)
    if not task_id:
        return None
    print(f"[kie] task {task_id}  https://kie.ai/gpt-image-2?taskId={task_id}")
    return kie_poll(task_id)


# ─── Gemini face fidelity check ──────────────────────────────────────────────
def vision_review_face(reference_path: Path, candidate_path: Path) -> dict:
    """Returns {'pass': bool, 'score': int 1-10, 'reason': str}."""
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=GEMINI_API_KEY)
    with open(reference_path, "rb") as f:
        ref_bytes = f.read()
    with open(candidate_path, "rb") as f:
        cand_bytes = f.read()

    prompt = (
        "Two photos of supposedly the same man. "
        "Image 1 = REFERENCE cutout (ground truth identity). "
        "Image 2 = CANDIDATE generated portrait. "
        "Rate face identity fidelity 1-10: "
        "10 = same person, no doubt; "
        "8 = same person, minor stylistic drift; "
        "7 = recognizable but noticeable drift; "
        "5 = looks like a relative; "
        "1 = different person. "
        "Focus on: eye shape & spacing, nose bridge & tip, jawline, "
        "beard pattern, eyebrow shape, lip shape, ear shape. "
        "Ignore: lighting, hair styling, expression, background, clothing. "
        'Respond STRICT JSON: {"score": <int>, "reason": "<short>"}'
    )

    resp = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            types.Part.from_bytes(data=ref_bytes, mime_type="image/png"),
            types.Part.from_bytes(data=cand_bytes, mime_type="image/png"),
            prompt,
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )
    try:
        out = json.loads(resp.text)
    except Exception:
        out = {"score": 0, "reason": f"parse fail: {resp.text[:100]}"}
    out["pass"] = out.get("score", 0) >= FACE_SCORE_THRESHOLD
    return out


# ─── Download + convert ──────────────────────────────────────────────────────
def download_to_webp(url: str, out_path: Path) -> Path:
    r = requests.get(url, timeout=REQUEST_TIMEOUT)
    r.raise_for_status()
    raw_path = out_path.with_suffix(".raw.png")
    raw_path.write_bytes(r.content)
    img = Image.open(io.BytesIO(r.content)).convert("RGB")
    if img.size != (1024, 1024):
        img = img.resize((1024, 1024), Image.LANCZOS)
    img.save(out_path, "WEBP", quality=92)
    return raw_path


# ─── Variants ────────────────────────────────────────────────────────────────
# Each variant = (cutout source, founder/CEO transformation prompt).
# Face identity LOCKED to the cutout; the prompt only changes lighting, background,
# clothing, framing into a professional founder portrait.
IDENTITY_LOCK = (
    "CRITICAL FACE IDENTITY LOCK: The man in the reference image is the subject. "
    "Preserve his EXACT face — same eye shape, same nose bridge and tip, same jawline, "
    "same trimmed dark beard pattern, same eyebrow shape, same lip shape, same ear shape, "
    "same skin tone, same dark swept-back hair. Do NOT alter his face in any way. "
    "Keep him as a real photograph, not stylized or illustrated. "
    "The person MUST BE 100% solid and opaque, no semi-transparency. "
)

VARIANTS = [
    {
        "name": "portrait_v1",
        "cutout": "cutout_IMG_4188.png",
        "desc": "serious front-face → warm studio CEO portrait, charcoal backdrop, navy blazer",
        "prompt": IDENTITY_LOCK + (
            "Editorial founder/CEO portrait, 1:1 square, head-and-shoulders crop. "
            "Replace the casual black t-shirt with a well-fitted dark navy tailored blazer over a charcoal merino crewneck. "
            "Drop his hand from his temple naturally so both arms are relaxed at his sides — face camera. "
            "Warm soft key light from upper-left, gentle fill, soft shadow on right cheek. "
            "Background: smooth charcoal grey seamless studio backdrop, slight vignette. "
            "Expression: composed, calm, confident, eyes engaged directly with camera, mouth softly closed. "
            "85mm lens look, shallow depth of field, ultra-sharp eyes, fine skin detail preserved. "
            "Premium magazine cover quality, clean modern color grade."
        ),
    },
    {
        "name": "portrait_v2",
        "cutout": "cutout_IMG_4315.png",
        "desc": "warm smile front → natural window light, off-white wall, light grey sweater",
        "prompt": IDENTITY_LOCK + (
            "Founder portrait for an About page, 1:1 square, head-and-shoulders crop. "
            "Replace the black t-shirt with a light heather-grey fine-knit crewneck sweater. "
            "Soft natural daylight from a large window on the left, gentle shadow on right cheek. "
            "Background: warm off-white painted wall with very subtle texture, slightly out of focus. "
            "Keep his genuine warm closed-lip smile and direct eye contact with camera. "
            "Editorial photography, soft contrast, natural skin tones, sharp eyes, premium magazine look."
        ),
    },
    {
        "name": "portrait_v3",
        "cutout": "cutout_IMG_4275.png",
        "desc": "thoughtful side-look → cinematic golden hour, navy blazer, bokeh rooftop",
        "prompt": IDENTITY_LOCK + (
            "Cinematic founder portrait, 1:1 square, waist-up crop. "
            "Replace the black t-shirt with a dark navy unstructured blazer over a clean white t-shirt. "
            "Keep his thoughtful three-quarter pose — hand near chin is fine, looking slightly off-camera in contemplation. "
            "Golden hour warm sunlight from upper-right, soft rim light on hair and shoulder. "
            "Background: heavy creamy bokeh of an out-of-focus modern rooftop / city skyline at sunset, warm amber tones, no readable text or signs. "
            "Anamorphic 50mm look, shallow depth of field, sharp eyes, premium cinematic color grade."
        ),
    },
    {
        "name": "portrait_v4",
        "cutout": "cutout_IMG_4254.png",
        "desc": "contemplative hand-on-jaw → modern minimal office, dark grey blazer",
        "prompt": IDENTITY_LOCK + (
            "Environmental founder portrait, 1:1 square, waist-up crop. "
            "Replace the black t-shirt with a dark charcoal blazer worn open over a black fine-knit crewneck. "
            "Keep his thoughtful pose — hand resting lightly near his jawline, looking slightly off-camera in calm focus. "
            "Soft diffused daylight from a large window behind him on the right, gentle rim on hair, soft fill from the front. "
            "Background: heavy bokeh of a modern minimal workspace — light wood, soft white walls, hint of a desk, no readable text. "
            "Premium editorial photography, natural color grade, sharp focus on eyes, clean and quiet mood."
        ),
    },
    {
        "name": "portrait_v5",
        "cutout": "cutout_IMG_4215.png",
        "desc": "candid laugh three-quarter → warm studio, charcoal turtleneck, soft grey backdrop",
        "prompt": IDENTITY_LOCK + (
            "Candid founder portrait, 1:1 square, head-and-shoulders crop. "
            "Replace the black t-shirt with a charcoal merino turtleneck. "
            "Keep his genuine joyful laugh, eyes crinkled with warmth, three-quarter pose looking slightly off-camera as if mid-conversation. "
            "Warm soft key light from upper-left, gentle fill, clean editorial lighting. "
            "Background: smooth medium-grey seamless studio paper, slight gradient. "
            "85mm lens look, shallow depth of field, ultra-sharp eyes, natural skin detail. "
            "Premium magazine quality, warm tones, captures personality."
        ),
    },
    {
        "name": "portrait_v6",
        "cutout": "cutout_IMG_4225.png",
        "desc": "side-profile gaze → low-key cinematic, deep black backdrop, black blazer",
        "prompt": IDENTITY_LOCK + (
            "Low-key cinematic founder portrait, 1:1 square, head-and-shoulders crop. "
            "Replace the black t-shirt with a sharply tailored black blazer over a black mock-neck. "
            "Keep his three-quarter side pose, looking calmly past camera with quiet confidence, mouth closed. "
            "Single soft key light from upper-left at 45 degrees, controlled falloff into deep shadow on the right side. "
            "Background: very dark charcoal almost black, subtle gradient, rich blacks. "
            "Premium magazine cover quality, sharp eyes, fine skin texture preserved, gentle contrast, moody and refined."
        ),
    },
]


def main():
    print(f"Cutouts dir: {CUTOUTS_DIR}")
    print(f"Output:      {OUTPUT_DIR}")
    print()

    # Pre-upload all cutouts (or upload on-demand). On-demand is cheaper if some skip.
    catbox_cache = {}

    results = []
    for variant in VARIANTS:
        name = variant["name"]
        desc = variant["desc"]
        cutout_name = variant["cutout"]
        prompt = variant["prompt"]
        cutout_path = CUTOUTS_DIR / cutout_name
        if not cutout_path.exists():
            print(f"[{name}] CUTOUT MISSING: {cutout_path}")
            results.append({"name": name, "cutout": cutout_name, "desc": desc,
                            "score": None, "reason": "cutout missing", "path": None})
            continue

        print(f"━━━ {name} :: {cutout_name}")
        print(f"    {desc}")

        if cutout_name not in catbox_cache:
            try:
                catbox_cache[cutout_name] = upload_to_catbox(cutout_path)
            except Exception as e:
                print(f"  [{name}] catbox upload failed: {e}")
                results.append({"name": name, "cutout": cutout_name, "desc": desc,
                                "score": None, "reason": f"upload failed: {e}", "path": None})
                continue
        ref_url = catbox_cache[cutout_name]

        out_webp = OUTPUT_DIR / f"{name}.webp"
        success = False

        for attempt in range(2):
            print(f"  attempt {attempt+1}/2")
            image_url = kie_gpt_image_2(ref_url, prompt)
            if not image_url:
                print(f"  [{name}] generation returned None, retrying")
                continue

            try:
                raw_path = download_to_webp(image_url, out_webp)
            except Exception as e:
                print(f"  [{name}] download failed: {e}")
                continue

            try:
                review = vision_review_face(cutout_path, out_webp)
            except Exception as e:
                print(f"  [{name}] vision review failed: {e}; keeping anyway")
                review = {"score": -1, "reason": "review error", "pass": True}

            print(f"  [{name}] face score {review.get('score')} | {review.get('reason')}")
            if review.get("pass"):
                try:
                    raw_path.unlink()
                except Exception:
                    pass
                success = True
                results.append({"name": name, "cutout": cutout_name, "desc": desc,
                                "score": review.get("score"), "reason": review.get("reason"),
                                "path": str(out_webp)})
                break
            else:
                print(f"  [{name}] DRIFT (score < {FACE_SCORE_THRESHOLD}), retrying")

        if not success:
            print(f"  [{name}] FAILED both attempts — deleting webp")
            if out_webp.exists():
                out_webp.unlink()
            raw = out_webp.with_suffix(".raw.png")
            if raw.exists():
                raw.unlink()
            results.append({"name": name, "cutout": cutout_name, "desc": desc,
                            "score": review.get("score") if 'review' in locals() else None,
                            "reason": "face drift, discarded", "path": None})

        print()

    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("SUMMARY")
    for r in results:
        status = "OK" if r["path"] else "DROP"
        print(f"  [{status}] {r['name']} <- {r['cutout']}: score={r['score']} | {r['desc']}")
    print(f"\nFolder: {OUTPUT_DIR}")

    log_path = OUTPUT_DIR / "_generation_log.json"
    log_path.write_text(json.dumps(results, ensure_ascii=False, indent=2))
    print(f"Log: {log_path}")


if __name__ == "__main__":
    main()
