const apps = [
  {
    name: "OceanLearn",
    icon: "📚",
    language: "English",
    eyebrow: "Lessons · Stories · Quizzes",
    description: "Follow the Maldivian English curriculum from Grade 1 to Grade 5 with guided lessons and practice.",
    href: "https://oceanlearn-maldives.mohamedmisbaah.chatgpt.site/",
    className: "learn",
  },
  {
    name: "OceanPlay",
    icon: "🎮",
    language: "English",
    eyebrow: "Games · Challenges · Rewards",
    description: "Build English skills through playful island adventures, progressive levels, stars and badges.",
    href: "https://oceanplay-maldives.mohamedmisbaah.chatgpt.site/",
    className: "play",
  },
  {
    name: "OceanArabic",
    icon: "ب",
    language: "Arabic · العربية",
    eyebrow: "Learn · Practise · Play",
    description: "Learn Arabic letters, words and communication through a grade-based Maldivian learning path.",
    href: "https://oceanarabic-maldives.mohamedmisbaah.chatgpt.site/",
    className: "arabic-app",
  },
];

export default function Home() {
  return <main>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Atollingo language hub home"><span className="brand-mark">🌊</span><span>Atollingo</span></a>
      <span className="tagline">One home for every language adventure</span>
    </header>

    <section className="hero" id="top">
      <div className="bubbles" aria-hidden="true"><i /><i /><i /></div>
      <div className="mascot" aria-hidden="true">🐬</div>
      <p className="dhivehi" lang="dv" dir="rtl">އައިސް އެކުގައި ދަސްކޮށްލަމާ!</p>
      <p className="kicker">WELCOME TO ATOLLINGO</p>
      <h1>Every language.<br /><em>One happy hub.</em></h1>
      <p className="intro">Choose a learning app and begin your next island adventure. Atollingo brings language lessons, practice and games together in one safe place.</p>
      <div className="quick-launch" aria-label="Language app launcher">
        {apps.map(app => <a className="quick-app" href={app.href} key={`quick-${app.name}`}>
          <span className={`quick-icon ${app.className}`} aria-hidden="true">{app.icon}</span>
          <strong>{app.name}</strong>
          <small>{app.language}</small>
          <span className="enter">Enter</span>
        </a>)}
      </div>
      <a className="primary" href="#apps">Explore all apps <span>↓</span></a>
    </section>

    <section className="apps" id="apps">
      <div className="section-heading"><p>LANGUAGE APPS</p><h2>Choose how you want to learn</h2><span>Each app has its own lessons, progress and playful activities.</span></div>
      <div className="app-grid">
        {apps.map(app => <article className={`app-card ${app.className}`} key={app.name}>
          <div className="app-art" aria-hidden="true"><span>{app.icon}</span><b>{app.language}</b></div>
          <div className="app-copy"><p className="eyebrow">{app.eyebrow}</p><h3>{app.name}</h3><p>{app.description}</p><a href={app.href}>Open {app.name} <span>→</span></a></div>
        </article>)}
        <article className="app-card future"><div className="future-icon" aria-hidden="true">✨</div><div><p className="eyebrow">More languages ahead</p><h3>The Atollingo family will keep growing</h3><p>Future language-learning apps will appear here, so every new adventure stays easy to find.</p></div></article>
      </div>
    </section>
    <footer><span>🐚</span> Atollingo · The language-learning hub for young learners across the Maldives <span>🐚</span></footer>
  </main>;
}
