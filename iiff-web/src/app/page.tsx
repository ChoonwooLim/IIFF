import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionWrapper from '@/components/layout/SectionWrapper';
import PartDivider from '@/components/layout/PartDivider';

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Cover */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[var(--bg)]">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.08),transparent_70%)]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="label-upper text-gold mb-6">
            Incheon International Film Festival
          </p>
          <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-[var(--text)] mb-8">
            NextWave<br />2026
          </h1>
          <p className="text-body text-[var(--text-dim)] text-lg md:text-xl max-w-2xl mx-auto mb-12">
            시네마, 문화, 그리고 기술이 만나는 곳.
            인천에서 시작되는 글로벌 영화의 새로운 물결.
          </p>
          <div className="flex items-center justify-center gap-6">
            <a
              href="#what-is-iiff"
              className="px-8 py-3 border border-gold text-gold label-upper text-xs hover:bg-gold hover:text-[var(--bg)] transition-all duration-500"
            >
              Explore
            </a>
            <a
              href="#core-programs"
              className="px-8 py-3 text-[var(--text-dim)] label-upper text-xs hover:text-gold transition-colors duration-300"
            >
              Programs
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[0.6rem] tracking-[4px] uppercase text-[var(--text-muted)]">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent" />
        </div>
      </section>

      {/* PART 1 — Introduction */}
      <PartDivider part={1} title="소개" />

      <SectionWrapper id="what-is-iiff">
        <p className="label-upper text-gold mb-6">What is IIFF?</p>
        <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-8">
          인천국제영화제란?
        </h2>
        <p className="text-body text-[var(--text-dim)] max-w-3xl">
          IIFF(인천국제영화제)는 &quot;if&quot;라 읽는다. 두 개의 i, 두 개의 f.
          이름 자체가 하나의 도발이다. 기존의 영화제가 완성된 작품을 상영하는 데 머문다면,
          IIFF는 아직 만들어지지 않은 이야기, 아직 발견되지 않은 재능, 아직 불리지 않은 이름을 위한 무대다.
        </p>
      </SectionWrapper>

      <SectionWrapper id="overview" alt>
        <p className="label-upper text-gold mb-6">Festival Overview</p>
        <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-8">
          페스티벌 개요
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
          {[
            { num: '10', label: '일간' },
            { num: '200+', label: '상영작' },
            { num: '50+', label: '국가' },
            { num: '300K+', label: '관객 목표' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-4xl md:text-5xl font-bold text-gold mb-2">{stat.num}</p>
              <p className="label-upper text-[var(--text-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper id="why-participate">
        <p className="label-upper text-gold mb-6">Why Participate?</p>
        <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-12">
          왜 참여하나?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: '글로벌 네트워크', desc: '전 세계 영화 산업 리더들과의 직접적인 네트워킹 기회' },
            { title: '시장 접근성', desc: '아시아 최대 엔터테인먼트 시장의 중심에서 비즈니스 매칭' },
            { title: '기술 혁신', desc: 'AI, XR, 볼류메트릭 캡처 등 차세대 시네마 기술 체험' },
          ].map((item) => (
            <div
              key={item.title}
              className="p-8 rounded-[var(--radius-card)] bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-gold)] transition-all duration-300 hover:-translate-y-1"
              style={{ backdropFilter: `blur(var(--glass-blur))` }}
            >
              <h3 className="heading-section text-xl text-[var(--text)] mb-4">{item.title}</h3>
              <p className="text-body text-[var(--text-dim)] text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* PART 2 — Programs */}
      <PartDivider part={2} title="프로그램" />

      <SectionWrapper id="core-programs" fullWidth>
        <p className="label-upper text-gold mb-6">Core Programs</p>
        <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-12">
          핵심 프로그램
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { num: '01', title: 'Commercial & Global Showcase', desc: '할리우드 스케일과 K-컬처의 속도가 만나는 글로벌 상영관' },
            { num: '02', title: 'Method Fest', desc: '알고리즘 시네마토그래피의 최전선. AI 감독과 인간 감독의 경계를 탐구' },
            { num: '03', title: 'NextWave Mobile', desc: '모바일 필름메이킹의 혁명. 누구나 감독이 되는 시대' },
            { num: '04', title: 'Festival Camp', desc: '차세대 크리에이터를 위한 몰입형 캠프. 멘토링부터 제작까지' },
            { num: '05', title: 'K-Culture Zone', desc: '한국 문화의 현재와 미래. 음악, 패션, 기술이 융합하는 축제의 장' },
          ].map((prog) => (
            <div
              key={prog.num}
              className="group relative p-8 rounded-[var(--radius-card)] bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-gold)] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              style={{ backdropFilter: `blur(var(--glass-blur))` }}
            >
              <span className="absolute top-6 right-6 font-heading text-5xl font-bold text-[var(--border)] group-hover:text-gold/20 transition-colors duration-500">
                {prog.num}
              </span>
              <div className="relative z-10">
                <h3 className="heading-section text-xl text-[var(--text)] mb-4 pr-12">{prog.title}</h3>
                <p className="text-body text-[var(--text-dim)] text-sm">{prog.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* PART 3 — Strategy */}
      <PartDivider part={3} title="전략" />

      <SectionWrapper id="core-strategy">
        <p className="label-upper text-gold mb-6">Core Strategy</p>
        <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-12">
          핵심 전략
        </h2>
        <p className="text-body text-[var(--text-dim)] max-w-3xl">
          IIFF는 단순한 상영 축제를 넘어, 글로벌 시네마 산업의 허브로서
          콘텐츠 창작, 비즈니스 매칭, 기술 혁신의 세 축을 통합하는 전략을 추구합니다.
        </p>
      </SectionWrapper>

      {/* PART 4 — Finance */}
      <PartDivider part={4} title="재무" />

      <SectionWrapper id="budget" alt>
        <p className="label-upper text-gold mb-6">Budget Plan</p>
        <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-12">
          예산 계획
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center p-10 rounded-[var(--radius-card)] bg-[var(--bg-card)] border border-[var(--border)]">
            <p className="font-heading text-5xl font-bold text-gold mb-2">30억</p>
            <p className="label-upper text-[var(--text-muted)]">총 예산 규모</p>
          </div>
          <div className="text-center p-10 rounded-[var(--radius-card)] bg-[var(--bg-card)] border border-[var(--border)]">
            <p className="font-heading text-5xl font-bold text-gold mb-2">15+</p>
            <p className="label-upper text-[var(--text-muted)]">스폰서 파트너</p>
          </div>
        </div>
      </SectionWrapper>

      {/* PART 5 — Governance */}
      <PartDivider part={5} title="거버넌스" />

      <SectionWrapper id="governance">
        <p className="label-upper text-gold mb-6">Governance</p>
        <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-8">
          거버넌스 & 리스크 관리
        </h2>
        <p className="text-body text-[var(--text-dim)] max-w-3xl">
          투명한 운영 구조와 체계적인 리스크 관리로
          지속 가능한 영화제를 만들어 갑니다.
        </p>
      </SectionWrapper>

      <Footer />
    </>
  );
}
