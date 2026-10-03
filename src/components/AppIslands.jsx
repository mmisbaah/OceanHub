'use client';
import {useState} from 'react';
import {appGroups} from '../data/appGroups';
import './app-islands.css';

const illustrations = {
  MathLagoon: 'mathlagoon', 'Math Explorer': 'explorer', 'Maths Worksheets': 'mathsheets',
  OceanLearn: 'english', OceanPlay: 'play', 'Atollingo Worksheets': 'worksheets', OceanArabic: 'arabic',
};

const appTypes = {
  MathLagoon: ['learn','games'], 'Math Explorer': ['learn'], 'Maths Worksheets': ['worksheets'],
  OceanLearn: ['learn'], OceanPlay: ['games'], 'Atollingo Worksheets': ['worksheets'], OceanArabic: ['learn','games'],
};
const filters = [['all','🏝️','All adventures'],['learn','📚','Learning apps'],['games','🎮','Web games'],['worksheets','✏️','Worksheets']];
export default function AppIslands() {
  const [type,setType] = useState('all');
  const groups = appGroups.map(group=>({...group,apps:group.apps.filter(([name])=>type==='all'||appTypes[name].includes(type))})).filter(group=>group.apps.length);
  const count = groups.reduce((total,group)=>total+group.apps.length,0);
  return <section id="apps" className="island-launcher" aria-labelledby="island-title">
    <div className="island-welcome">
      <div className="island-welcome-copy">
        <p className="eyebrow">WELCOME TO YOUR LEARNING ISLAND</p>
        <h1 id="island-title">Little explorers.<br/><em>Big discoveries.</em></h1>
        <p>Your home for learning apps, web games and printable adventures.</p>
        <a href="#island-subjects">Choose your adventure <span aria-hidden="true">↓</span></a>
      </div>
      <img className="island-greeter" src="/assets/apps/english.png" alt="A friendly dolphin welcomes you" width="140" height="140"/>
    </div>
    <div className="adventure-toolbar">
      <div><h2>What would you like to do?</h2><p>Choose a type, then pick a subject. Each card opens its own app.</p></div>
      <div className="adventure-filters" role="group" aria-label="Choose app type">{filters.map(([id,icon,label])=><button type="button" key={id} aria-pressed={type===id} onClick={()=>setType(id)}><span aria-hidden="true">{icon}</span> {label}</button>)}</div>
      <p className="adventure-count" role="status">{count} {count===1?'app':'apps'} to explore · Open directly, no hub sign-in needed</p>
    </div>
    <div id="island-subjects" className="island-subjects">
      {groups.map(group => <section className={`subject-island island-${group.id}`} key={group.id} aria-labelledby={`apps-${group.id}`}>
        <h2 id={`apps-${group.id}`}>{group.title}</h2>
        <div className="island-apps">
          {group.apps.map(([name,description,href,icon]) => <a className="island-app" href={href} key={name}>
            <div className="island-app-picture">
              <img src={`/assets/apps/${illustrations[name]}.png`} alt="" width="88" height="88" decoding="async"/>
              <span aria-hidden="true">{icon}</span>
            </div>
            <div className="island-app-copy"><h3>{name}</h3><p>{description}</p><small className="app-domain">{new URL(href).hostname}</small><span className="island-open">{type==='games'?'Play now':type==='worksheets'?'Open worksheets':'Open app'} <span aria-hidden="true">→</span></span></div>
          </a>)}
        </div>
      </section>)}
    </div>
  </section>;
}
