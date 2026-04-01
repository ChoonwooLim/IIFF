import Image from 'next/image';
import { images } from '@/lib/images';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionWrapper from '@/components/layout/SectionWrapper';
import PartDivider from '@/components/layout/PartDivider';
import GlassCard from '@/components/ui/GlassCard';
import ProgramCard from '@/components/ui/ProgramCard';
import StatCard from '@/components/ui/StatCard';
import DataTable from '@/components/ui/DataTable';
import TimelineRoadmap from '@/components/ui/TimelineRoadmap';
import ComparisonTable from '@/components/ui/ComparisonTable';
import OrgChart from '@/components/ui/OrgChart';
import FadeUp from '@/components/animation/FadeUp';
import StaggerChildren from '@/components/animation/StaggerChildren';

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ============================================================ */}
      {/* HERO COVER — Full background image                           */}
      {/* ============================================================ */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[var(--bg)]">
        <Image src={images.hero} alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-[var(--bg)]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.08),transparent_70%)]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <FadeUp>
            <p className="label-upper text-gold mb-6">
              Incheon International Film Festival
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-[var(--text)] mb-8">
              NextWave<br />2026
            </h1>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="text-body text-[var(--text-dim)] text-lg md:text-xl max-w-2xl mx-auto mb-12">
              시네마, 문화, 그리고 기술이 만나는 곳.
              인천에서 시작되는 글로벌 영화의 새로운 물결.
            </p>
          </FadeUp>
          <FadeUp delay={0.45}>
            <div className="flex items-center justify-center gap-6">
              <a
                href="#what-is-iiff"
                className="px-8 py-3 border border-gold text-gold label-upper text-xs hover:bg-gold hover:text-[var(--bg)] transition-all duration-500"
              >
                Explore
              </a>
              <a
                href="#programs"
                className="px-8 py-3 text-[var(--text-dim)] label-upper text-xs hover:text-gold transition-colors duration-300"
              >
                Programs
              </a>
            </div>
          </FadeUp>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[0.6rem] tracking-[4px] uppercase text-[var(--text-muted)]">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent" />
        </div>
      </section>

      {/* ============================================================ */}
      {/* PART 1 — 소개 (Introduction)                                  */}
      {/* ============================================================ */}

      {/* Part 1 wrapper — scroll target for "소개" nav */}
      <section id="intro" className="scroll-mt-24">
        {/* Image strip before Part 1 */}
        <div className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden">
          <Image src={images.partDivider1} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        </div>

        <PartDivider part={1} title="소개" />
      </section>

      {/* --- Section 1: What is IIFF? --- (Pattern B: subtle background) */}
      <section id="what-is-iiff" className="relative overflow-hidden scroll-mt-24">
        <Image src={images.whatIsIiff} alt="" fill className="object-cover opacity-[0.06]" />
        <div className="absolute inset-0 bg-[var(--bg)]/90" />
        <div className="relative z-10">
          <SectionWrapper>
            <FadeUp>
              <p className="label-upper text-gold mb-4">PART 1 &bull; INTRODUCTION</p>
              <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-4">
                1. What is IIFF?
              </h2>
              <p className="text-body text-[var(--text-dim)] max-w-3xl mb-12">
                발음은 &quot;이프(if)&quot; &mdash; i 두 번, f 두 번 &mdash; 강조의 의미이며, 발음은 단순한 하나의 단어입니다.
              </p>
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Left: if concept */}
              <FadeUp delay={0.1}>
                <div>
                  <h3 className="heading-display text-6xl md:text-8xl text-gold mb-2">if</h3>
                  <p className="text-body text-[var(--text-dim)] text-xl mb-6">&quot;만약에&quot;</p>
                  <ul className="space-y-3 mb-8">
                    {[
                      '만약에 올해, 내 영화가 이곳에서 처음으로 주목받는다면?',
                      '만약에 이 무대에서, 내 연기가 올해의 최우수 연기자로 불린다면?',
                      '만약에 이 선택이, 내 인생의 방향을 바꾸는 순간이 된다면?',
                    ].map((item) => (
                      <li key={item} className="text-body text-[var(--text-dim)] text-sm pl-4 border-l-2 border-gold/30">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-3">
                    <p className="text-body text-[var(--text)] text-sm font-medium">
                      if는 일어날 수 있는 모든 우연 즉 모든 가능성입니다. 끝없는 상상입니다.
                    </p>
                    <p className="text-body text-gold text-sm font-medium">
                      IIFF는 바로 그 &apos;만약에&apos;를 시작하게 하는 영화제입니다.
                    </p>
                  </div>
                </div>
              </FadeUp>

              {/* Right: cards + blockquote */}
              <FadeUp delay={0.2}>
                <div className="space-y-6">
                  <GlassCard hover={false}>
                    <h4 className="text-gold label-upper mb-3">IIFF는</h4>
                    <p className="text-body text-[var(--text-dim)] text-sm mb-3">
                      이미 성공한 사람들만을 위한 영화제가 아닙니다. 이미 이름이 알려진 작품만을 위한 무대도 아닙니다.
                    </p>
                    <p className="text-body text-[var(--text-dim)] text-sm">
                      아직 기회가 오지 않은 이야기, 아직 발견되지 않은 재능, 아직 불리지 않은 이름들에게 &quot;만약에&quot;를 상상할 수 있는 용기를 주는 영화제입니다.
                    </p>
                  </GlassCard>

                  <blockquote className="border-l-2 border-gold pl-6 py-4">
                    <p className="text-body text-[var(--text)] italic text-lg leading-relaxed">
                      What if this year changes everything?<br />
                      What if this is where your story begins?
                    </p>
                  </blockquote>

                  <GlassCard hover={false} className="bg-gold/5">
                    <p className="label-upper text-gold mb-2">OUR VISION</p>
                    <p className="text-body text-[var(--text-dim)] text-sm leading-relaxed">
                      누구에게나 열려 있는 질문, 모든이에게 꿈과 희망을, 그리고 새로운 파도를 만드는 상상.
                      if, 그 한 단어에서, IIFF는 시작됩니다.
                    </p>
                  </GlassCard>
                </div>
              </FadeUp>
            </div>

            {/* Vision statements */}
            <FadeUp delay={0.3}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
                {[
                  { label: 'SEE \u00b7 ENJOY \u00b7 CREATE', text: '보고, 즐기고, 만들고, 서로 평가하고, 퍼뜨린다.' },
                  { label: 'TOGETHER ACROSS BORDERS', text: '국경을 넘어 만나고, 함께 꿈꾸고, 함께 행동한다.' },
                  { label: 'NEW ERA', text: '새로운 시대를 여는, 우주에서 단 하나뿐인 영화제.' },
                  { label: 'GATEWAY', text: '인천은 이제 오래된 경계를 허물고 새로운 시대의 관문이 될 것입니다.' },
                ].map((v) => (
                  <div key={v.label} className="p-4 border border-[var(--border)] rounded-[var(--radius-card)]">
                    <p className="label-upper text-gold text-[0.6rem] mb-2">{v.label}</p>
                    <p className="text-body text-[var(--text-dim)] text-xs">{v.text}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </SectionWrapper>
        </div>
      </section>

      {/* --- Section 2: Festival Overview --- (Pattern A: image hero header) */}
      <div id="overview" className="scroll-mt-24">
      <section className="relative w-full min-h-[50vh] flex items-center overflow-hidden">
        <Image src={images.overview} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-[var(--bg)]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-[var(--bg)]/80" />
        <div className="relative z-10 w-full">
          <div className="max-w-6xl mx-auto px-6 py-24 text-center">
            <FadeUp>
              <p className="label-upper text-gold mb-4">PART 1 &bull; INTRODUCTION</p>
              <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-4">
                2. Festival Overview
              </h2>
              <p className="text-body text-[var(--text-dim)] max-w-3xl mx-auto">
                인천 국제 영화제 &quot;넥스트웨이브&quot; &mdash; Incheon International Film Festival (IIFF-NextWave)
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      <SectionWrapper alt>
        <FadeUp delay={0.1}>
          <div className="space-y-4 mb-12 max-w-4xl">
            <p className="text-body text-[var(--text-dim)]">
              IIFF &mdash; NextWave는 단순히 영화를 상영하는 기존 영화제의 틀을 넘어, 영화 &middot; 음악 &middot; 테크놀로지 &middot; K-컬처가 유기적으로 융합되는 미래형 글로벌 영화 플랫폼을 지향하는 국제 영화제입니다.
            </p>
            <p className="text-body text-[var(--text-dim)]">
              전통적인 영화제의 가치 위에 새로운 콘텐츠 환경과 산업 구조를 결합하여, &apos;다음 세대의 영화제 모델&apos;을 인천에서 시작합니다.
            </p>
            <p className="text-body text-[var(--text-dim)]">
              또한, &apos;칸&apos;이나 &apos;오스카&apos;처럼 이름 그 자체로 권위를 갖는 &quot;iiff&quot; 브랜드로 성장합니다.
            </p>
          </div>
        </FadeUp>

        <StaggerChildren className="grid md:grid-cols-2 gap-6">
          {[
            { num: '01', en: 'INCHEON \u00d7 HOLLYWOOD', title: 'Method Fest와 함께하는 글로벌 영화 플랫폼', desc: '헐리우드에서 실제로 독립영화 생태계를 개척해온 Method Fest Independent Film Festival과의 직접적인 협업을 통해 아시아와 헐리우드를 연결하는 국제 영화 플랫폼을 구축합니다.' },
            { num: '02', en: 'DUAL STRUCTURE', title: '상업영화와 독립영화가 공존하는 이중 구조', desc: 'IIFF는 하나의 장르나 규모에 국한되지 않습니다. 상업영화와 독립영화가 분리되지 않고 공존하는 이중 구조를 통해 영화 산업의 현재와 미래를 동시에 조망합니다.' },
            { num: '03', en: 'PARTICIPATORY FESTIVAL', title: '관객이 참여하고, 창작자가 성장하는 체험형 영화제', desc: 'IIFF — NextWave는 \'보는 영화제\'가 아닌 "참여하는 영화제"를 지향합니다.' },
            { num: '04', en: 'BEYOND THE FESTIVAL', title: '영화제 이후에도 지속되는 연중 콘텐츠 생태계', desc: 'IIFF — NextWave는 1년에 한 번 열리고 끝나는 이벤트가 아닙니다.' },
          ].map((card) => (
            <GlassCard key={card.num} num={card.num}>
              <p className="label-upper text-gold/60 text-[0.6rem] mb-2">{card.en}</p>
              <h3 className="heading-section text-lg text-[var(--text)] mb-3 pr-12">{card.title}</h3>
              <p className="text-body text-[var(--text-dim)] text-sm">{card.desc}</p>
            </GlassCard>
          ))}
        </StaggerChildren>
      </SectionWrapper>
      </div>

      {/* --- Section 3: Why Participate? --- */}
      <section id="why-participate" className="relative overflow-hidden scroll-mt-24">
        <Image src={images.whyParticipate} alt="" fill className="object-cover opacity-[0.06]" />
        <div className="absolute inset-0 bg-[var(--bg)]/90" />
        <div className="relative z-10">
          <SectionWrapper>
            <FadeUp>
              <p className="label-upper text-gold mb-4">PART 1 &bull; INTRODUCTION</p>
              <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-12">
                3. Why Participate?
              </h2>
            </FadeUp>

            <StaggerChildren className="grid md:grid-cols-2 gap-6">
              {[
                { num: '2-1', title: '"노출"을 넘어, 함께 만드는 브랜드 플랫폼', desc: 'IIFF는 로고를 붙이는 후원이 아니라, 브랜드가 프로그램과 경험 속에 \'주인공\'으로 결합되는 구조입니다.', kpi: '현장 동선 유입, 부스 체류 시간, 프로그램 참여자 수, 콘텐츠 내 브랜드 노출 횟수' },
                { num: '2-2', title: 'K-콘텐츠 중심 시장에서의 글로벌 노출 가치', desc: '전 세계 영화인과 브랜드가 주목하는 K-콘텐츠 중심지에서 작품과 브랜드를 소개할 기회입니다.', kpi: '출품작/감독 인터뷰 수, 언론 노출, 관객 반응, 해외 참가자 재방문 의향' },
                { num: '2-3', title: '인스파이어 리조트 \u00d7 프리미엄 운영 인프라', desc: '아레나\u00b7MICE\u00b7야외공간(디스커버리 파크)과 인천 대표 상영관을 결합한 대규모/고품격 운영 인프라.', kpi: '' },
                { num: '2-4', title: 'K-팝\u00b7K-푸드\u00b7K-뷰티\u00b7숏폼의 젊고 글로벌한 관객 유입 구조', desc: '영화만으로 관객을 모으는 시대가 아니라, K-컬처 경험이 관객을 끌고, 영화가 중심으로 남게 만드는 구조입니다.', kpi: '관객 연령/국적 분포, 체험존 참여율, SNS UGC 발생량' },
                { num: '2-5', title: '모바일 숏필름 컴피티션 + 캠핑형 페스티벌 바이럴 엔진', desc: 'IIFF-NextWave는 "끝나는 행사"가 아니라, 콘텐츠가 계속 생산되는 구조로 설계됩니다.', kpi: '출품작 수, 조회수/공유수, 참가자 재참여율' },
                { num: '2-6', title: '"콘텐츠가 계속 재생산되는 영화제"', desc: '영화제 이후에도 숏폼\u00b7공연\u00b7비하인드\u00b7인터뷰가 지속 배포되어 브랜드와 작품이 장기 노출됩니다.', kpi: '종료 후 30/60/90일 콘텐츠 조회수, 구독자 증가' },
                { num: '2-7', title: '브랜드 가치 \u00b7 글로벌 네트워크 \u00b7 장기 비즈니스 자산', desc: 'IIFF는 영화제가 끝나도 사라지지 않는 네트워크 기반 자산을 남깁니다.', kpi: '' },
                { num: '2-8', title: '1회성 이벤트가 아닌 장기 파트너십 구조', desc: '인천의 영화\u00b7콘텐츠 생태계와 함께 성장하는 "연중 운영형" 구조로 설계합니다.', kpi: '' },
              ].map((card) => (
                <GlassCard key={card.num} num={card.num}>
                  <h3 className="heading-section text-lg text-[var(--text)] mb-3 pr-12">{card.title}</h3>
                  <p className="text-body text-[var(--text-dim)] text-sm mb-3">{card.desc}</p>
                  {card.kpi && (
                    <p className="text-[var(--text-muted)] text-xs border-t border-[var(--border)] pt-3 mt-3">
                      <span className="text-gold">KPI:</span> {card.kpi}
                    </p>
                  )}
                </GlassCard>
              ))}
            </StaggerChildren>
          </SectionWrapper>
        </div>
      </section>

      {/* --- Section 4: Why Incheon? --- (Pattern A: full image hero) */}
      <div id="why-incheon" className="scroll-mt-24">
      <section className="relative w-full min-h-[50vh] flex items-center overflow-hidden">
        <Image src={images.whyIncheon} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-[var(--bg)]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-[var(--bg)]/80" />
        <div className="relative z-10 w-full">
          <div className="max-w-6xl mx-auto px-6 py-24 text-center">
            <FadeUp>
              <p className="label-upper text-gold mb-4">PART 1 &bull; INTRODUCTION</p>
              <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-4">
                4. Why Incheon?
              </h2>
              <p className="text-body text-[var(--text-dim)] max-w-3xl mx-auto">
                인천은 단순한 &apos;공항 도시&apos;가 아니라 세계가 가장 먼저 만나는 대한민국의 얼굴입니다.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      <SectionWrapper alt>
        <div className="space-y-8">
          {[
            { title: '\'거쳐가는 도시\'에서 "전 세계 영화인의 문화 종착지(Destination)"로', desc: '공항 → 서울로 이동하는 동선이 아닌 "인천에 머무르고, 인천을 경험하게 만드는 구조".', conclusion: '인천은 더 이상 \'통과 지점\'이 아닌 찾아오는 이유가 있는 도시가 됩니다.' },
            { title: '헐리우드와 직접 연결되는 글로벌 자본 \u00b7 인재 \u00b7 관광객 유입 구조', desc: '헐리우드 영화인, 제작자, 투자자들의 실질적 참여. 글로벌 영화제 네트워크를 통한 해외 상영, 공동 제작, 투자 연결.', conclusion: '단기 이벤트가 아닌 지속적인 글로벌 자본 흐름의 입구를 인천에 만듭니다.' },
            { title: '인천시의 문화 행정 역량을 세계에 \'증명\'하는 상징 자산', desc: '영화계 거장 및 헐리우드 인사의 공식 참여. 국제 영화제 운영 경험을 통해 인천시의 문화\u00b7행정\u00b7국제 협력 역량을 글로벌 무대에서 입증.', conclusion: 'IIFF는 인천시가 \'문화 중심 도시\'로 도약했음을 보여주는 가장 강력한 증거가 됩니다.' },
            { title: '365일 작동하는 영화\u00b7콘텐츠 허브', desc: '영화제 이후에도 지속되는 교육 프로그램 / 창작자 레지던시 / 영화\u00b7콘텐츠 제작 워크숍 / 국제 공동 프로젝트.', conclusion: '인천은 행사 도시가 아니라 산업 도시로 진화합니다.' },
            { title: '유휴 부지와 공간을 미래 콘텐츠 자산으로 전환', desc: '유휴 부지\u00b7건물 → 영화 세트장, 교육 공간, 창작자 캠퍼스. 글로벌 인플루언서 및 크리에이터 유입.', conclusion: '버려진 공간이 도시의 미래 먹거리가 됩니다.' },
          ].map((item, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <GlassCard hover={false}>
                <h3 className="heading-section text-lg text-[var(--text)] mb-3">{item.title}</h3>
                <p className="text-body text-[var(--text-dim)] text-sm mb-4">{item.desc}</p>
                <p className="text-body text-gold text-sm font-medium border-t border-[var(--border)] pt-4">
                  {item.conclusion}
                </p>
              </GlassCard>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.5}>
          <div className="mt-12 p-8 bg-gold/5 border border-gold/20 rounded-[var(--radius-card)]">
            <p className="text-body text-[var(--text)] text-center leading-relaxed">
              결론: 영화제를 시작으로, 인천은 &apos;아시아의 새로운 콘텐츠 중심 도시&apos;로 브랜딩됩니다.
              IIFF는 단순한 문화 행사가 아니라, 인천의 정체성과 미래를 재정의하는 도시 프로젝트입니다.
            </p>
          </div>
        </FadeUp>
      </SectionWrapper>
      </div>

      {/* --- Section 5: Vision & Philosophy --- (Pattern B: subtle background) */}
      <section id="vision" className="relative overflow-hidden scroll-mt-24">
        <Image src={images.vision} alt="" fill className="object-cover opacity-[0.06]" />
        <div className="absolute inset-0 bg-[var(--bg)]/90" />
        <div className="relative z-10">
          <SectionWrapper>
            <FadeUp>
              <p className="label-upper text-gold mb-4">PART 1 &bull; INTRODUCTION</p>
              <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-12">
                5. Vision &amp; Philosophy
              </h2>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <p className="heading-display text-2xl md:text-3xl text-[var(--text)] leading-relaxed mb-6">
                  인천 국제 넥스트웨이브 영화제는<br />
                  하나의 영화제가 아니라,<br />
                  하나의 도시 전략입니다.
                </p>
                <p className="text-body text-[var(--text-dim)] text-lg leading-relaxed mb-4">
                  IIFF-NextWave는<br />
                  영화를 상영하는 이벤트가 아니라,<br />
                  도시의 정체성을 다시 설계하는 프로젝트입니다.
                </p>
                <p className="text-gold text-lg italic">
                  &quot;영화가 머무는 도시 / 창작자가 성장하는 도시 / 세계가 다시 찾는 인천&quot;
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="max-w-3xl mx-auto space-y-6 mb-12">
                <h3 className="heading-section text-xl text-[var(--text)]">인천 국제 넥스트웨이브 영화제의 기획 철학</h3>
                <p className="text-body text-[var(--text-dim)]">
                  우리가 살고 있는 시대는 불과 몇 년 전과도 완전히 다른 세상이 되었습니다. 사람들이 모이던 몰과 백화점들은 문을 닫고 도시는 비어 있는 공간을 안게 되었습니다. 창작은 더 이상 소수의 재능이나 고가의 장비를 가진 사람만의 영역이 아닙니다.
                </p>
                <p className="text-body text-[var(--text-dim)]">
                  AI와 자동화는 아이디어가 없어도, 경험이 없어도 콘텐츠를 만들고 유통할 수 있는 시대를 열었습니다. 앞으로는 무엇이 진짜이고, 무엇이 가짜인지조차 구분하기 어려운 세상이 펼쳐질 것입니다.
                </p>
                <p className="text-body text-[var(--text-dim)]">
                  이 변화는 막을 수 없습니다. 그리고 거스를 필요도 없습니다.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.3}>
              <blockquote className="max-w-3xl mx-auto border-l-2 border-gold pl-6 py-4 mb-12">
                <p className="text-body text-[var(--text)] italic leading-relaxed">
                  그럼에도 불구하고, 사람은 지난날을 기억합니다. 기술이 아무리 발전해도, 사람의 마음속에는 여전히 추억과 낭만이 남아 있습니다. 손으로 만든 것, 사람을 직접 만나 눈을 마주하는 경험, 같은 공간에서 숨을 쉬며 웃고, 울고, 감동하는 순간.
                </p>
              </blockquote>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="max-w-3xl mx-auto space-y-6 mb-12">
                <p className="text-body text-[var(--text-dim)]">
                  IIFF는, 이 두 세대 사이에 단절이 아닌 &apos;연결&apos;을 만들고자 합니다. IIFF는, 사람의 마음과 손으로 만들어진 것들이 다시 중심이 되는 공간을 꿈꿉니다.
                </p>
                <p className="text-body text-[var(--text-dim)]">
                  동시에, AI와 새로운 테크놀로지와의 공존도 숨기지 않습니다. IIFF는, 과거를 붙잡는 영화제가 아니라, 과거의 낭만과 미래의 기술이 만나는 &apos;브릿지&apos;가 되고자 합니다.
                </p>
                <p className="text-body text-[var(--text-dim)]">
                  이전의 어떤 영화제와도 닮지 않은, 솔직하고, 따뜻하고, 감동이 있는 영화제를 지향합니다.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.5}>
              <div className="max-w-3xl mx-auto mb-12">
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    '기술을 부정하지 않되, 사람을 지우지 않고',
                    '미래를 말하되, 기억과 감정을 잃지 않으며',
                    '경쟁보다 가능성을, 결과보다 \'다음 장면\'을 남기는 영화제',
                  ].map((p, i) => (
                    <div key={i} className="p-4 border border-gold/20 rounded-[var(--radius-card)] bg-gold/5">
                      <p className="text-body text-[var(--text)] text-sm text-center">{p}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.6}>
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-body text-gold mb-8">
                  IIFF는 계속해서 &apos;If&apos;를 선물하는 영화제가 되고자 합니다.
                </p>
                <blockquote className="p-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-card)]">
                  <p className="text-body text-[var(--text)] italic leading-relaxed">
                    &quot;만약에, 이곳에서 내 이야기가 시작된다면? 만약에, 이 만남이 나의 다음 인생을 바꾼다면?&quot;
                  </p>
                  <p className="text-body text-[var(--text-dim)] text-sm mt-4">
                    그 질문이 사람들의 마음속에 오래 남는 영화제.<br />
                    인천 국제 넥스트웨이브 영화제는 영화를 통해 도시를 바꾸고, 사람을 다시 연결하며, 미래를 따뜻하게 건너가는 방법을 제안합니다.
                  </p>
                </blockquote>
              </div>
            </FadeUp>
          </SectionWrapper>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PART 2 — 사업 추진 계획서 (Programs)                          */}
      {/* ============================================================ */}

      {/* Image strip before Part 2 */}
      {/* Part 2 wrapper — scroll target for "프로그램" nav */}
      <section id="part-programs" className="scroll-mt-24">
        <div className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden">
          <Image src={images.partDivider2} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        </div>

        <PartDivider part={2} title="프로그램" />
      </section>

      {/* --- Section 6: Core Programs --- (ProgramCard with images) */}
      <SectionWrapper id="programs" alt fullWidth className="scroll-mt-24">
        <FadeUp>
          <p className="label-upper text-gold mb-4">PART 2 &bull; PROGRAMS</p>
          <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-12">
            1. Core Programs
          </h2>
        </FadeUp>

        <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { num: '01', en: 'COMMERCIAL & GLOBAL SHOWCASE', title: '대중성과 국제 화제성을 동시에 확보하는 메인 스트림 섹션', desc: '헐리우드 및 글로벌 상업영화, 국제 초청작 중심의 프리미엄 상영 섹션. 개\u00b7폐막작, 갈라 스크리닝, 레드카펫 이벤트를 통해 대중\u00b7미디어\u00b7스폰서 주목도를 극대화.', conclusion: 'IIFF의 외부 인지도\u00b7흥행\u00b7미디어 파급력을 책임지는 얼굴 섹션', image: images.program1 },
            { num: '02', en: 'METHOD FEST INDEPENDENT FILM SECTION', title: '창작자 중심 글로벌 독립영화제 섹션', desc: '미국 Method Fest Independent Film Festival과의 공식 연계. 연기(Method Acting), 연출, 스토리 중심의 \'창작 방법론(Method)\'에 집중한 큐레이션.', conclusion: '단순 상영이 아닌 "영화인이 성장하는 영화제"라는 철학을 가장 잘 보여주는 섹션', image: images.program2 },
            { num: '03', en: 'NEXTWAVE MOBILE FILM COMPETITION', title: '모바일로 제작하는 \'새로운 영화 언어\' 대표 미래 섹션', desc: '갤럭시\u00b7아이폰 등 모바일 디바이스로 촬영한 작품만 출품 가능. 장르\u00b7국적 제한 없이 젊은 창작자, 신인, 크리에이터 대거 참여 유도.', conclusion: 'IIFF-NextWave의 이름을 가장 직접적으로 설명하는 미래 영화의 인큐베이터', image: images.program3 },
            { num: '04', en: 'FESTIVAL CAMP & LIVE CULTURE', title: '캠핑\u00b7공연\u00b7상영이 결합된 \'영화형 축제\'', desc: '인스파이어 야외 공간을 활용한 캠핑형 페스티벌 존. 밤에는 야외 상영 / 라이브 공연 / DJ\u00b7뮤직 콘텐츠.', conclusion: '영화제를 "보는 행사"에서 머무르고 경험하는 문화 축제로 확장', image: images.program4 },
            { num: '05', en: 'K-CULTURE EXPERIENCE ZONE', title: '영화를 중심으로 K-컬처가 스며드는 공간', desc: '한식, K-푸드, K-뷰티, 라이프스타일 브랜드가 참여하는 체험형 존. 단순 전시\u00b7판매가 아닌, 영화 테마와 연결된 음식 / 배우\u00b7감독 메이크업 체험.', conclusion: 'IIFF를 \'한국을 경험하는 국제 영화제\'로 완성하는 마지막 퍼즐', image: images.program5 },
          ].map((prog) => (
            <ProgramCard
              key={prog.num}
              num={prog.num}
              title={prog.title}
              desc={prog.desc}
              imageSrc={prog.image}
              points={[prog.en, prog.conclusion]}
            />
          ))}
        </StaggerChildren>
      </SectionWrapper>

      {/* --- Section 7: Star Invitation & Camp --- (Pattern A: image hero header) */}
      <div id="stars" className="scroll-mt-24">
      <section className="relative w-full min-h-[50vh] flex items-center overflow-hidden">
        <Image src={images.stars} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-[var(--bg)]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-[var(--bg)]/80" />
        <div className="relative z-10 w-full">
          <div className="max-w-6xl mx-auto px-6 py-24 text-center">
            <FadeUp>
              <p className="label-upper text-gold mb-4">PART 2 &bull; PROGRAMS</p>
              <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-4">
                2. Star Invitation &amp; Camp
              </h2>
            </FadeUp>
          </div>
        </div>
      </section>

      <SectionWrapper>
        {/* 7.1 Star invitation strategy */}
        <FadeUp delay={0.1}>
          <div className="mb-12">
            <h3 className="heading-section text-xl text-[var(--text)] mb-3">7.1 헐리우드 스타 초청 전략</h3>
            <p className="text-body text-[var(--text-dim)] text-sm mb-6">
              헐리우드 현지 법인 또는 에이전시(CAA, WME, UTA)를 통한 직접적 초청 루트를 확보합니다.
            </p>
            <DataTable
              headers={['초청 대상 (예시)', '섭외 채널', '프로그램 연계']}
              rows={[
                ['할 베리 (Halle Berry)', 'CAA / 개인 에이전트', '갈라 스크리닝 주연작 상영 + 마스터 클래스'],
                ['키아누 리브스 (Keanu Reeves)', 'WME / 개인 에이전트', '개막식 특별 게스트 + 관객 밋앤그릿'],
                ['봉준호 감독', '국내 에이전시', '심사위원장 또는 마스터 클래스 연사'],
                ['송강호', '국내 에이전시', '개막작/폐막작 주연 배우 초청'],
                ['아시아 톱스타 (예: 량차오웨이)', '중국/홍콩 에이전시', '아시아 특별전 게스트'],
              ]}
            />
          </div>
        </FadeUp>

        {/* 7.2 Creator Camp */}
        <FadeUp delay={0.2}>
          <div className="mb-12">
            <h3 className="heading-section text-xl text-[var(--text)] mb-6">7.2 NextWave Creator Camp 규정 (요약)</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: '참가 자격', points: ['만 16세 이상 전 세계 누구나', '개인 또는 5인 이내 팀 참가', '스마트폰(아이폰/갤럭시) 촬영 필수', '참가비 포함 (야영 장비 기본 제공)'] },
                { title: '제작 규정', points: ['장르 자유 (실험/다큐/드라마/뮤비)', '러닝타임: 3분~15분 이내', '캠프 기간(48시간) 내 촬영\u00b7편집\u00b7제출', '모바일 촬영 원칙 (보조 장비 허용)'] },
                { title: '심사 및 시상', points: ['전문 심사위원단 + 관객 투표 병행', '대상: 상금 + 차기 영화제 정식 상영권', '우수작: 온라인 공식 채널 공개', '인기상: SNS 투표 기반'] },
              ].map((card) => (
                <GlassCard key={card.title} hover={false}>
                  <h4 className="heading-section text-base text-gold mb-4">{card.title}</h4>
                  <ul className="space-y-2">
                    {card.points.map((p, i) => (
                      <li key={i} className="text-body text-[var(--text-dim)] text-sm flex items-start gap-2">
                        <span className="text-gold mt-1 text-xs">&#9656;</span>{p}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* 7.3 VIP Management */}
        <FadeUp delay={0.3}>
          <div>
            <h3 className="heading-section text-xl text-[var(--text)] mb-6">7.3 의전 및 VIP 관리</h3>
            <DataTable
              headers={['항목', '내용']}
              rows={[
                ['공항 의전', '인천공항 VIP 통로, 전용 의전 차량, 다국어 수행원 배치'],
                ['숙소', '인스파이어 리조트 최상급 스위트 또는 파르나스호텔'],
                ['현장 의전', '전용 대기실, 보안 경호(2인 이상), 전속 코디네이터'],
                ['Rider 사항', '식이요법, 선호 차량, 동반인 체류, PR 제한 사항 등 사전 계약'],
                ['보험', '초청 게스트 상해보험, 배상 책임 보험 별도 가입'],
              ]}
              compact
            />
          </div>
        </FadeUp>
      </SectionWrapper>
      </div>

      {/* --- Section 8: Daily Simulation --- */}
      <section id="simulation" className="relative overflow-hidden scroll-mt-24">
        <Image src={images.simulation} alt="" fill className="object-cover opacity-[0.06]" />
        <div className="absolute inset-0 bg-[var(--bg)]/90" />
        <div className="relative z-10">
          <SectionWrapper alt>
            <FadeUp>
              <p className="label-upper text-gold mb-4">PART 2 &bull; PROGRAMS</p>
              <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-4">
                3. Daily Simulation
              </h2>
              <p className="text-body text-[var(--text-dim)] max-w-3xl mb-8">
                &quot;관객이 아침에 도착해서 밤늦게까지 머무르는&quot; 체류형 영화제의 하루
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <DataTable
                headers={['시간', '장소', '프로그램', '상세']}
                rows={[
                  ['09:00~10:00', '디스커버리 파크', '모닝 요가 & 아침 식사', '야영 참가자 기상, 캠프 내 모닝 루틴'],
                  ['10:00~12:00', '인접 CGV', '인디 섹션 상영 (메소드)', '메소드-인디 섹션 작품 2~3편 블록 상영 + GV'],
                  ['10:00~12:00', '디스커버리 파크', 'Creator Camp 활동', '모바일 영화 제작 워크숍, 촬영 실습'],
                  ['12:00~13:30', '오로라 푸드코트', 'K-푸드 팝업 런치', '인천 맛집 및 K-푸드 셰프 팝업 운영'],
                  ['13:30~15:30', 'MICE 시설', '마스터 클래스', '헐리우드 배우/감독의 특별 강연 및 Q&A'],
                  ['13:30~15:30', 'MICE 시설', '비즈니스 포럼', '공동 제작\u00b7투자 매칭 세션'],
                  ['15:30~16:00', '오로라', '네트워킹 브레이크', 'K-뷰티 체험 부스 방문, 굿즈 스토어'],
                  ['16:00~18:00', '인접 CGV', '경쟁작/초청작 상영', '경쟁 부문 작품 상영 + 감독 GV'],
                  ['18:00~19:00', '레드카펫 존', '레드카펫 & 포토콜', '저녁 행사 전 스타 레드카펫 이벤트'],
                  ['19:00~21:00', '아레나', '갈라 스크리닝', '대형 스크린 프리미어 상영, 감독\u00b7배우 무대 인사'],
                  ['21:00~23:00', '디스커버리 파크', 'K-팝 콘서트 & 야외 상영', '미니 라이브 공연 후 야외 대형 스크린 상영'],
                  ['23:00~', '디스커버리 파크', '캠프파이어 & 네트워킹', '영화인\u00b7관객\u00b7캠퍼 자유 교류, DJ 세트'],
                ]}
                compact
              />
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="mt-8 p-6 bg-gold/5 border border-gold/20 rounded-[var(--radius-card)]">
                <p className="text-body text-[var(--text)] text-sm leading-relaxed">
                  <span className="text-gold font-medium">핵심 포인트:</span> 관객은 CGV에서 영화를 보고, 아레나에서 갈라를 경험하고, 디스커버리 파크에서 캠핑과 K-컬처를 즐기며, MICE에서 비즈니스 미팅을 한다. 하루 종일 다양한 콘텐츠가 끊임없이 이어지는 체류형 영화제의 완성.
                </p>
              </div>
            </FadeUp>
          </SectionWrapper>
        </div>
      </section>

      {/* --- Section 9: Civic Participation --- */}
      <SectionWrapper id="volunteer" className="scroll-mt-24">
        <FadeUp>
          <p className="label-upper text-gold mb-4">PART 2 &bull; PROGRAMS</p>
          <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-8">
            4. Civic Participation
          </h2>
        </FadeUp>

        <FadeUp delay={0.1}>
          <DataTable
            headers={['구분', '프로그램명', '역할 및 혜택', '연계 특징']}
            rows={[
              ['핵심 활동 참여', 'i-NextWave Creator Camp 코디네이터', '캠프 운영 지원, 외국인 참가자 통역/안내, 야영 안전 관리 보조', '모바일/야영'],
              ['홍보 및 피드백', '인천 글로벌 모니터링단 (IGM)', '해외 관람객 유치 피드백, K-컬처 체험 동선 점검, 바이럴 홍보 콘텐츠 제작', 'K-컬처'],
              ['지역 연결고리', '메소드 인디 섹션 서포터', '독립 영화관 안내, 아트 스크리닝 셔틀 안내 및 영화 정보 공유', '메소드'],
              ['인센티브', 'VIP 패스, 공식 굿즈, 헐리우드 스타 멘토링 클래스 특별 참석 기회', '', ''],
            ]}
          />
        </FadeUp>
      </SectionWrapper>

      {/* ============================================================ */}
      {/* PART 3 — 전략 (Strategy)                                      */}
      {/* ============================================================ */}

      {/* Image strip before Part 3 */}
      {/* Part 3 wrapper — scroll target for "전략" nav */}
      <section id="part-strategy" className="scroll-mt-24">
        <div className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden">
          <Image src={images.partDivider3} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        </div>

        <PartDivider part={3} title="전략" />
      </section>

      {/* --- Section 10: Core Strategy --- (Pattern B: subtle background) */}
      <section id="strategy" className="relative overflow-hidden scroll-mt-24">
        <Image src={images.strategy} alt="" fill className="object-cover opacity-[0.06]" />
        <div className="absolute inset-0 bg-[var(--bg)]/90" />
        <div className="relative z-10">
          <SectionWrapper alt>
            <FadeUp>
              <p className="label-upper text-gold mb-4">PART 3 &bull; STRATEGY</p>
              <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-8">
                1. Core Strategy
              </h2>
            </FadeUp>

            <FadeUp delay={0.1}>
              <DataTable
                headers={['번호', '핵심 특징', '영화제 비전', '구체적 실현 전략']}
                rows={[
                  ['1', '아시아와 헐리우드의 만남', '"The Gateway: 아시아-헐리우드, 새로운 물결의 시작"', '개막식 및 레드카펫: 인스파이어 아레나 활용, 글로벌\u00b7아시아 스타 공동 레드카펫. 비즈니스 & 포럼: MICE 시설에서 공동 제작 및 투자 유치 포럼 개최.'],
                  ['2', '모바일/야영/평가/상영', '"모두가 감독, 모두가 비평가: NextWave Creator Camp"', '디스커버리 파크에 국제 야영장 조성. 참가자들이 모바일폰으로 영화를 제작하고, 야외 대형 스크린에서 상영 및 상호 평가 진행.'],
                  ['3', '메소드필름페스타 융합', '"Method-Indie Channel: 독립영화 정신 계승"', '\'i-NWFF 메소드필름 인디 섹션\' 신설. 공동 심사 및 초청을 통해 독립영화의 권위를 확보.'],
                  ['4', '헐리우드 유명배우 참여', '"Star Power & Global Mentoring"', '헐리우드 A급 배우 출연작 상영 및 배우 초청. 아레나에서 \'글로벌 멘토링 클래스\' 운영.'],
                  ['5', '인천-하와이 교차 개최', '"Dual-Hub Strategy: 아시아-태평양 문화 교류"', '1~3회는 인천 기반 구축, 4회부터 하와이 국제영화제와 협력하여 교차 개최 로드맵 수립.'],
                  ['6', 'K-컬처 융합', '"Beyond Cinema: K-WAVE Festival"', '디스커버리 파크 내 K-팝 미니 콘서트/버스킹 존, K-푸드 팝업 스토어, K-뷰티 체험 부스를 통합 운영.'],
                ]}
              />
            </FadeUp>
          </SectionWrapper>
        </div>
      </section>

      {/* --- Section 11: Organization --- */}
      <SectionWrapper id="organization" className="scroll-mt-24">
        <FadeUp>
          <p className="label-upper text-gold mb-4">PART 3 &bull; STRATEGY</p>
          <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-8">
            2. Organization
          </h2>
        </FadeUp>

        {/* Org chart as simplified hierarchy */}
        <FadeUp delay={0.1}>
          <div className="mb-12">
            <h3 className="heading-section text-xl text-[var(--text)] mb-6">2.1 조직도 (3단계)</h3>
            <OrgChart
              data={{
                title: '추진 위원회 (위원장)',
                children: [
                  {
                    title: '총괄사업추진단장',
                    children: [
                      { title: '예술 전략 및 감독' },
                      { title: '사무국 (집행 조직)' },
                      { title: '실무 운영' },
                      { title: '전문 위원회 & 파트너' },
                    ],
                  },
                ],
              }}
            />
          </div>
        </FadeUp>

        {/* Role table */}
        <FadeUp delay={0.2}>
          <div>
            <h3 className="heading-section text-xl text-[var(--text)] mb-6">2.2 참여 가능 그룹별 역할</h3>
            <DataTable
              headers={['그룹', '조직 역할', '주요 임무 및 참여 명분']}
              rows={[
                ['인천광역시 & 인천국제공항공사', '조직위원회 및 공동 주최', '행정/재정 지원, 국제 협력, 장소 사용 허가'],
                ['인스파이어 리조트', '집행위원회 및 공동 주최', '주요 시설 제공 및 운영, 숙박/F&B 협력, 마케팅/홍보 협력'],
                ['CGV (또는 주요 영화관 체인)', '실무 집행 (상영 시설)', '상영관 시설 제공 및 기술 운영, 티켓 시스템 연동'],
                ['한국 영화진흥위원회(KOFIC) & 영상위원회', '전문 위원회 (심사/교육)', '국내 독립 영화 발굴 및 지원, 영화 인력 양성 프로그램'],
                ['메소드필름페스타(Method Fest)', '전문 위원회 (해외 협력)', '독립 영화 섹션 공동 기획, 헐리우드 독립영화인 네트워크 연계'],
                ['글로벌 콘텐츠 에이전시 (CAA, UTA)', '전문 위원회 (스타 섭외)', '헐리우드 유명 배우 및 감독 초청 대행, 비즈니스 미팅 주선'],
                ['엔터테인먼트 기획사 (하이브, JYP 등)', '파트너 그룹 (K-컬처 융합)', 'K-팝 공연 콘텐츠 제공, K-뷰티/푸드 프로그램 기획 협력'],
                ['통신사/IT 기업 (SKT, KT)', '파트너 그룹 (모바일 영화)', '모바일 영화 제작 키트 및 기술 지원, 5G 라이브 스트리밍'],
              ]}
              compact
            />
          </div>
        </FadeUp>
      </SectionWrapper>

      {/* --- Section 12: 3-Year Roadmap --- */}
      <section id="roadmap" className="relative overflow-hidden scroll-mt-24">
        <Image src={images.roadmap} alt="" fill className="object-cover opacity-[0.06]" />
        <div className="absolute inset-0 bg-[var(--bg)]/90" />
        <div className="relative z-10">
          <SectionWrapper alt>
            <FadeUp>
              <p className="label-upper text-gold mb-4">PART 3 &bull; STRATEGY</p>
              <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-8">
                3. 3-Year Roadmap
              </h2>
            </FadeUp>

            <FadeUp delay={0.1}>
              <TimelineRoadmap
                phases={[
                  {
                    label: '1단계',
                    title: 'Foundation \u2014 1회',
                    items: [
                      '공식 조직위/집행위원회 발족 (인천시-인스파이어-메소드 파트너십)',
                      '아레나 개막식 & CGV 상영관 인디 섹션 운영 집중',
                      '\'NextWave Creator Camp\' 시범 운영 (국내외 100팀 제한)',
                      'K-팝 연계 미니 콘서트 도입',
                    ],
                  },
                  {
                    label: '2단계',
                    title: 'Expansion \u2014 2회',
                    items: [
                      '\'아시아-헐리우드 비즈니스 마켓\' 정식 런칭 및 MICE 활용',
                      '헐리우드 유명 배우 마스터 클래스 정례화 및 확대',
                      '디스커버리 파크 국제 야영/모바일 영화제 규모 2배 확장',
                      'K-컬처 연계 프로그램(푸드, 뷰티) 대폭 강화',
                    ],
                  },
                  {
                    label: '3단계',
                    title: 'Globalization \u2014 3회',
                    items: [
                      '하와이 국제영화제와 공식 협력 MOU 체결 및 교차 개최 로드맵 확정',
                      '메소드 섹션을 공식 경쟁 부문으로 격상',
                      '3개년 성과 분석 및 장기 비전 수립',
                    ],
                  },
                ]}
              />
            </FadeUp>

            {/* Space utilization table */}
            <FadeUp delay={0.2}>
              <div className="mt-16">
                <h3 className="heading-section text-xl text-[var(--text)] mb-6">공간 활용 및 프로그램 배치 계획</h3>
                <DataTable
                  headers={['장소', '주요 프로그램', '활용 특징']}
                  rows={[
                    ['인스파이어 아레나', '개/폐막식 및 레드카펫, K-팝 스타 초청 \'갈라 콘서트\'', '1, 4, 6'],
                    ['디스커버리 파크', '\'NextWave Creator Camp\', 야외 상영 및 평가회, K-푸드/뷰티 존', '2, 6'],
                    ['인스파이어 MICE 시설', '아시아-헐리우드 공동 제작 포럼/마켓, 마스터 클래스', '1, 4'],
                    ['인접 CGV 등 상영관', '\'메소드-인디 섹션\' 전용 상영관, 일반 초청작/경쟁작 상영', '3'],
                    ['오로라 (디지털 스트리트)', '모바일 수상작 디지털 전시, 포토존 및 스폰서십 공간', '2, 6'],
                  ]}
                  compact
                />
              </div>
            </FadeUp>
          </SectionWrapper>
        </div>
      </section>

      {/* --- Section 13: A-to-Z Roadmap --- */}
      <SectionWrapper id="atoz-roadmap" className="scroll-mt-24">
        <FadeUp>
          <p className="label-upper text-gold mb-4">PART 3 &bull; STRATEGY</p>
          <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-4">
            4. A-to-Z Roadmap
          </h2>
          <p className="text-body text-[var(--text-dim)] max-w-3xl mb-8">
            전체 예산 30억 원 기준, 현금 흐름을 고려한 적시 투입 계획
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <TimelineRoadmap
            phases={[
              {
                label: '1단계',
                title: '추진위 발족 (2025.10 ~ 2026.01)',
                items: [
                  '법인 설립, 초기 씨드 자금 확보(2.5억), 핵심 파트너십(인스파이어, 인천시) MOU 체결',
                  '비용: 2.5억 원 (인건비, 법인 설립비, CI 개발, 기획 연구비)',
                ],
              },
              {
                label: '2단계',
                title: '조직위 출범 (2026.02 ~ 2026.04)',
                items: [
                  '사무국 인력 채용(팀장급), 프로그램 섹션 확정, 1차 스폰서십 유치 완료(30%)',
                  '비용: 5억 원 (운영비, 홈페이지 구축, 해외 게스트 섭외 착수금)',
                ],
              },
              {
                label: '3단계',
                title: '프로그램 확정 & 마케팅 (2026.05 ~ 2026.07)',
                items: [
                  '상영작 선정, 헐리우드 스타 초청 확정, 티켓 예매 오픈, 자원활동가 모집',
                  '비용: 10억 원 (게스트 항공/숙박, 홍보비, 시설 계약금)',
                ],
              },
              {
                label: '4단계',
                title: '현장 준비 & 개최 (2026.08 ~ 2026.10)',
                items: [
                  '시설물 설치, 리허설, 영화제 개최, 안전 관리',
                  '비용: 12.5억 원 (행사 운영비, 무대 설치비, 인건비, 체류비)',
                ],
              },
            ]}
          />
        </FadeUp>

        {/* Org chart for committee */}
        <FadeUp delay={0.2}>
          <div className="mt-16">
            <h3 className="heading-section text-xl text-[var(--text)] mb-6">13.2 조직위원회 구조</h3>
            <OrgChart
              data={{
                title: '조직 위원장 (시장/기업인)',
                children: [
                  {
                    title: '집행 위원장 (총괄 Expert)',
                    children: [
                      {
                        title: '사무국장',
                        children: [
                          { title: '경영지원팀', role: '예산/계약/인사' },
                          { title: '프로그램팀', role: '상영작/게스트/캠프' },
                          { title: '운영/기술팀', role: '현장/영사/셔틀' },
                          { title: '홍보마케팅팀', role: '티켓/SNS/프레스' },
                          { title: '대외협력팀', role: '스폰서/정부/MOU' },
                        ],
                      },
                    ],
                  },
                ],
              }}
            />
          </div>
        </FadeUp>

        {/* Team KPIs */}
        <FadeUp delay={0.3}>
          <div className="mt-12">
            <h3 className="heading-section text-xl text-[var(--text)] mb-6">13.3 팀별 KPI (핵심 성과 지표)</h3>
            <DataTable
              headers={['조직', '확인 방법 (KPI)', '달성 기준']}
              rows={[
                ['프로그램팀', '초청 수락서(LOI) 확보율', 'D-3개월까지 주요 게스트/작품 90% 계약 완료'],
                ['마케팅팀', '티켓 예매율 및 SNS 도달률', '얼리버드 10분 내 매진 / 팔로워 5만 명'],
                ['운영팀', '시설 안전 점검 필증', 'D-1개월 전 모든 시설 안전 검사 \'적합\' 판정'],
                ['대외협력팀', '스폰서십 입금 달성률', 'D-2개월 전 목표 후원금 100% 약정 체결'],
              ]}
              compact
            />
          </div>
        </FadeUp>
      </SectionWrapper>

      {/* --- Section 14: Space & Partners --- (Pattern A: image hero for venues) */}
      <div id="space" className="scroll-mt-24">
      <section className="relative w-full min-h-[50vh] flex items-center overflow-hidden">
        <Image src={images.space} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-[var(--bg)]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-[var(--bg)]/80" />
        <div className="relative z-10 w-full">
          <div className="max-w-6xl mx-auto px-6 py-24 text-center">
            <FadeUp>
              <p className="label-upper text-gold mb-4">PART 3 &bull; STRATEGY</p>
              <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-4">
                5. Space &amp; Partners
              </h2>
            </FadeUp>
          </div>
        </div>
      </section>

      <SectionWrapper alt>
        {/* 10.1 Space strategy */}
        <FadeUp delay={0.1}>
          <div className="mb-12">
            <h3 className="heading-section text-xl text-[var(--text)] mb-6">10.1 인스파이어 리조트 공간별 활용 전략</h3>
            <DataTable
              headers={['공간', '면적/규모', '영화제 활용 프로그램']}
              rows={[
                ['인스파이어 아레나', '15,000석 다목적 공연장', '개\u00b7폐막식, 갈라 스크리닝, K-팝 콘서트, 시상식'],
                ['디스커버리 파크', '대규모 야외 공간', 'Creator Camp 야영, 야외상영, 캠핑 페스티벌, K-푸드/뷰티 존'],
                ['MICE 시설', '컨벤션\u00b7회의실', '비즈니스 포럼, 마스터 클래스, 프레스 센터, 투자자 네트워킹'],
                ['오로라(디지털 스트리트)', '약 200m 디지털 미디어 조형물', '모바일 수상작 디지털 전시, 포토존, 스폰서 디지털 광고'],
                ['호텔\u00b7리조트', '숙박 시설', 'VIP/게스트 숙소, 관객 패키지 연계'],
              ]}
            />
          </div>
        </FadeUp>

        {/* 10.2 City linkage */}
        <FadeUp delay={0.2}>
          <div className="mb-12">
            <h3 className="heading-section text-xl text-[var(--text)] mb-6">10.2 인천 도심 연계 전략</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: '영화공간 주안', desc: '인천의 독립영화 거점. 메소드-인디 섹션 위성 상영관 및 아트 스크리닝 셔틀 운영.' },
                { title: '송도 국제도시', desc: '해외 비즈니스 게스트 숙박 대안, 네트워킹 디너 및 VIP 라운지 운영.' },
                { title: '인천 구도심', desc: '개항장 일대 로케이션 투어, 인천 아트 시네마 연계 특별 상영.' },
              ].map((c) => (
                <GlassCard key={c.title} hover={false}>
                  <h4 className="heading-section text-base text-gold mb-3">{c.title}</h4>
                  <p className="text-body text-[var(--text-dim)] text-sm">{c.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* 10.3 K-Culture partners */}
        <FadeUp delay={0.3}>
          <div>
            <h3 className="heading-section text-xl text-[var(--text)] mb-6">10.3 K-컬처 파트너 네트워크</h3>
            <DataTable
              headers={['발굴 카테고리', '잠재적 협력 파트너 (예시)', '영화제 기여 역할']}
              rows={[
                ['K-식품 / F&B', '인천 지역 맛집, CJ푸드빌', 'K-푸드 팝업 운영, 캠프 식음 케이터링'],
                ['K-뷰티', '아모레퍼시픽, 올리브영', '메이크업 체험 부스, 스타 뷰티 클래스'],
                ['K-팝\u00b7엔터', '하이브, JYP, SM', '미니 콘서트, 팬미팅, K-팝 스타 레드카펫'],
                ['K-관광', '인천관광공사, 한국관광공사', '외국인 관광 패키지, 팸투어 운영'],
              ]}
              compact
            />
          </div>
        </FadeUp>
      </SectionWrapper>
      </div>

      {/* --- Section 15: BIFF Comparison --- */}
      <section id="biff" className="relative overflow-hidden scroll-mt-24">
        <Image src={images.biff} alt="" fill className="object-cover opacity-[0.06]" />
        <div className="absolute inset-0 bg-[var(--bg)]/90" />
        <div className="relative z-10">
          <SectionWrapper>
            <FadeUp>
              <p className="label-upper text-gold mb-4">PART 3 &bull; STRATEGY</p>
              <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-4">
                6. BIFF Comparison
              </h2>
              <p className="text-body text-[var(--text-dim)] max-w-3xl mb-8">
                선배 영화제의 성과를 &apos;벤치마크&apos;로, IIFF만의 차별점을 &apos;전략적 무기&apos;로 삼는다
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <ComparisonTable
                competitorName="BIFF"
                items={[
                  { category: '위상', competitor: '아시아 최대 A급 국제영화제', iiff: '아시아 최초 \'미래형 융합 영화 플랫폼\'' },
                  { category: '주요 콘텐츠', competitor: '정통 영화 상영 및 시상 중심', iiff: '영화 + 모바일 + K-컬처 + 야영 + 공연 융합' },
                  { category: '예산 규모(1회)', competitor: '약 200억 원 (현재)', iiff: '약 30억 원 (인스파이어 현물 포함 시 50억+)' },
                  { category: '핵심 관객층', competitor: '영화 관계자, 시네필', iiff: '영화인 + MZ세대 + 글로벌 K-컬처 팬 + 관광객' },
                  { category: '장소', competitor: '영화의 전당 (부산 센텀시티)', iiff: '인스파이어 리조트 + 인천 도심 상영관' },
                  { category: '헐리우드 연계', competitor: '매년 할리우드 스타 초청 (수동적)', iiff: 'Method Fest 공동 운영 (구조적 연결)' },
                  { category: '차별화 무기', competitor: '30년 축적된 권위와 네트워크', iiff: '모바일 영화제, 야영 캠프, K-컬처 융합, 인스파이어 인프라' },
                ]}
              />
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="mt-8 p-6 bg-gold/5 border border-gold/20 rounded-[var(--radius-card)]">
                <p className="text-body text-[var(--text)] text-sm leading-relaxed">
                  <span className="text-gold font-medium">전략적 시사점:</span> BIFF와 정면 경쟁이 아닌, BIFF가 커버하지 못하는 &apos;미래형\u00b7체험형\u00b7K-컬처 융합형&apos; 영역에서 독자적 포지션을 확보한다. BIFF가 &apos;권위&apos;의 영화제라면, IIFF는 &apos;경험&apos;의 영화제.
                </p>
              </div>
            </FadeUp>
          </SectionWrapper>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PART 4 — 재무 (Finance)                                       */}
      {/* ============================================================ */}

      {/* Image strip before Part 4 */}
      {/* Part 4 wrapper — scroll target for "재무" nav */}
      <section id="part-finance" className="scroll-mt-24">
        <div className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden">
          <Image src={images.partDivider4} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        </div>

        <PartDivider part={4} title="재무" />
      </section>

      {/* --- Section 16: Budget Plan --- (Pattern B: subtle background) */}
      <section id="budget" className="relative overflow-hidden scroll-mt-24">
        <Image src={images.budget} alt="" fill className="object-cover opacity-[0.06]" />
        <div className="absolute inset-0 bg-[var(--bg)]/90" />
        <div className="relative z-10">
          <SectionWrapper alt>
            <FadeUp>
              <p className="label-upper text-gold mb-4">PART 4 &bull; FINANCE</p>
              <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-4">
                1. Budget Plan
              </h2>
              <p className="text-body text-[var(--text-dim)] max-w-3xl mb-12">
                제1회 기준, 30억 원 규모
              </p>
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <FadeUp delay={0.1}>
                <div>
                  <h3 className="heading-section text-lg text-gold mb-4">재원 확보 (Revenues)</h3>
                  <DataTable
                    headers={['항목', '금액', '비율']}
                    rows={[
                      ['공적 자금 (시/정부)', '10억 원', '33.3%'],
                      ['기업 스폰서십 (민간)', '12억 원', '40.0%'],
                      ['수익 사업 (Ticket & Market)', '6억 원', '20.0%'],
                      ['기타 (재단 기금 등)', '2억 원', '6.7%'],
                      ['합계', '30억 원', '100%'],
                    ]}
                    compact
                  />
                </div>
              </FadeUp>

              <FadeUp delay={0.2}>
                <div>
                  <h3 className="heading-section text-lg text-gold mb-4">지출 항목 (Expenses)</h3>
                  <DataTable
                    headers={['항목', '금액', '비율']}
                    rows={[
                      ['프로그램 운영비', '8억 원', '26.7%'],
                      ['초청 및 의전비', '9억 원', '30.0%'],
                      ['마케팅 및 홍보비', '6억 원', '20.0%'],
                      ['시설 및 인프라', '4억 원', '13.3%'],
                      ['인건비 및 일반 관리비', '3억 원', '10.0%'],
                      ['합계', '30억 원', '100%'],
                    ]}
                    compact
                  />
                </div>
              </FadeUp>
            </div>

            <FadeUp delay={0.3}>
              <div>
                <h3 className="heading-section text-lg text-[var(--text)] mb-4">예산 확보 전략</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    '정부/지자체 지원: 인천시, 문체부, 영화진흥위원회 등 공적 지원금 유치',
                    '인스파이어 공동 주최: 아레나, 디스커버리 파크, MICE 등 시설 사용료 대폭 감면 또는 현물 투자',
                    '기업 스폰서십: K-컬처, IT/모바일, 항공사 등 연계 기업의 전략적 스폰서십 유치',
                    '수익 사업: 티켓 판매, 비즈니스 마켓 참가비, 야영 참가비, K-컬처 팝업 스토어 임대 수익',
                  ].map((s, i) => (
                    <div key={i} className="p-4 border border-[var(--border)] rounded-[var(--radius-card)] bg-[var(--bg-card)]">
                      <p className="text-body text-[var(--text-dim)] text-sm">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </SectionWrapper>
        </div>
      </section>

      {/* --- Section 17: Cash Flow --- */}
      <SectionWrapper id="cashflow" className="scroll-mt-24">
        <FadeUp>
          <p className="label-upper text-gold mb-4">PART 4 &bull; FINANCE</p>
          <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-4">
            2. Cash Flow
          </h2>
          <p className="text-body text-[var(--text-dim)] max-w-3xl mb-8">
            &quot;성공적인 영화제는 &apos;돈맥경화&apos;가 없어야 한다&quot; &mdash; 단위: 백만 원
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <DataTable
            headers={['구분', '1분기 (D-12~9)\n추진위 단계', '2분기 (D-8~6)\n조직위 출범', '3분기 (D-5~3)\n본격 준비', '4분기 (D-2~D+1)\n개최 및 정산', '합계']}
            rows={[
              ['현금 유입', '250', '800', '1,000', '950', '3,000'],
              ['\u203a 지자체/공공', '100 (Seed)', '400 (보조금 1차)', '300 (보조금 2차)', '200 (Balance)', '1,000'],
              ['\u203a 민간 스폰서', '100 (Seed)', '400 (1차 후원)', '500 (2차 후원)', '200 (Balance)', '1,200'],
              ['\u203a 자체 수익', '50 (기부금)', '\u2013', '200 (티켓/참가비)', '550 (티켓/마켓)', '800'],
              ['현금 유출', '200', '600', '900', '1,300', '3,000'],
              ['\u203a 인건비/운영', '100', '200', '200', '300', '800'],
              ['\u203a 초청/체류비', '20 (계약금)', '200 (선급금)', '300 (중도금)', '380 (잔금)', '900'],
              ['\u203a 마케팅비', '50', '100', '250', '200', '600'],
              ['\u203a 시설/제작비', '30', '100', '150', '420', '700'],
              ['현금 잔액', '+50', '+250', '+350', '0', '0'],
            ]}
            compact
          />
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {[
              '3분기 관리 중요: 마케팅과 헐리우드 게스트 선급금이 대거 지출되므로, 스폰서십 2차 후원금이 제때 들어오도록 독려',
              '예비비 확보: 전체 예산의 5~10%는 예비비로 편성하여 우천, 환율 변동, 안전 사고 등 돌발 변수 대비',
            ].map((t, i) => (
              <div key={i} className="p-4 border border-gold/20 rounded-[var(--radius-card)] bg-gold/5">
                <p className="text-body text-[var(--text-dim)] text-sm">{t}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </SectionWrapper>

      {/* --- Section 18: Initial Budget --- */}
      <section id="seedmoney" className="relative overflow-hidden scroll-mt-24">
        <Image src={images.sponsorship} alt="" fill className="object-cover opacity-[0.06]" />
        <div className="absolute inset-0 bg-[var(--bg)]/90" />
        <div className="relative z-10">
          <SectionWrapper alt>
            <FadeUp>
              <p className="label-upper text-gold mb-4">PART 4 &bull; FINANCE</p>
              <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-8">
                3. Initial Budget
              </h2>
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-8">
              <FadeUp delay={0.1}>
                <div>
                  <h3 className="heading-section text-lg text-gold mb-4">추진위원회 초기 경비 (약 6개월)</h3>
                  <DataTable
                    headers={['항목', '금액 (백만 원)', '용도']}
                    rows={[
                      ['인건비 및 운영비', '80', '코어 인력(3인) 인건비, 사무실 임차'],
                      ['회의 및 네트워킹', '60', '추진위/분과위 회의, 비전 발표회'],
                      ['초기 네트워크 구축', '80', '메소드페스타/하와이 MOU 출장, 헐리우드 접촉'],
                      ['홍보물 및 자료 제작', '30', '비전 선포 자료, 홈페이지, 로고/디자인'],
                      ['총계', '250', '(한화 2억 5천만 원)'],
                    ]}
                    compact
                  />
                </div>
              </FadeUp>

              <FadeUp delay={0.2}>
                <div>
                  <h3 className="heading-section text-lg text-gold mb-4">50:50 매칭 펀딩 전략</h3>
                  <DataTable
                    headers={['단계', '전략', '목표 금액']}
                    rows={[
                      ['1단계', '공공 시드 확보 (40%)\n인천시 문화예술진흥기금 활용', '100백만 원'],
                      ['2단계', '민간 매칭 펀드 (40%)\n인스파이어 현금/현물 지원', '100백만 원'],
                      ['3단계', '후원회 멤버십 (20%)\n위원 중심 초기 모금', '50백만 원'],
                    ]}
                    compact
                  />
                </div>
              </FadeUp>
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* --- Section 19: Sponsorship Plan --- */}
      <SectionWrapper id="sponsorship" className="scroll-mt-24">
        <FadeUp>
          <p className="label-upper text-gold mb-4">PART 4 &bull; FINANCE</p>
          <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-8">
            4. Sponsorship Plan
          </h2>
        </FadeUp>

        {/* 9.1 Tier System */}
        <FadeUp delay={0.1}>
          <div className="mb-12">
            <h3 className="heading-section text-xl text-[var(--text)] mb-6">9.1 스폰서십 등급 (Tier System)</h3>
            <DataTable
              headers={['등급', '금액 기준', '주요 혜택']}
              rows={[
                ['타이틀 스폰서', '5억 원 이상', '영화제 공식 명칭 삽입, 모든 홍보물 로고 노출, 개막식 VIP석, 전용 브랜드 존 운영'],
                ['프리미엄 파트너', '2~5억 원', '핵심 섹션 네이밍권 (갈라/캠프/어워드), 주요 행사 VIP 초대, 프레스 월 로고 노출'],
                ['공식 파트너', '5천만~2억 원', '홈페이지 및 공식 인쇄물 로고, K-컬처 존 부스 운영권, SNS 콜라보 콘텐츠'],
                ['서포터', '5천만 원 이하', '홈페이지 로고 게시, 공식 굿즈 콜라보, 소규모 체험 부스 운영'],
              ]}
            />
          </div>
        </FadeUp>

        {/* 9.2 Target sponsors */}
        <FadeUp delay={0.2}>
          <div className="mb-12">
            <h3 className="heading-section text-xl text-[var(--text)] mb-6">9.2 타겟 스폰서 업종 및 접근 전략</h3>
            <DataTable
              headers={['업종', '타겟 기업 (예시)', '연계 가능 프로그램', '접근 방식']}
              rows={[
                ['IT/모바일', '삼성, Apple, SKT', '모바일 영화 컴피티션 (촬영 기기 제공 + 네이밍)', '모바일 콘텐츠 제작 인프라 제공 제안'],
                ['항공/여행', '대한항공, 아시아나', '해외 게스트 항공 지원 + 관광 패키지 공동 개발', '인천공항 → 영화제 연결 동선 마케팅'],
                ['소비재/뷰티', '아모레퍼시픽, LG생활건강', 'K-뷰티 체험 부스 + 스타 메이크업 쇼', '글로벌 관객 대상 제품 노출 + 체험'],
                ['식음료', 'CJ제일제당, 하이트진로', 'K-푸드 팝업 스토어 + 캠프 식음 지원', '야외 축제 환경에서 브랜드 체험 극대화'],
                ['자동차', '현대, 기아', '공식 의전 차량 + 레드카펫 차량 전시', '프리미엄 이미지 연계 (EV/수소차)'],
                ['금융', 'KB, 신한, 하나', 'K-콘텐츠 펀드/투자 연계 포럼', 'ESG 활동 + 문화 투자 포트폴리오'],
              ]}
              compact
            />
          </div>
        </FadeUp>

        {/* 9.3 Three-year strategy */}
        <FadeUp delay={0.3}>
          <div>
            <h3 className="heading-section text-xl text-[var(--text)] mb-6">9.3 3개년 스폰서십 전략</h3>
            <DataTable
              headers={['연차', '전략', '스폰서십 목표']}
              rows={[
                ['1회차', '핵심 파트너 확보 + 현물 스폰서 중심', '~12억 원 (인스파이어 현물 포함)'],
                ['2회차', '브랜드 경쟁 구도 형성 + 프리미엄 네이밍 판매', '~20억 원'],
                ['3회차', '글로벌 브랜드 유치 + 멀티이어 계약 전환', '~30억 원'],
              ]}
            />
          </div>
        </FadeUp>
      </SectionWrapper>

      {/* --- Section 20: Marketing Strategy --- */}
      <section id="marketing" className="relative overflow-hidden scroll-mt-24">
        <Image src={images.marketing} alt="" fill className="object-cover opacity-[0.06]" />
        <div className="absolute inset-0 bg-[var(--bg)]/90" />
        <div className="relative z-10">
          <SectionWrapper alt>
            <FadeUp>
              <p className="label-upper text-gold mb-4">PART 4 &bull; FINANCE</p>
              <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-8">
                5. Marketing Strategy
              </h2>
            </FadeUp>

            {/* 6.1 Global awareness */}
            <FadeUp delay={0.1}>
              <div className="mb-12">
                <h3 className="heading-section text-xl text-[var(--text)] mb-6">6.1 글로벌 인지도 확보 (전문성 강조)</h3>
                <DataTable
                  headers={['전략', '세부 활동']}
                  rows={[
                    ['헐리우드 네트워크 활용', '헐리우드 스타 및 메소드필름페스타 관계자와의 독점 인터뷰를 글로벌 주요 영화 매체(Variety, Hollywood Reporter 등)에 제공'],
                    ['아시아 게이트웨이 브랜딩', '아시아 주요 영화 시장 관계자를 초청하고, 개막식에 아시아 대표 배우 및 감독 배치'],
                    ['타겟 미디어 파트너십', '영화 전문 매거진 및 비즈니스 콘텐츠 미디어(포브스 아시아)와 협력'],
                  ]}
                />
              </div>
            </FadeUp>

            {/* 6.2 Mass participation */}
            <FadeUp delay={0.2}>
              <div className="mb-12">
                <h3 className="heading-section text-xl text-[var(--text)] mb-6">6.2 대중 참여 및 바이럴 (참여성 강조)</h3>
                <DataTable
                  headers={['전략', '세부 활동']}
                  rows={[
                    ['NextWave Creator Challenge', '모바일 영화 제작 캠프를 숏폼 콘텐츠로 제작\u00b7배포. 인플루언서 참가자 초청'],
                    ['K-WAVE 페스티벌 통합 홍보', '\'영화와 캠핑을 함께 즐기는 유일한 축제\'로 포지셔닝'],
                    ['인스파이어 연계 마케팅', '숙박/F&B 패키지와 영화제 티켓 묶어 판매, 상호 시너지 창출'],
                  ]}
                />
              </div>
            </FadeUp>

            {/* 6.3 Promotion timeline */}
            <FadeUp delay={0.3}>
              <div>
                <h3 className="heading-section text-xl text-[var(--text)] mb-6">6.3 홍보 콘텐츠 및 프로모션 타임라인</h3>
                <DataTable
                  headers={['콘텐츠', '내용', '시기']}
                  rows={[
                    ['티저 영상', '아시아와 헐리우드 스타들의 과거 명장면과 인스파이어의 화려한 시설을 교차 편집하여 \'NextWave\' 컨셉 강조', 'D-120 days'],
                    ['공식 포스터', '인천의 도시 경관, 아레나, 디스커버리 파크의 야외 상영 장면을 모두 담아 영화제의 \'공간적 특색\' 시각화', 'D-90 days'],
                    ['얼리버드 티켓', '개/폐막식 및 NextWave 캠프 참가권을 한정 수량 판매하여 초기 관심도 및 현금 유동성 확보', 'D-60 days'],
                    ['인천 시민 우대', '인천 거주자에게 CGV 인디 섹션 티켓 할인 제공 (지역 밀착형 영화제)', 'D-30 days'],
                  ]}
                  compact
                />
              </div>
            </FadeUp>
          </SectionWrapper>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PART 5 — 거버넌스 (Governance)                                 */}
      {/* ============================================================ */}

      {/* Image strip before Part 5 */}
      {/* Part 5 wrapper — scroll target for "거버넌스" nav */}
      <section id="part-governance" className="scroll-mt-24">
        <div className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden">
          <Image src={images.partDivider5} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        </div>

        <PartDivider part={5} title="거버넌스" />
      </section>

      {/* --- Section 21: Risk Management --- */}
      <section id="political" className="relative overflow-hidden scroll-mt-24">
        <Image src={images.governance} alt="" fill className="object-cover opacity-[0.06]" />
        <div className="absolute inset-0 bg-[var(--bg)]/90" />
        <div className="relative z-10">
          <SectionWrapper>
            <FadeUp>
              <p className="label-upper text-gold mb-4">PART 5 &bull; GOVERNANCE</p>
              <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-4">
                1. Risk Management
              </h2>
              <p className="text-body text-[var(--text-dim)] max-w-3xl mb-4">
                핵심 전략: &quot;先 민간 주도(준비) → 後 관(官) 추인(개최)&quot;
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="mb-8 p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-card)]">
                <p className="text-body text-[var(--text-dim)] text-sm leading-relaxed">
                  2026년 6월 지방선거 변수는 영화제의 생존과 지속성을 결정짓는 가장 중요한 요소. &apos;특정 정당이나 현직에 치우치지 않고, 선거 국면을 오히려 동력으로 활용하는&apos; 고도의 정치적 솔루션이 필요하다.
                </p>
                <p className="text-body text-gold text-sm mt-3 font-medium">
                  여야 후보 모두가 &quot;내가 당선되면 이 영화제를 적극 지원하겠다&quot;고 서약하게 만드는 &apos;역제안 전략&apos;
                </p>
              </div>
            </FadeUp>

            {/* Phase table */}
            <FadeUp delay={0.2}>
              <div className="mb-12">
                <DataTable
                  headers={['단계', '시기', '정치적 상황', '영화제 추진 핵심 과제']}
                  rows={[
                    ['1단계 민간 발족', '2025.12월', '현직 임기 말', '추진위 발족 (경제인+예술인+인스파이어, 정치인 배제). 100% 민간 씨드머니로 운영.'],
                    ['2단계 공약화', '2026.1~3월', '후보 경선 진행', '여야 유력 후보에게 \'영화제 지원 확약서\' 전달. 헐리우드 섭외 민간 채널로 병행.'],
                    ['3단계 선거 기간', '2026.4~5월', '공식 선거운동', '선거와 분리된 \'문화 비전 선포식\' 개최. 후보들의 방문\u00b7지지 발언 유도.'],
                    ['4단계 당선자 협력', '2026.6~7월', '선거(6.3) 및 인수위', '당선자를 당연직 조직위원장으로 추대. 추경 예산 편성 요청.'],
                    ['5단계 개최', '2026.8~10월', '신임 시장 취임 초기', '신임 시장의 \'취임 1호 문화 치적\'으로 포장하여 전폭적 지원 유도.'],
                  ]}
                  compact
                />
              </div>
            </FadeUp>

            {/* Principles */}
            <FadeUp delay={0.3}>
              <div className="mb-12">
                <h3 className="heading-section text-xl text-[var(--text)] mb-4">16.1 비당파 추진위원회 구성 원칙</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    '위원장: 영화제 관련 문화계 원로 (경제 활성화 명분은 여야 막론 반대 불가)',
                    '공동 위원장: 인스파이어 리조트 대표, 인천상공회의소 회장',
                    '고문단: 인천 지역 대학 총장, 원로 영화감독 (정치적 성향 중립인 인물)',
                    '원칙: 선거 전까지는 인천시 예산을 받지 않는 것이 오히려 안전',
                  ].map((item, i) => (
                    <div key={i} className="p-4 border border-[var(--border)] rounded-[var(--radius-card)] bg-[var(--bg-card)]">
                      <p className="text-body text-[var(--text-dim)] text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* Shadow operations */}
            <FadeUp delay={0.4}>
              <div>
                <h3 className="heading-section text-xl text-[var(--text)] mb-6">16.3 선거 전후 업무 분장 (Shadow Operation)</h3>
                <DataTable
                  headers={['시기', '추진위원회 (민간) 역할', '정치권/인천시 역할']}
                  rows={[
                    ['12월~2월', '법인 설립, 사무국 구성, 인스파이어 자금 집행, 헐리우드 에이전시 접촉 (비공개)', '(관망) 선거 준비 돌입'],
                    ['3월~5월', '상영작 선정\u00b7게스트 가계약 (보안 유지), 스폰서 가계약, 후보자 초청 비전 발표회', '후보자: 영화제 지원 공약 발표, 서약서 서명'],
                    ['6월 (선거 직후)', '당선자 인수위에 보고서 제출, "예산만 승인하면 됨" 강조', '당선자: 업무 보고 청취, 추경 예산 긴급 편성'],
                    ['7월~10월', '공식 조직위로 전환, 시장 취임 연계 대대적 홍보', '행정 인력 파견, 경찰/소방 안전 대책 지원'],
                  ]}
                  compact
                />
              </div>
            </FadeUp>
          </SectionWrapper>
        </div>
      </section>

      {/* --- Section 22: Personnel --- */}
      <section id="personnel" className="relative overflow-hidden scroll-mt-24">
        <Image src={images.organization} alt="" fill className="object-cover opacity-[0.06]" />
        <div className="absolute inset-0 bg-[var(--bg)]/90" />
        <div className="relative z-10">
          <SectionWrapper alt>
            <FadeUp>
              <p className="label-upper text-gold mb-4">PART 5 &bull; GOVERNANCE</p>
              <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-4">
                2. Personnel
              </h2>
              <p className="text-body text-[var(--text-dim)] max-w-3xl mb-8">
                BIFF 노하우를 가진 &apos;영화계 원로&apos;를 전면에, &apos;실무 전문가&apos;가 허리가 되어 현장을 뛰는 구조
              </p>
            </FadeUp>

            {/* 17.1 Leadership */}
            <FadeUp delay={0.1}>
              <div className="mb-12">
                <h3 className="heading-section text-xl text-[var(--text)] mb-6">17.1 컨트롤 타워 (Leadership)</h3>
                <DataTable
                  headers={['직책', '성명', '핵심 역할']}
                  rows={[
                    ['명예 위원장', '이용관 (전 BIFF 이사장)', '상징적 권위 및 방패. BIFF 성공 신화를 인천에 이식하는 상징성. 정치적 외풍을 막는 \'어른\' 역할.'],
                    ['명예 위원장', '저스틴 김 (메소드영화제 조직위원장)', '비버리힐즈 메소드영화제의 독립영화 정신을 대변. 헐리우드와의 가교 역할.'],
                    ['명예 위원장', '돈 플랑칸 (메소드영화제 조직위원장)', '헐리우드 영화인 인맥 총동원. 영화 자본과 월가의 큰손들과의 교류 총괄.'],
                    ['추진 위원장', '이청산 (전 BIFF 비대위원장)', '실질적 리더십 & 위기관리. \'무\'에서 \'유\'를 창조하는 추진위의 강력한 드라이브.'],
                    ['공동 위원장', '박병용 (인스파이어 부회장)', '재정 및 조직, 업무 지원. 인스파이어 공간\u00b7설비 제공. 후원 조직 구성 관리.'],
                    ['공동 위원장', '오석근 (전 영진위 위원장)', '정책 및 예산 설계. 영진위 네트워크 활용한 국비 지원. 문체부 행정 조율.'],
                  ]}
                  compact
                />
              </div>
            </FadeUp>

            {/* 17.2 External cooperation */}
            <FadeUp delay={0.2}>
              <div className="mb-12">
                <h3 className="heading-section text-xl text-[var(--text)] mb-6">17.2 대외 협력 및 정무</h3>
                <DataTable
                  headers={['직책', '성명', '핵심 역할']}
                  rows={[
                    ['상임 고문', '유동수 (국회의원)', '국회 차원 지원, 국비 예산 확보 교두보, 선거 국면 중립적 지원자 포지셔닝'],
                    ['자문 위원', '조광희 (전 시의원)', '영종도 지역 민원 해결, 인근 주민 협조 유도, 소상공인 갈등 관리'],
                    ['대외협력 이사', '서태웅', '인스파이어 경영진 직접 소통, 초기 씨드머니 담판, 인천 기업 스폰서십 유치'],
                  ]}
                  compact
                />
              </div>
            </FadeUp>

            {/* 17.3 Global network */}
            <FadeUp delay={0.3}>
              <div className="mb-12">
                <h3 className="heading-section text-xl text-[var(--text)] mb-6">17.3 글로벌 네트워크 (USA / Asia / Hollywood)</h3>
                <DataTable
                  headers={['직책', '성명', '핵심 역할']}
                  rows={[
                    ['해외 프로그래머', 'Justin Kim', '메소드 섹션 총괄. 헐리우드 독립영화 감독\u00b7배우 섭외 창구.'],
                    ['해외 프로그래머', 'Don Franken', '헐리우드 스타 섭외. CAA, WME 등과 직접 접촉. A급 스타 및 심사위원단 섭외.'],
                    ['아시아 전략 이사', '김무전', '중화권 톱스타 섭외 및 중국 거대 자본(알리바바 픽쳐스 등) 투자/스폰서십 연결.'],
                    ['하와이 협력 이사', '제니스 (Janice)', '하와이 국제영화제 MOU 체결 실무. 교민 사회 후원 유도.'],
                  ]}
                  compact
                />
              </div>
            </FadeUp>

            {/* 17.4 Operations */}
            <FadeUp delay={0.4}>
              <div>
                <h3 className="heading-section text-xl text-[var(--text)] mb-6">17.4 실무 운영 및 기술/디자인</h3>
                <DataTable
                  headers={['직책', '성명', '핵심 역할']}
                  rows={[
                    ['총괄사업추진단장', '황보진호 (최초 기안자)', 'Control Tower. 위원장 보좌, 전체 파트 업무 조율, 예산 집행 승인, 3개년 로드맵 관리. 모든 인맥의 허브.'],
                    ['운영 본부장', '강준 (제니스글로컨 회장)', '현장 인력 및 자원봉사. 영종도 기획사 인프라 활용, 대학생 자원활동가 모집\u00b7교육.'],
                    ['예술 감독 (AD)', '노준석 (LA 디자이너)', '글로벌 브랜딩. LA 트렌드 반영 CI/포스터/굿즈 디자인. 시각적 아이덴티티 \'글로벌 스탠더드\'로 격상.'],
                    ['기술 감독 (CTO)', '임춘우', '모바일 영화제 구현. 디스커버리 파크 야외 상영 시스템, 모바일 출품 플랫폼, 아레나 영사 기술 자문.'],
                    ['재무 감사', '송승희 (세무법인 실장)', '자금 투명성 확보. 예산 집행 감시, 기부금 세무 처리, 스폰서 기업 세제 혜택 자문.'],
                  ]}
                  compact
                />
              </div>
            </FadeUp>
          </SectionWrapper>
        </div>
      </section>

      {/* Final cinematic image strip before footer */}
      <div className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden">
        <Image src={images.hero} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
      </div>

      <Footer />
    </>
  );
}
