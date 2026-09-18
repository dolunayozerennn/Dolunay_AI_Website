#!/bin/bash
# Canli dolunay.ai olcumu: her sayfanin gorunur kelime sayisi ve EN sayfalarda
# Turkce GEO metni sizintisi. Cikti tek tablo, defter.py --kos ile calistirilir.
for u in /cozumler /egitimler/ai-factory /cozumler/hizmetler /egitimler/kurumsal-egitimler \
         /en/cozumler /en/egitimler/ai-factory /en/cozumler/hizmetler /en/egitimler/kurumsal-egitimler; do
  h=$(curl -s "https://dolunay.ai$u")
  kod=$(curl -s -o /dev/null -w "%{http_code}" "https://dolunay.ai$u")
  kel=$(printf '%s' "$h" | python3 -c "import sys,re;t=sys.stdin.read();t=re.sub(r'(?is)<(script|style).*?</\1>','',t);print(len([w for w in re.split(r'\s+',re.sub(r'(?s)<[^>]+>',' ',t)) if w.strip()]))")
  siz=$(printf '%s' "$h" | grep -c "Abonelik kademeli\|Tek bir liste fiyatım yok\|Tek bir doğru süre yok\|Eğitim verdiğim kurumlarda\|Bakımı ben yapıyorum\|Hazır araçlar iyi bir başlangıç")
  printf "%-34s %s kelime=%-5s TRblok=%s\n" "$u" "$kod" "$kel" "$siz"
done
