import React from "react";
import PatternHighlighter from "./PatternHighlighter";
import "./ResultDisplay.css";

const ResultDisplay = ({ result }) => {
  const { original, transformed, patterns } = result;

  // Count patterns by type
  const patternCounts = patterns.reduce((counts, pattern) => {
    counts[pattern.type] = (counts[pattern.type] || 0) + 1;
    return counts;
  }, {});

  // Get unique pattern types that were found
  const uniquePatternTypes = [
    ...new Set(patterns.map((pattern) => pattern.type)),
  ];

  return (
    <div className="result-display">
      <h2 className="result-title">Analysis Results</h2>

      {/* Pattern Explanations Section */}
      <div className="result-section pattern-legend">
        <h3 className="section-title">Pattern Types Found:</h3>
        <div className="pattern-explanations">
          {uniquePatternTypes.length > 0 ? (
            uniquePatternTypes.map((type) => (
              <div key={type} className="pattern-explanation">
                <span className={`pattern-indicator highlight-${type}`}></span>
                <div className="pattern-info">
                  <span className="pattern-type">{getPatternTitle(type)}</span>
                  <span className="pattern-count">
                    {" "}
                    ({patternCounts[type]} found)
                  </span>
                  <p className="pattern-description-full">
                    {getPatternDescription(type, true)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-patterns-message">
              <p>
                No softening patterns were found in your text. Your message is
                already direct and assertive!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="result-section">
        <h3 className="section-title">Original Text:</h3>
        <PatternHighlighter text={original} patterns={patterns} />
      </div>

      <div className="result-section">
        <h3 className="section-title">Transformed Text:</h3>
        <div className="transformed-text">{transformed}</div>
      </div>
    </div>
  );
};

// Helper function to get the title for each pattern type
function getPatternTitle(type) {
  const titles = {
    apology: "Apologetic Language",
    doubt: "Self-Doubt Expressions",
    permission: "Permission-Seeking Language",
    minimizer: "Minimizing Words",
    validation: "Validation-Seeking Phrases",
  };

  return titles[type] || "Communication Pattern";
}

// Helper function to get description for each pattern type
function getPatternDescription(type, detailed = false) {
  if (detailed) {
    // More detailed descriptions for the legend
    const detailedDescriptions = {
      apology:
        "Phrases that express unnecessary apology or remorse. These can undermine your message and authority, especially when used habitually in situations that don't warrant an apology.",
      doubt:
        "Expressions that communicate lack of confidence in your own ideas or statements. These can lead others to question your expertise or conviction.",
      permission:
        "Language that asks for permission when it may not be necessary. This can position you as subordinate even when direct communication would be more effective.",
      minimizer:
        "Words that reduce the perceived importance of your message or request. These often diminish the impact of otherwise clear statements.",
      validation:
        "Phrases that seek approval or confirmation unnecessarily. These can signal a lack of confidence in your ideas or statements.",
    };
    return (
      detailedDescriptions[type] ||
      "A common communication pattern that may affect how your message is perceived."
    );
  } else {
    // Shorter descriptions for the list
    const descriptions = {
      apology: "Apologetic phrase that may undermine your message",
      doubt: "Self-doubt expression that can reduce perceived confidence",
      permission:
        "Permission-seeking language that may appear unnecessarily deferential",
      minimizer: "Word that minimizes the importance of your message",
      validation: "Seeking validation or approval unnecessarily",
    };
    return descriptions[type] || "Communication pattern detected";
  }
}

export default ResultDisplay;
