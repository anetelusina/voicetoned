import React from "react";
import "./PatternHighlighter.css";

// In PatternHighlighter.jsx
const PatternHighlighter = ({ text, patterns }) => {
  if (!patterns || patterns.length === 0) {
    return <div className="highlighted-text">{text}</div>;
  }

  // Sort patterns by their position in the text
  const sortedPatterns = [...patterns].sort((a, b) => a.index - b.index);

  // Create array of text segments and highlighted patterns
  const elements = [];
  let lastIndex = 0;

  sortedPatterns.forEach((pattern, i) => {
    // Add text before the pattern
    if (pattern.index > lastIndex) {
      elements.push(
        <span key={`text-${i}`}>
          {text.substring(lastIndex, pattern.index)}
        </span>
      );
    }

    // Add the highlighted pattern
    const highlightClasses = {
      apology: "highlight-apology",
      doubt: "highlight-doubt",
      permission: "highlight-permission",
      minimizer: "highlight-minimizer",
      validation: "highlight-validation",
    };

    const highlightClass =
      highlightClasses[pattern.type] || "highlight-default";

    elements.push(
      <span
        key={`pattern-${i}`}
        className={highlightClass}
        title={getPatternDescription(pattern)}>
        {text.substring(pattern.index, pattern.index + pattern.length)}
      </span>
    );

    lastIndex = pattern.index + pattern.length;
  });

  // Add any remaining text
  if (lastIndex < text.length) {
    elements.push(<span key="text-end">{text.substring(lastIndex)}</span>);
  }

  return <div className="highlighted-text">{elements}</div>;
};

// Helper function to get description for each pattern type
function getPatternDescription(pattern) {
  const descriptions = {
    apology: "Apologetic phrase that may undermine your message",
    doubt: "Self-doubt expression that can reduce perceived confidence",
    permission:
      "Permission-seeking language that may appear unnecessarily deferential",
    minimizer: "Word that minimizes the importance of your message",
    validation: "Seeking validation or approval unnecessarily",
  };

  return descriptions[pattern.type] || "Communication pattern detected";
}

export default PatternHighlighter;
