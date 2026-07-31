'use client';

import { motion } from 'framer-motion';
import { Bot, ArrowRight, Briefcase, Sparkles, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/i18n/i18n';

const fadeUp = {
  hidden: { opacity: 0, y: 50, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const }
  })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] as const }
  })
};

type MemberType = 'founder' | 'cofounder' | 'employee' | 'ai';
type Member = { name: string; role: string; avatar: string; type: MemberType };

// Metinler ceviri paketinden gelir (about.pillarNTag / pillarNTitle / pillarNDesc).
const pillars: {
  id: string;
  tagKey: string;
  titleKey: string;
  descKey: string;
  href: string;
  icon: typeof Briefcase;
  members: Member[];
}[] = [
  {
    id: 'b2b',
    tagKey: 'about.pillar1Tag',
    titleKey: 'about.pillar1Title',
    descKey: 'about.pillar1Desc',
    href: '/cozumler/hizmetler',
    icon: Briefcase,
    members: [
      { name: 'Dolunay', role: 'Co-founder · Marketing Lead & Consultant', avatar: '/portrait.webp', type: 'cofounder' },
      { name: 'Savaş', role: 'Co-founder · B2B Lead', avatar: '/images/team/savas.webp', type: 'cofounder' },
      { name: 'Okan', role: 'Co-founder · Technical Lead', avatar: '/images/team/okan.webp', type: 'cofounder' },
    ],
  },
  {
    id: 'partnerships',
    tagKey: 'about.pillar2Tag',
    titleKey: 'about.pillar2Title',
    descKey: 'about.pillar2Desc',
    href: '/isbirlikleri',
    icon: Sparkles,
    members: [
      { name: 'Dolunay', role: 'Founder · Marketing Lead & Consultant', avatar: '/portrait.webp', type: 'founder' },
      { name: 'Ceren', role: 'Partnership Manager', avatar: '/images/team/ceren.webp', type: 'employee' },
      { name: 'Berke', role: 'Video Editor', avatar: '/images/team/berke.webp', type: 'employee' },
    ],
  },
  {
    id: 'ai-factory',
    tagKey: 'about.pillar3Tag',
    titleKey: 'about.pillar3Title',
    descKey: 'about.pillar3Desc',
    href: '/egitimler/ai-factory',
    icon: GraduationCap,
    members: [
      { name: 'Dolunay', role: 'Founder · Marketing Lead & Consultant', avatar: '/portrait.webp', type: 'founder' },
      { name: 'Sarper', role: 'Social Media Ads Manager', avatar: '/images/team/sarper.webp', type: 'employee' },
      { name: 'Ece', role: 'Sales Specialist', avatar: '/images/team/ece.webp', type: 'employee' },
    ],
  },
];

const aiAgents: Member[] = [
  { name: 'Bobby', role: 'Designer', avatar: '/team/bobby_ai.webp', type: 'ai' },
  { name: 'Gipsy', role: 'Web Site Developer', avatar: '/team/gipsy_ai.webp', type: 'ai' },
  { name: 'Daisy', role: 'Customer Support', avatar: '/team/daisy_ai.webp', type: 'ai' },
  { name: 'Joshua', role: 'Lead Generation', avatar: '/team/joshua_ai.webp', type: 'ai' },
  { name: 'Atlas', role: 'Video Producer', avatar: '/team/atlas_ai.png', type: 'ai' },
  { name: 'Luna', role: 'Content Writer', avatar: '/team/luna_ai.png', type: 'ai' },
  { name: 'Rex', role: 'Social Media Manager', avatar: '/team/rex_ai.png', type: 'ai' },
];

function MemberCard({ member }: { member: Member }) {
  const isElevated = member.type === 'founder' || member.type === 'cofounder';

  return (
    <div className={`bento-card !rounded-3xl !p-5 text-center group relative overflow-hidden backdrop-blur-sm h-full ${
      isElevated
        ? 'bg-gradient-to-b from-amber-500/[0.08] to-transparent border border-amber-500/25'
        : 'bg-white/5 border border-white/5'
    }`}>
      {member.type === 'ai' && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      )}
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-500">
        <Image src={member.avatar} alt={member.name} width={128} height={128} className="w-full h-full object-cover rounded-2xl shadow-lg border border-white/10" />
      </div>
      <h4 className="text-sm font-bold text-white mb-1">{member.name}</h4>
      <p className="text-[10px] text-gray-500 leading-tight">{member.role}</p>
    </div>
  );
}

export default function AboutV3() {
  const { t } = useTranslation();
  return (
    <div className="pt-24 pb-12">
      <section className="py-12 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4F8BFF]/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#4F8BFF]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Hero */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 text-[#4F8BFF] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              <span className="halftone-arc" aria-hidden />{t('about.sectionTag')}
            </motion.span>
            <motion.h1 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold mb-5 tracking-tight">
              {t('about.pageTitle')} <span className="text-gradient-accent">{t('about.pageTitleHighlight')}</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-gray-400 text-lg leading-relaxed">
              {t('about.pageDesc')}
            </motion.p>
          </motion.div>

          {/* Pillar nav chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-20"
          >
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <a
                  key={p.id}
                  href={`#${p.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-gray-300 hover:text-amber-200 text-xs font-medium transition-all"
                >
                  <Icon className="w-3.5 h-3.5" /> {t(p.titleKey)}
                </a>
              );
            })}
          </motion.div>

          {/* Magazine-style alternating layout */}
          <div className="space-y-24 mb-32">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const reverse = idx % 2 === 1;
              return (
                <motion.div
                  key={pillar.id}
                  id={pillar.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  className="scroll-mt-32"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Title block */}
                    <motion.div
                      variants={fadeUp}
                      custom={0}
                      className={`lg:col-span-4 lg:sticky lg:top-32 ${reverse ? 'lg:order-2' : ''}`}
                    >
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold tracking-wider uppercase mb-4">
                        <Icon className="w-3.5 h-3.5" /> {t(pillar.tagKey)}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{t(pillar.titleKey)}</h3>
                      <p className="text-gray-400 leading-relaxed mb-6">{t(pillar.descKey)}</p>
                      <Link
                        href={pillar.href}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-sm font-medium transition-colors"
                      >
                        {t('about.detailBtn')} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>

                    {/* Members grid */}
                    <div className={`lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4 ${reverse ? 'lg:order-1' : ''}`}>
                      {pillar.members.map((m, i) => (
                        <motion.div key={m.name} variants={scaleIn} custom={i}>
                          <MemberCard member={m} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* AI Agents — separate group, no category */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="pt-12 border-t border-white/5"
          >
            <motion.div variants={fadeUp} custom={0} className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wider uppercase mb-3">
                <Bot className="w-3.5 h-3.5" /> {t('about.aiStaffBadge')}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{t('about.aiTeamTitle')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('about.aiTeamDesc')}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {aiAgents.map((member, i) => (
                <motion.div key={member.name} variants={scaleIn} custom={i}>
                  <MemberCard member={member} />
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
