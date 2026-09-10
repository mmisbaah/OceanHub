'use client';
import {useEffect,useState} from 'react';
import ConnectedBridge from './ConnectedBridge';
import LearningPathContainer from './LearningPathContainer';
import AccessibilityControls from './AccessibilityControls';
import {grade1EnglishPath} from '../data/grade1EnglishPath';
import {getProfile} from '../utils/unifiedProgressTracker';
function Activity(){const [profile,setProfile]=useState(null),[skill,setSkill]=useState(''),[mode,setMode]=useState('lesson');useEffect(()=>{const refresh=()=>setProfile(getProfile());refresh();const query=new URLSearchParams(location.search);setSkill(query.get('skill')||grade1EnglishPath[0].id);setMode(['lesson','game','worksheet'].includes(query.get('mode'))?query.get('mode'):'lesson');window.addEventListener('atollingo-change',refresh);return()=>window.removeEventListener('atollingo-change',refresh)},[]);const lesson=grade1EnglishPath.find(m=>m.id===skill);return profile&&lesson?<LearningPathContainer key={`${profile.studentId}-${skill}-${mode}`} lesson={lesson} mode={mode}/>:<p>Choose a learner at <a href="https://atollingo.com">Atollingo</a> to begin.</p>}
export default function ConnectedLearningApp(){return <><a className="skip-link" href="#main">Skip to activity</a><header className="hub-header"><a className="hub-brand" href="https://atollingo.com/">🌊 Atollingo</a><nav><a href="https://atollingo.com/">My learning</a><a href="/">All app activities</a></nav></header><AccessibilityControls/><main id="main" className="hub-main"><ConnectedBridge><Activity/></ConnectedBridge></main></>}
