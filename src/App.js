import React, { useState } from "react";
import "./App.css";
import ResultDisplay from "./components/ResultDisplay";
import { analyzeText } from "./utils/textAnalysis";

function App() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;

    const analysis = analyzeText(inputText);
    setResult(analysis);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">VoiceToned</h1>
      <p className="app-description">
        Discover patterns in your communication style and understand their
        impact.
      </p>

      <div className="input-section">
        <label className="input-label">Paste your message:</label>
        <textarea
          className="text-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="E.g., Sorry to bother you, but I was just wondering if maybe we could possibly schedule a meeting this week?"
        />
      </div>

      <button className="analyze-button" onClick={handleAnalyze}>
        Analyze
      </button>

      {result && <ResultDisplay result={result} />}
    </div>
  );
}

export default App;
