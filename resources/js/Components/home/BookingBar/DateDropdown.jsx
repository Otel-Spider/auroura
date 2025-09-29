import React from "react";
import CounterButton from "./CounterButton";

export default function DateDropdown({ 
  monthLabelLeft, 
  monthLabelRight, 
  onPrev, 
  onNext, 
  children 
}) {
  return (
    <div role="dialog" aria-label="Choose dates">
      {children}
    </div>
  );
}
