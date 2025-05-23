import React, { useState } from "react";
import PatternHighlighter from "./PatternHighlighter";
import "./ResultDisplay.css";

const ResultDisplay = ({ result }) => {
  const [showLearnMore, setShowLearnMore] = useState(false);

  if (!result) return null;

  const {
    original,
    patterns,
    patternCounts,
    totalPatterns,
    wordCount,
    patternDensity,
    insights,
    overallStyle,
  } = result;

  return (
    <div className="result-display">
      <h2 className="result-title">Analysis Results</h2>

      {/* PRIORITY 1: Highlighted Text */}
      <div className="result-section highlighted-text-section">
        <h3 className="section-title">Your Text with Patterns Highlighted</h3>
        <PatternHighlighter text={original} patterns={patterns} />
      </div>

      {/* PRIORITY 2: Pattern Types Found - Back to prominent display */}
      <div className="result-section pattern-legend">
        <h3 className="section-title">Pattern Types Found:</h3>
        <div className="pattern-explanations">
          {Object.keys(patternCounts).length > 0 ? (
            Object.entries(patternCounts).map(([patternType, count]) => {
              const patternInfo = getPatternInfo(patternType);
              const percentage = Math.round((count / totalPatterns) * 100);

              return (
                <div key={patternType} className="pattern-explanation">
                  <span
                    className={`pattern-indicator highlight-${patternType}`}></span>
                  <div className="pattern-info">
                    <div className="pattern-header">
                      <span className="pattern-type">{patternInfo.name}</span>
                      <span className="pattern-count">
                        {" "}
                        ({count} found - {percentage}%)
                      </span>
                    </div>
                    <p className="pattern-description-full">
                      {patternInfo.description}
                    </p>
                    <p className="pattern-impact">
                      <strong>Impact:</strong> {patternInfo.impact}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-patterns-message">
              <p>
                No softening patterns were found in your text. Your message uses
                direct, clear communication!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="result-section stats-section">
        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-number">{totalPatterns}</span>
            <span className="stat-label">Total Patterns</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{wordCount}</span>
            <span className="stat-label">Total Words</span>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      {insights && insights.length > 0 && (
        <div className="result-section insights-section">
          <h3 className="section-title">Key Insights</h3>
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`insight-card ${insight.severity || "info"}`}>
              <h4>{insight.title}</h4>
              <p>{insight.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Learn More Toggle - At the bottom */}
      <div className="learn-more-section">
        <div
          className="learn-more-toggle"
          onClick={() => setShowLearnMore(!showLearnMore)}>
          <span className="toggle-arrow">{showLearnMore ? "▼" : "▶"}</span>
          <span className="toggle-text">
            Learn More About Communication Patterns
          </span>
        </div>

        {showLearnMore && (
          <div className="learn-more-content">
            <div className="education-section">
              <h4>The Research Behind This Analysis</h4>
              <p>
                Studies show that 56% of women vs. 36% of men feel pressure to
                be "likeable" in their communication. This often leads to
                "softening language" that can impact how messages are received
                in professional settings.
              </p>
            </div>

            <div className="education-section">
              <h4>Context Always Matters</h4>
              <p>
                There's no universally "right" or "wrong" communication style.
                Different situations call for different approaches:
              </p>
              <ul>
                <li>
                  <strong>Direct style</strong> works well for urgent requests,
                  clear instructions, or confident presentations
                </li>
                <li>
                  <strong>Gentle style</strong> can be helpful for sensitive
                  topics, relationship building, or collaborative discussions
                </li>
                <li>
                  <strong>Balanced approach</strong> adapts to your audience,
                  relationship, and goals
                </li>
              </ul>
            </div>

            <div className="education-section">
              <h4>Building Communication Awareness</h4>
              <p>
                The goal isn't to eliminate all softening language, but to use
                it intentionally. Ask yourself: "Does my communication style
                match my intentions and my relationship with this person?"
              </p>
              <p>
                Sometimes softening language builds rapport and shows
                consideration. Other times, direct communication shows respect
                for others' time and demonstrates confidence in your ideas.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get pattern information
function getPatternInfo(type) {
  const patternInfo = {
    apology: {
      name: "Apologetic Language",
      description: "Unnecessary apologies that may undermine confidence",
      impact:
        "Can signal lack of confidence and make requests seem like burdens",
    },
    doubt: {
      name: "Self-Doubt Expressions",
      description: "Language that undermines your own expertise or opinions",
      impact: "Reduces perceived competence and authority",
    },
    permission: {
      name: "Permission-Seeking Language",
      description:
        "Asking for permission when you have the right to make requests",
      impact: "Can make legitimate requests seem optional or burdensome",
    },
    minimizer: {
      name: "Minimizing Words",
      description: "Words that downplay the importance of your message",
      impact: "Makes important points seem less significant",
    },
    validation: {
      name: "Validation-Seeking Phrases",
      description: "Phrases that seek approval or confirmation unnecessarily",
      impact: "Can signal uncertainty about your own ideas",
    },
  };

  return (
    patternInfo[type] || {
      name: "Communication Pattern",
      description: "A detected communication pattern",
      impact: "May affect how your message is perceived",
    }
  );
}

export default ResultDisplay;
