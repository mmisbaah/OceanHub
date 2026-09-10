'use client';
import ProfileSwitcher from './ProfileSwitcher';
import AccessibilityControls from './AccessibilityControls';
export default function HubShell({children}){return <><a className="skip-link" href="#main">Skip to learning</a><header className="hub-header"><a className="hub-brand" href="/">🌊 Atollingo</a><nav aria-label="Main navigation"><a href="/">My learning</a><a href="/library">Library</a><a href="/parent">For parents</a><a href="/teacher">For teachers</a></nav><ProfileSwitcher/></header><AccessibilityControls/><main id="main" className="hub-main">{children}</main><footer className="hub-footer">Made for curious island minds. <a href="/about-our-content">Our content & privacy</a> · <a href="/#apps">Explore all apps</a></footer></>}

