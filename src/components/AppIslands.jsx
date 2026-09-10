import {appGroups} from '../data/appGroups';
import './app-islands.css';

const illustrations = {
  MathLagoon: 'mathlagoon', 'Math Explorer': 'explorer', 'Maths Worksheets': 'mathsheets',
  OceanLearn: 'english', OceanPlay: 'play', 'Atollingo Worksheets': 'worksheets', OceanArabic: 'arabic',
};

export default function AppIslands() {
  return <section id="apps" className="island-launcher" aria-labelledby="island-title">
    <div className="island-welcome">
      <div className="island-welcome-copy">
        <p className="eyebrow">WELCOME TO YOUR LEARNING ISLAND</p>
        <h1 id="island-title">Little explorers.<br/><em>Big discoveries.</em></h1>
        <p>Pick an adventure. Let’s learn, play and grow!</p>
        <a href="#island-subjects">Choose your adventure <span aria-hidden="true">↓</span></a>
      </div>
      <img className="island-greeter" src="/assets/apps/english.png" alt="A friendly dolphin welcomes you" width="140" height="140"/>
    </div>
    <div id="island-subjects" className="island-subjects">
      {appGroups.map(group => <section className={`subject-island island-${group.id}`} key={group.id} aria-labelledby={`apps-${group.id}`}>
        <h2 id={`apps-${group.id}`}>{group.title}</h2>
        <div className="island-apps">
          {group.apps.map(([name,description,href,icon]) => <a className="island-app" href={href} key={name}>
            <div className="island-app-picture">
              <img src={`/assets/apps/${illustrations[name]}.png`} alt="" width="88" height="88" decoding="async"/>
              <span aria-hidden="true">{icon}</span>
            </div>
            <div className="island-app-copy"><h3>{name}</h3><p>{description}</p><span className="island-open">Let’s explore <span aria-hidden="true">→</span></span></div>
          </a>)}
        </div>
      </section>)}
    </div>
  </section>;
}
