"""
Add data-en attributes to all Korean elements in index.html.
This script properly adds data-en as HTML attributes on opening tags.
"""
import re

with open(r'C:\WORK\IIFF\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Each entry: (tag_pattern_to_find, data_en_value)
# tag_pattern_to_find matches the full opening tag + Korean text
# We insert data-en="..." into the opening tag

replacements = []

def add(find, en):
    """Helper: find is the exact HTML string to search. 
    We add data-en attribute to the first tag in find."""
    replacements.append((find, en))

# ═══ WHAT IS IIFF ═══
add(
    '<div class="section-desc">발음은 "이프(if)" — i 두 번, f 두 번 — 강조의 의미이며, 발음은 단순한 하나의 단어입니다.</div>',
    'Pronounced &quot;if&quot; — two i\'s, two f\'s — for emphasis, yet spoken as a single simple word.'
)
add(
    '<p>IIFF는 바로 그 <strong>\'만약에\'</strong>를 시작하게 하는 영화제입니다.</p>',
    'IIFF is a film festival that makes you start imagining &quot;what if.&quot;'
)
add(
    '<p>이미 성공한 사람들만을 위한 영화제가 아닙니다. 이미 이름이 알려진 작품만을 위한 무대도 아닙니다.</p>',
    'It is not a festival only for those already successful. It is not a stage only for already recognized works.'
)
add(
    '<p style="margin-top:1rem">아직 기회가 오지 않은 이야기, 아직 발견되지 않은 재능, 아직 불리지 않은 이름들에게',
    'A festival that gives the courage to imagine &quot;what if&quot; to stories that haven\'t found their chance, talents not yet discovered, and names not yet called.'
)
add(
    '<p>누구에게나 열려 있는 질문, 모든이에게 꿈과 희망을, 그리고 새로운 파도를 만드는 상상.<br><strong>if, 그 한 단어에서, IIFF는',
    'A question open to everyone, dreams and hopes for all, and the imagination to create new waves.&lt;br&gt;&lt;strong&gt;From that one word — if — IIFF begins.&lt;/strong&gt;'
)

# ═══ OVERVIEW ═══
add(
    '<div class="section-desc">인천 국제 영화제 "넥스트웨이브" — Incheon International Film Festival (IIFF-NextWave)</div>',
    'Incheon International Film Festival &quot;NextWave&quot; — IIFF-NextWave'
)
add(
    '<p><strong>IIFF — NextWave는</strong> 단순히 영화를 상영하는 기존 영화제의 틀을 넘어, 영화 · 음악 · 테크놀로지 · K-컬처가 유기적으로 융합되는',
    '&lt;strong&gt;IIFF — NextWave&lt;/strong&gt; goes beyond the conventional festival framework of simply screening films. It is an international film festival aiming to become a &lt;strong&gt;future-oriented global film platform&lt;/strong&gt; where film, music, technology, and K-Culture organically converge.'
)
add(
    '<p style="margin-top:.8rem">전통적인 영화제의 가치 위에 새로운 콘텐츠 환경과 산업 구조를 결합하여, \'다음 세대의 영화제 모델\'을 인천에서 시작합니다.</p>',
    'Building on traditional festival values, it combines new content environments and industry structures to launch the \'next-generation festival model\' from Incheon.'
)
add(
    '<p style="margin-top:.8rem">또한, \'칸\'이나 \'오스카\'처럼 이름 그 자체로 권위를 갖는 <strong>"iiff" 브랜드</strong>로 성장합니다.</p>',
    'Furthermore, it grows into the &lt;strong&gt;&quot;iiff&quot; brand&lt;/strong&gt; — a name that carries authority on its own, like \'Cannes\' or \'Oscar.\''
)
# Card 01
add(
    '<p>헐리우드에서 실제로 독립영화 생태계를 개척해온 Method Fest Independent Film Festival과의 직접적인 협업을 통해 아시아와 헐리우드를 연결하는 국제',
    'Through direct collaboration with Method Fest Independent Film Festival — which has pioneered the independent film ecosystem in Hollywood — we build an international film platform connecting Asia and Hollywood.'
)
add(
    '<p style="margin-top:.8rem">Justin Kim과 Don Franken이 명예위원장 및 글로벌 파트너로 참여합니다.',
    'Justin Kim and Don Franken participate as honorary chairmen and global partners. This means real global linkage: Hollywood indie network connections, global filmmakers visiting Incheon, and international programs through co-operated sections.'
)
# Card 02
add(
    '<p>IIFF는 하나의 장르나 규모에 국한되지 않습니다. 상업영화와 독립영화가 분리되지 않고 공존하는 이중 구조를 통해 영화 산업의 현재와 미래를 동시에 조망합니다.</p>',
    'IIFF is not limited to one genre or scale. Through a dual structure where commercial and independent films coexist, it surveys both the present and future of the film industry.'
)
# Card 03
add(
    '<p>IIFF — NextWave는 \'보는 영화제\'가 아닌 <strong>"참여하는 영화제"</strong>를 지향합니다.</p>',
    'IIFF — NextWave aims to be not a \'watching festival\' but a &lt;strong&gt;&quot;participating festival.&quot;&lt;/strong&gt;'
)
# Card 04
add(
    '<p>IIFF — NextWave는 1년에 한 번 열리고 끝나는 이벤트가 아닙니다.</p>',
    'IIFF — NextWave is not an event that happens once a year and ends.'
)
add(
    '<p>IIFF는 영화제를 시작으로 인천에 <strong>새로운 콘텐츠 생태계</strong>를 만들어가는 프로젝트입니다.</p>',
    'IIFF is a project that creates a &lt;strong&gt;new content ecosystem&lt;/strong&gt; in Incheon, starting with the film festival.'
)

# ═══ WHY PARTICIPATE ═══
add(
    '<p>IIFF는 로고를 붙이는 후원이 아니라, 브랜드가 프로그램과 경험 속에 \'주인공\'으로 결합되는 구조입니다.</p>',
    'IIFF is not just logo-placement sponsorship — it\'s a structure where brands become the \'protagonist\' within programs and experiences.'
)
add(
    '<p style="margin-top:.5rem"><strong>실행 계획:</strong> 스폰서별 브랜드 존/체험형 부스/콜라보 프로그램을 영화제 공식 동선에 배치.',
    '&lt;strong&gt;Execution Plan:&lt;/strong&gt; Deploy sponsor brand zones/experiential booths/collab programs along official festival routes. Provide naming rights for key content: Opening Night/Gala/Master Class/Short-form Competition.'
)
add(
    '<p style="margin-top:.5rem"><strong>측정 지표:</strong> 현장 동선 유입, 부스 체류 시간, 프로그램 참여자 수, 콘텐츠 내 브랜드 노출 횟수,',
    '&lt;strong&gt;KPI:&lt;/strong&gt; On-site route traffic, booth dwell time, program participants, brand exposure count, views/shares/UGC volume'
)
add(
    '<p>전 세계 영화인과 브랜드가 주목하는 K-콘텐츠 중심지에서 작품과 브랜드를 소개할 기회입니다.</p>',
    'An opportunity to introduce works and brands at the K-Content epicenter, drawing global filmmakers and brands.'
)
add(
    '<p style="margin-top:.5rem"><strong>실행 계획:</strong> 초청작/수상작 중심으로 K-콘텐츠 연계 프로그램 운영.',
    '&lt;strong&gt;Execution Plan:&lt;/strong&gt; Run K-Content linked programs centered on invited/awarded works. Provide press/SNS packages maximizing exposure. Operate a &quot;K-Culture Experience Zone.&quot;'
)
add(
    '<p style="margin-top:.5rem"><strong>측정 지표:</strong> 출품작/감독 인터뷰 수, 언론 노출, 관객 반응, 해외 참가자 재방문 의향</p>',
    '&lt;strong&gt;KPI:&lt;/strong&gt; Submission/director interview count, press exposure, audience response, overseas participant revisit intent'
)
add(
    '<p>아레나·MICE·야외공간(디스커버리 파크)과 인천 대표 상영관을 결합한 대규모/고품격 운영 인프라.</p>',
    'Large-scale, premium operations infrastructure combining Arena, MICE, outdoor spaces (Discovery Park), and Incheon\'s premier theaters.'
)
add(
    '<p style="margin-top:.5rem"><strong>Arena:</strong> 개·폐막식, 갈라, 라이브 이벤트',
    '&lt;strong&gt;Arena:&lt;/strong&gt; Opening/Closing, Gala, live events&lt;br&gt;&lt;strong&gt;MICE:&lt;/strong&gt; Master class, pitching/forum, networking, press room&lt;br&gt;&lt;strong&gt;Discovery Park:&lt;/strong&gt; Camp festival, outdoor screening, performances&lt;br&gt;&lt;strong&gt;City Screens:&lt;/strong&gt; Incheon theater traditional screening sections'
)
add(
    '<p>영화만으로 관객을 모으는 시대가 아니라, K-컬처 경험이 관객을 끌고, 영화가 중심으로 남게 만드는 구조입니다.</p>',
    'It\'s no longer the era of gathering audiences with movies alone — K-Culture experiences draw audiences while film remains at the center.'
)
add(
    '<p style="margin-top:.5rem"><strong>실행 계획:</strong> K-푸드/뷰티/뮤직 존을 영화제 동선의 핵심 경험으로 설계.',
    '&lt;strong&gt;Execution Plan:&lt;/strong&gt; Design K-Food/Beauty/Music zones as core experiences on the festival route. Package film screenings with experience spaces. Run stay-type programs targeting international audiences.'
)
add(
    '<p style="margin-top:.5rem"><strong>측정 지표:</strong> 관객 연령/국적 분포, 체험존 참여율, SNS UGC 발생량, 해시태그 도달</p>',
    '&lt;strong&gt;KPI:&lt;/strong&gt; Audience age/nationality distribution, experience zone participation rate, SNS UGC volume, hashtag reach'
)
add(
    '<p>IIFF-NextWave는 "끝나는 행사"가 아니라, 콘텐츠가 계속 생산되는 구조로 설계됩니다.</p>',
    'IIFF-NextWave is designed not as a &quot;concluding event&quot; but as a structure where content keeps being produced.'
)
add(
    '<p style="margin-top:.5rem"><strong>실행 계획:</strong> "Mobile Short Film Competition"을 대표 프로그램으로 확립.',
    '&lt;strong&gt;Execution Plan:&lt;/strong&gt; Establish &quot;Mobile Short Film Competition&quot; as the flagship program. Connect filming → editing → screening → awards. Operate as SNS content packages within the camping festival.'
)
add(
    '<p style="margin-top:.5rem"><strong>측정 지표:</strong> 출품작 수, 조회수/공유수, 참가자 재참여율, 숏폼 콘텐츠 총 생산량</p>',
    '&lt;strong&gt;KPI:&lt;/strong&gt; Submission count, views/shares, participant re-engagement rate, total short-form content produced'
)
add(
    '<p>영화제 이후에도 숏폼·공연·비하인드·인터뷰가 지속 배포되어 브랜드와 작품이 장기 노출됩니다.</p>',
    'Even after the festival, short-form, performances, behind-the-scenes, and interviews continue to be distributed, giving brands and works long-term exposure.'
)
add(
    '<p style="margin-top:.5rem"><strong>실행 계획:</strong> 공식 채널(YouTube/IG/TikTok) 운영을 아카이브/미디어 자산으로 설계.',
    '&lt;strong&gt;Execution Plan:&lt;/strong&gt; Design official channel (YouTube/IG/TikTok) operations as archive/media assets. Link &quot;IIFF Selection&quot; online curation with awarded/invited works.'
)
add(
    '<p style="margin-top:.5rem"><strong>측정 지표:</strong> 종료 후 30/60/90일 콘텐츠 조회수, 구독자 증가, 검색량, PR 가치 환산',
    '&lt;strong&gt;KPI:&lt;/strong&gt; Post-event 30/60/90-day content views, subscriber growth, search volume, PR value conversion'
)
add(
    '<p>IIFF는 영화제가 끝나도 사라지지 않는 네트워크 기반 자산을 남깁니다.</p>',
    'IIFF leaves network-based assets that don\'t disappear when the festival ends.'
)
add(
    '<p style="margin-top:.5rem"><strong>실행 계획:</strong> 한국 파트너의 해외 진출 연결을 위한 네트워킹 라운드/포럼 운영.',
    '&lt;strong&gt;Execution Plan:&lt;/strong&gt; Operate networking rounds/forums connecting Korean partners with overseas expansion. Systematize long-term partnerships through &quot;IIFF Partner Circle.&quot;'
)
add(
    '<p>인천의 영화·콘텐츠 생태계와 함께 성장하는 "연중 운영형" 구조로 설계합니다.</p>',
    'Designed as a &quot;year-round operation&quot; structure growing with Incheon\'s film/content ecosystem.'
)
add(
    '<p style="margin-top:.5rem"><strong>실행 계획:</strong> 영화제 기간 외에도 교육/워크숍/제작 지원/쇼케이스 등 연중 프로그램 구성.',
    '&lt;strong&gt;Execution Plan:&lt;/strong&gt; Year-round programs including education/workshops/production support/showcases. Gradually introduce &quot;IIFF Lab / IIFF Campus&quot; concept.'
)

# ═══ WHY INCHEON ═══
add(
    '<div class="section-desc">인천은 단순한 \'공항 도시\'가 아니라 세계가 가장 먼저 만나는 대한민국의 얼굴입니다.</div>',
    'Incheon is not just an \'airport city\' — it is the face of Korea that the world meets first.'
)
add(
    """<li><strong>'거쳐가는 도시'에서 "전 세계 영화인의 문화 종착지(Destination)"로</strong>""",
    '&lt;strong&gt;From a \'transit city\' to the world\'s filmmakers\' cultural destination&lt;/strong&gt;&lt;br&gt;Not airport → Seoul, but a structure that makes people stay and experience Incheon. Opening/closing, galas, master classes, meetups, and camping festivals placed throughout the city.&lt;br&gt;&lt;span class="pointer"&gt;👉&lt;/span&gt; Incheon is no longer a transit point but &lt;strong&gt;a city with reasons to visit&lt;/strong&gt;.'
)
add(
    """<li><strong>헐리우드와 직접 연결되는 글로벌 자본 · 인재 · 관광객 유입 구조</strong>""",
    '&lt;strong&gt;A structure for direct global capital, talent, and tourist inflow connected to Hollywood&lt;/strong&gt;&lt;br&gt;Hollywood filmmakers, producers, and investors participating. Overseas screenings, co-productions, and investment through global networks. Direct economic impact from international visitors.&lt;br&gt;&lt;span class="pointer"&gt;👉&lt;/span&gt; Creates a &lt;strong&gt;gateway for continuous global capital flow&lt;/strong&gt; in Incheon.'
)
add(
    """<li><strong>인천시의 문화 행정 역량을 세계에 '증명'하는 상징 자산</strong>""",
    '&lt;strong&gt;A symbolic asset proving Incheon\'s cultural and administrative capacity to the world&lt;/strong&gt;&lt;br&gt;Official participation of film masters and Hollywood figures. Demonstrating Incheon\'s capabilities on the global stage. Securing strong reference assets for future international events.&lt;br&gt;&lt;span class="pointer"&gt;👉&lt;/span&gt; IIFF becomes evidence that Incheon has &lt;strong&gt;leaped to a culture-centered city&lt;/strong&gt;.'
)
add(
    """<li><strong>365일 작동하는 영화·콘텐츠 허브</strong>""",
    '&lt;strong&gt;A 365-day Film &amp; Content Hub&lt;/strong&gt;&lt;br&gt;Education programs, creator residencies, workshops, and co-projects continuing year-round.&lt;br&gt;&lt;span class="pointer"&gt;👉&lt;/span&gt; Incheon evolves from an &lt;strong&gt;event city to an industry city&lt;/strong&gt;.'
)
add(
    """<li><strong>유휴 부지와 공간을 미래 콘텐츠 자산으로 전환</strong>""",
    '&lt;strong&gt;Converting idle land into future content assets&lt;/strong&gt;&lt;br&gt;Idle land/buildings → film sets, education spaces, creator campuses. Global influencer/creator influx. Hallyu content production base.&lt;br&gt;&lt;span class="pointer"&gt;👉&lt;/span&gt; Abandoned spaces become &lt;strong&gt;the city\'s future economic engines&lt;/strong&gt;.'
)
add(
    '<p><strong>결론:</strong> 영화제를 시작으로, 인천은 <strong>\'아시아의 새로운 콘텐츠 중심 도시\'</strong>로 브랜딩됩니다.',
    '&lt;strong&gt;Conclusion:&lt;/strong&gt; Starting with the film festival, Incheon is branded as &lt;strong&gt;\'Asia\'s new content-centered city.\'&lt;/strong&gt; IIFF is not just a cultural event — it is a city project that redefines Incheon\'s identity and future.'
)

# ═══ VISION ═══
add(
    '<p style="font-size:1.3rem;color:var(--text-bright);font-weight:500">인천 국제 넥스트웨이브 영화제는<br>하나의 영화제가 아니라,',
    'The Incheon International NextWave Film Festival is&lt;br&gt;not just a film festival,&lt;br&gt;it is &lt;strong&gt;a city strategy&lt;/strong&gt;.'
)
add(
    '<p style="margin-top:1.5rem;font-size:1.1rem">IIFF-NextWave는<br>영화를 상영하는 이벤트가 아니라,',
    'IIFF-NextWave is&lt;br&gt;not an event for screening films,&lt;br&gt;it is a &lt;strong&gt;project redesigning the city\'s identity&lt;/strong&gt;.'
)
add(
    '<p style="margin-top:1.5rem;font-size:1.2rem;color:var(--gold)">"영화가 머무는 도시 / 창작자가 성장하는 도시 / 세계가 다시 찾는',
    '&quot;A city where films stay / A city where creators grow / An Incheon the world revisits&quot;'
)
add(
    '<p>우리가 살고 있는 시대는 불과 몇 년 전과도 완전히 다른 세상이 되었습니다.',
    'The era we live in has become a completely different world from just a few years ago. The malls and department stores where people gathered have closed, leaving cities with empty spaces. Creation is no longer the domain of those with rare talent or expensive equipment.'
)
add(
    '<p>AI와 자동화는 아이디어가 없어도, 경험이 없어도 콘텐츠를 만들고 유통할 수 있는 시대를 열었습니다.',
    'AI and automation have opened an era where anyone can create and distribute content — even without ideas or experience. Soon, it will be hard to tell what is real and what is fake.'
)
add(
    '<p>이 변화는 막을 수 없습니다. 그리고 거스를 필요도 없습니다.</p>',
    'This change cannot be stopped. And there is no need to resist it.'
)
add(
    '<blockquote>그럼에도 불구하고, 사람은 지난날을 기억합니다.',
    'Nevertheless, people remember the past. No matter how much technology advances, &lt;strong&gt;nostalgia and romance&lt;/strong&gt; remain in people\'s hearts. Things made by hand, meeting someone face to face, breathing in the same space — laughing, crying, being moved together.'
)
add(
    '<p>IIFF는, 이 두 세대 사이에 단절이 아닌 <strong>\'연결\'</strong>을 만들고자 합니다.',
    'IIFF aims to create not a disconnect but a &lt;strong&gt;\'connection\'&lt;/strong&gt; between these two generations. IIFF dreams of a space where things made by human hearts and hands become central again.'
)
add(
    '<p>동시에, AI와 새로운 테크놀로지와의 공존도 숨기지 않습니다.',
    'At the same time, it does not hide the coexistence with AI and new technology. IIFF aims to be a &lt;strong&gt;\'bridge\' where the romance of the past meets the technology of the future&lt;/strong&gt;.'
)
add(
    '<p>이전의 어떤 영화제와도 닮지 않은, 솔직하고, 따뜻하고, 감동이 있는 영화제를 지향합니다.</p>',
    'It aspires to be a festival unlike any before — honest, warm, and moving.'
)
add(
    '<p style="margin-top:1rem"><strong>IIFF는 계속해서 \'If\'를 선물하는 영화제가 되고자 합니다.</strong></p>',
    '&lt;strong&gt;IIFF aspires to be a festival that keeps giving the gift of \'If.\'&lt;/strong&gt;'
)
add(
    '<blockquote>"만약에, 이곳에서 내 이야기가 시작된다면? 만약에, 이 만남이 나의 다음 인생을 바꾼다면?"',
    '&quot;What if my story begins here? What if this encounter changes the next chapter of my life?&quot;&lt;br&gt;&lt;br&gt;A festival where that question lingers in people\'s hearts.&lt;br&gt;&lt;strong&gt;IIFF proposes a way to change cities through film, reconnect people, and cross into the future with warmth.&lt;/strong&gt;'
)

# ═══ PART 2 DIVIDER ═══
add(
    '<p>제1회 인천 국제 넥스트웨이브 영화제의 구체적인 실행 전략, 조직, 예산, 스폰서십, 로드맵</p>',
    'Detailed execution strategy, organization, budget, sponsorship, and roadmap for the 1st IIFF NextWave'
)

# ═══ CORE PROGRAMS ═══
add(
    '<p>헐리우드 및 글로벌 상업영화, 국제 초청작 중심의 프리미엄 상영 섹션.',
    'Premium screening section centered on Hollywood and global commercial films, international invited works. Maximize public, media, and sponsor attention through opening/closing films, gala screenings, and red carpet events.'
)
add(
    '<p style="margin-top:.5rem">상업성과 작품성을 겸비한 작품 위주로 구성하여',
    'Composed mainly of works combining commercial and artistic merit, lowering the perception that &quot;film festivals are difficult&quot; and serving as the central axis for audience attraction. Major works include director/actor visits, audience Q&amp;A (GV), and press interviews.'
)
add(
    '<p style="margin-top:.5rem"><span class="pointer">👉</span> IIFF의 외부 인지도·흥행·미디어 파급력을 책임지는 <strong>얼굴',
    '&lt;span class="pointer"&gt;👉&lt;/span&gt; The &lt;strong&gt;face section&lt;/strong&gt; responsible for IIFF\'s external recognition, box office, and media impact'
)
add(
    '<p>미국 Method Fest Independent Film Festival과의 공식 연계.',
    'Official partnership with US Method Fest Independent Film Festival. Curation focused on acting (Method Acting), directing, and story-centered creative methodology. Prioritizing creative philosophy and acting density over commerciality.'
)
add(
    '<p style="margin-top:.5rem">감독·배우·프로듀서를 위한: Method 기반 마스터 클래스, 연기·연출 워크숍, 국제 공동 제작 토크 세션 운영.</p>',
    'For directors, actors, and producers: Method-based master classes, acting/directing workshops, and international co-production talk sessions.'
)
add(
    '<p style="margin-top:.5rem"><span class="pointer">👉</span> 단순 상영이 아닌 <strong>"영화인이 성장하는',
    '&lt;span class="pointer"&gt;👉&lt;/span&gt; The section that best represents the philosophy of &lt;strong&gt;&quot;a festival where filmmakers grow&quot;&lt;/strong&gt;'
)
add(
    '<p>갤럭시·아이폰 등 모바일 디바이스로 촬영한 작품만 출품 가능.',
    'Only works filmed on mobile devices (Galaxy, iPhone, etc.) can be submitted. Encouraging mass participation from young creators regardless of genre or nationality. An experimental section expanding the boundary between short-form and cinematic narrative.'
)
add(
    '<p style="margin-top:.5rem">수상작은 대형 스크린 상영 / 온라인 공식 채널을 통한 글로벌 공개 / 브랜드·테크 기업과의 협업 기회 연계.</p>',
    'Award winners: big-screen screening / global release via official online channels / collaboration opportunities with brands and tech companies.'
)
add(
    '<p style="margin-top:.5rem"><span class="pointer">👉</span> IIFF-NextWave의 이름을 가장 직접적으로 설명하는',
    '&lt;span class="pointer"&gt;👉&lt;/span&gt; The &lt;strong&gt;incubator of future cinema&lt;/strong&gt; that most directly represents the name IIFF-NextWave'
)
add(
    '<p>인스파이어 야외 공간을 활용한 캠핑형 페스티벌 존.',
    'Camping festival zone utilizing Inspire\'s outdoor spaces. Night: outdoor screenings / live performances / DJ &amp; music content. Day: talks / workshops / creator meetups.'
)
add(
    '<p style="margin-top:.5rem">관객·영화인·아티스트가 구분 없이 섞이는 자유롭고 젊은 영화제 분위기 형성.</p>',
    'Creating a free, youthful festival atmosphere where audiences, filmmakers, and artists mingle without boundaries.'
)
add(
    '<p style="margin-top:.5rem"><span class="pointer">👉</span> 영화제를 "보는 행사"에서 <strong>머무르고 경험하는 문화',
    '&lt;span class="pointer"&gt;👉&lt;/span&gt; Expanding from a &quot;watching event&quot; to a &lt;strong&gt;cultural celebration to stay and experience&lt;/strong&gt;'
)
add(
    '<p>한식, K-푸드, K-뷰티, 라이프스타일 브랜드가 참여하는 체험형 존.',
    'Experiential zone with Korean cuisine, K-Food, K-Beauty, and lifestyle brands. Not just display/sales, but food connected to film themes / actor-director makeup experiences / Hallyu content collab events.'
)
add(
    '<p style="margin-top:.5rem">글로벌 관객에게 "한국 영화제를 방문하면 한국 문화를 경험한다"는 인식 형성.',
    'Creating the perception that &quot;visiting a Korean film festival means experiencing Korean culture.&quot; For sponsors, the most efficient high-dwell-time exposure space.'
)
add(
    '<p style="margin-top:.5rem"><span class="pointer">👉</span> IIFF를 <strong>\'한국을 경험하는 국제',
    '&lt;span class="pointer"&gt;👉&lt;/span&gt; Making IIFF &lt;strong&gt;a globally \'experiencing Korea\' international festival&lt;/strong&gt;'
)

# ═══ STAR INVITATION (7.1 description) ═══
add(
    '<p>헐리우드 현지 법인(Creative Artists Agency / WME / UTA 등)을 통한 직접 연결 + Method Fest 창립자 네트워크. 초기부터 한정된 예산 내에서 "확실한 1인"의 화제성 확보.',
    'Direct connections through Hollywood agencies (CAA / WME / UTA) + Method Fest founder network. Securing the buzz of &quot;one definitive star&quot; within a limited budget from the start.'
)

# ═══ DAILY SIMULATION (bottom summary) ═══
add(
    '<p><strong>핵심 포인트:</strong> 관객은 아침부터 밤까지 머무르며, 각기 다른 경험을 조합해 자신만의 영화제를 만들어갑니다.',
    '&lt;strong&gt;Key Point:&lt;/strong&gt; Audiences stay from morning to night, combining different experiences to create their own unique festival journey.'
)

# ═══ SPACE PARTNER DESCRIPTIONS ═══
add(
    '<p>인천의 독립영화 거점. 메소드-인디 섹션 위성 상영관 및 아트 스크리닝 셔틀 운영.</p>',
    'Incheon\'s indie film hub. Method-Indie satellite theater and art screening shuttle.'
)
add(
    '<p>해외 비즈니스 게스트 숙박 대안, 네트워킹 디너 및 VIP 라운지 운영.</p>',
    'Alternative lodging for international business guests, networking dinner, and VIP lounge.'
)
add(
    '<p>개항장 일대 로케이션 투어, 인천 아트 시네마 연계 특별 상영.</p>',
    'Open port area location tours, Incheon Art Cinema special screenings.'
)

# ═══ BUDGET REVENUE STRATEGY ═══
add(
    '<p><strong>공적자금 최소화 원칙:</strong> 인스파이어 등 현물 후원 극대화 + 지자체 현금 의존 비율 30% 이하로 설계.',
    '&lt;strong&gt;Minimizing public funds:&lt;/strong&gt; Maximizing in-kind support from Inspire + designing municipal cash dependency below 30%.'
)
add(
    '<p><strong>민간 스폰서 3단계:</strong> ① 네이밍 권한 → ② 체험 존 운영 → ③ 멀티이어 계약 전환으로 반복수익 구조 형성.',
    '&lt;strong&gt;3-phase private sponsors:&lt;/strong&gt; ① Naming rights → ② Experience zone operation → ③ Multi-year contract conversion for recurring revenue.'
)
add(
    '<p><strong>자체 수익 다각화:</strong> 티켓 판매만이 아닌 공식 굿즈, 모바일 콘텐츠 마켓, K-컬처 체험 패키지 수익 포함.',
    '&lt;strong&gt;Revenue diversification:&lt;/strong&gt; Not just ticket sales, but official goods, mobile content market, and K-Culture experience package revenues.'
)

# ═══ MARKETING ═══
add(
    '<p>Method Fest 공동 프로모션, 해외 영화제 네트워크(베를린, 선댄스) 공식 교류</p>',
    'Method Fest co-promotion, official exchange with international festival networks (Berlin, Sundance)'
)
add(
    '<p>인천공항 환승 관광 콘텐츠 연계, 동아시아 영화 허브 포지셔닝</p>',
    'Linking with Incheon Airport transit tourism content, positioning as East Asian film hub'
)
add(
    '<p>Variety, Screen Daily, IndieWire 등 글로벌 영화 미디어 PR 계약</p>',
    'PR contracts with global film media: Variety, Screen Daily, IndieWire, etc.'
)
add(
    '<p>Creator Camp 참가 모집 SNS 캠페인, 시민 서포터즈 운영, 인플루언서 협업</p>',
    'Creator Camp recruitment SNS campaign, citizen supporters, influencer collaborations'
)

# ═══ RISK MANAGEMENT ═══
add(
    '<p>민간 추진위 발족, 비전 선포, 시장 면담</p>',
    'Private steering committee launch, vision announcement, mayor meeting'
)
add(
    '<p>주요 후보 대상 영화제 비전 브리핑, MOU 사전 체결</p>',
    'Vision briefing for major candidates, pre-signed MOU'
)
add(
    '<p>중립적 문화사업 입장 유지, 당파적 활용 차단</p>',
    'Maintain neutral cultural project stance, block partisan exploitation'
)
add(
    '<p>당선자 측 인수위와 즉시 연계, 시정 문화전략 삽입</p>',
    'Immediate liaison with winner\'s transition team, insert into city cultural strategy'
)
add(
    '<p>공식 추진 협약, 제1회 개최 확정</p>',
    'Official promotion agreement, 1st edition confirmed'
)

print(f"Total replacements to apply: {len(replacements)}")

# Apply replacements: insert data-en attribute into the opening tag
count = 0
fail = 0
for find_str, en_val in replacements:
    if find_str not in content:
        print(f"WARN: NOT FOUND: {find_str[:80]}...")
        fail += 1
        continue
    
    # Find the opening tag and insert data-en before the closing >
    # The find_str starts with a tag like <p>, <div ...>, <li>, <blockquote> etc.
    tag_match = re.match(r'(<\w+(?:\s[^>]*)?)>', find_str)
    if tag_match:
        old_tag_open = tag_match.group(1) + '>'
        new_tag_open = tag_match.group(1) + f' data-en="{en_val}">'
        replacement = find_str.replace(old_tag_open, new_tag_open, 1)
        content = content.replace(find_str, replacement, 1)
        count += 1
    else:
        print(f"WARN: No tag found in: {find_str[:80]}...")
        fail += 1

print(f"\nApplied {count} / {len(replacements)} replacements ({fail} failed)")

with open(r'C:\WORK\IIFF\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
