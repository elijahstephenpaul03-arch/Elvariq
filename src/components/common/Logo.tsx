/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * Logo & Wordmark Component
 * Original geometric identity: multifaceted nexus node representing enquiry intake,
 * relational routing, and academic progress.
 */

import React from 'react';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  lightMode?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ collapsed = false, className = '', lightMode = false }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Geometric Symbol */}
      <div className="relative w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center shadow-sm border border-gray-800 shrink-0">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-teal-400"
        >
          {/* Outer geometric shield / prism */}
          <polygon
            points="16,3 27,9 27,23 16,29 5,23 5,9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-teal-400"
          />
          {/* Inner connecting relationship nexus */}
          <circle cx="16" cy="16" r="3" fill="#14B8A6" />
          <line x1="16" y1="6" x2="16" y2="13" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="24" y1="21" x2="18.5" y2="17.5" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="21" x2="13.5" y2="17.5" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Wordmark & Academic Kicker */}
      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-lg font-extrabold tracking-wider ${
                lightMode ? 'text-gray-900' : 'text-white'
              }`}
            >
              ELVARIQ
            </span>
            <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
              PROTOTYPE
            </span>
          </div>
          <span className="text-[11px] text-gray-500 font-medium truncate">
            Enquiry & Relationship System
          </span>
        </div>
      )}
    </div>
  );
};
