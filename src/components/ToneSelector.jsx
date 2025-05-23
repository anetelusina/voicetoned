import React from "react";
import "./ToneSelector.css";

const ToneSelector = ({ selectedTone, onChange }) => {
  const tones = [
    {
      id: "softened",
      label: "Softened",
      description: "More gentle, diplomatic tone",
    },
    {
      id: "neutral",
      label: "Neutral",
      description: "Balanced professional approach",
    },
    {
      id: "direct",
      label: "Direct",
      description: "Clear, assertive communication",
    },
  ];

  return (
    <div className="tone-selector">
      <label className="selector-label">Select tone:</label>
      <div className="tone-options">
        {tones.map((tone) => (
          <div
            key={tone.id}
            className={`tone-option ${
              selectedTone === tone.id ? "selected" : ""
            }`}
            onClick={() => onChange(tone.id)}>
            <div className="tone-title">{tone.label}</div>
            <div className="tone-description">{tone.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToneSelector;
