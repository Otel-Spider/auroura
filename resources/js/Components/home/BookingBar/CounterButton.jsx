import React from "react";

export default function CounterButton({ kind = "plus", muted = false, ...props }) {
  const cls = `btn-circle ${muted ? "btn-circle--muted" : "btn-circle--gold"}`;
  
  const icon = kind === "plus"
    ? (
        <svg width="16" height="16" aria-hidden="true">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    : kind === "minus"
    ? (
        <svg width="16" height="16" aria-hidden="true">
          <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    : (
        <svg width="16" height="16" aria-hidden="true" viewBox="0 0 16 16">
          <path d="M10.5 3.5L6 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
  
  return (
    <button type="button" className={cls} {...props}>
      {icon}
    </button>
  );
}
