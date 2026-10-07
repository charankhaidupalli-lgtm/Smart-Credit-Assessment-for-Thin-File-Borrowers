import React from 'react';
import { PillNav } from './PillNav';

/**
 * Navbar component - Adapts React Bits FREE Pill Nav with GSAP animations.
 * Preserves all existing branding, portal switcher, profile options, and page navigation props.
 */
export function Navbar(props) {
  return <PillNav {...props} />;
}
