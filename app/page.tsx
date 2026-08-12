const apps = [
  {
    name: "OceanLearn",
    icon: "📚",
    eyebrow: "Learn step by step",
    description: "Explore English lessons, quizzes, stories and progress from Grade 1 to Grade 5.",
    href: "https://oceanlearn-maldives.mohamedmisbaah.chatgpt.site/",
    className: "learn",
  },
  {
    name: "OceanPlay",
    icon: "🎮",
    eyebrow: "Learn through play",
    description: "Build English skills with playful island games, challenges, stars and rewards.",
    href: "https://oceanplay-maldives.mohamedmisbaah.chatgpt.site/",
    className: "play",
  },
];

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Ocean English home">
          <span className="brand-mark">🌊</span>
          <span>Ocean English</span>
        </a>
        <span className="tagline">English adventures for Maldivian children</span>
      </header>

      <section className="hero" id="top">
        <div className="bubbles" aria-hidden="true"><i /><i /><i /></div>
        <div className="mascot" aria-hidden="true">🐬</div>
        <p className="dhivehi" lang="dv" dir="rtl">އައްސަލާމު ޢަލައިކުމް!</p>
        <p className="kicker">ONE OCEAN · MANY ADVENTURES</p>
        <h1>Your English journey<br /><em>starts here.</em></h1>
        <p className="intro">Choose an adventure to learn, play and grow—surrounded by the islands, reefs and stories children know and love.</p>
        <a className="primary" href="#apps">Choose an adventure <span>↓</span></a>
      </section>

      <section className="apps" id="apps">
        <div className="section-heading">
          <p>OUR APPS</p>
          <h2>Where would you like to go?</h2>
        </div>
        <div className="app-grid">
          {apps.map((app) => (
            <article className={`app-card ${app.className}`} key={app.name}>
              <div className="app-art" aria-hidden="true"><span>{app.icon}</span></div>
              <div className="app-copy">
                <p className="eyebrow">{app.eyebrow}</p>
                <h3>{app.name}</h3>
                <p>{app.description}</p>
                <a href={app.href}>Open {app.name} <span>→</span></a>
              </div>
            </article>
          ))}
          <article className="app-card future">
            <div className="future-icon" aria-hidden="true">✨</div>
            <div>
              <p className="eyebrow">More adventures ahead</p>
              <h3>Growing with you</h3>
              <p>New English-learning apps will join this ocean in the future.</p>
            </div>
          </article>
        </div>
      </section>

      <footer><span>🐚</span> Made for young learners across the Maldives <span>🐚</span></footer>
    </main>
  );
}
