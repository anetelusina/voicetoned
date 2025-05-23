// Pattern libraries for communication analysis
const patterns = {
  apologetic: [
    { regex: /sorry to bother you/gi, type: "apology" },
    { regex: /sorry for/gi, type: "apology" },
    { regex: /\bsorry\b/gi, type: "apology" },
    { regex: /apologies/gi, type: "apology" },
    { regex: /excuse me/gi, type: "apology" },
  ],
  selfDoubt: [
    { regex: /i('m| am) not sure/gi, type: "doubt" },
    { regex: /i might be wrong/gi, type: "doubt" },
    { regex: /i don't know if/gi, type: "doubt" },
    { regex: /i'm no expert/gi, type: "doubt" },
    { regex: /correct me if i'm wrong/gi, type: "doubt" },
  ],
  permission: [
    { regex: /is it (ok|okay) if/gi, type: "permission" },
    { regex: /would it be possible/gi, type: "permission" },
    { regex: /do you mind if/gi, type: "permission" },
    { regex: /if you don't mind/gi, type: "permission" },
    { regex: /when you have a chance/gi, type: "permission" },
  ],
  minimizers: [
    { regex: /\bjust\b/gi, type: "minimizer" },
    { regex: /\ba little\b/gi, type: "minimizer" },
    { regex: /\bkind of\b/gi, type: "minimizer" },
    { regex: /\bsort of\b/gi, type: "minimizer" },
    { regex: /\bpossibly\b/gi, type: "minimizer" },
    { regex: /\bmaybe\b/gi, type: "minimizer" },
  ],
  validation: [
    { regex: /does that make sense\?/gi, type: "validation" },
    { regex: /what do you think\?/gi, type: "validation" },
    { regex: /if that works for you/gi, type: "validation" },
    { regex: /is that okay\?/gi, type: "validation" },
    { regex: /let me know if/gi, type: "validation" },
  ],
};

// Pattern definitions with educational content
export const patternDefinitions = {
  apology: {
    name: "Apologetic Language",
    description: "Unnecessary apologies that may undermine confidence",
    impact:
      "Can signal lack of confidence and make requests seem like a burden",
    color: "#ff6b6b",
  },
  doubt: {
    name: "Self-Doubt Expressions",
    description: "Language that undermines your own expertise or opinions",
    impact: "Reduces perceived competence and authority",
    color: "#feca57",
  },
  permission: {
    name: "Permission-Seeking Language",
    description:
      "Asking for permission when you have the right to make requests",
    impact: "Can make legitimate requests seem optional or burdensome",
    color: "#48dbfb",
  },
  minimizer: {
    name: "Minimizing Words",
    description: "Words that downplay the importance of your message",
    impact: "Makes important points seem less significant",
    color: "#ff9ff3",
  },
  validation: {
    name: "Validation-Seeking Phrases",
    description: "Phrases that seek approval or confirmation unnecessarily",
    impact: "Can signal uncertainty about your own ideas",
    color: "#54a0ff",
  },
};

// Identify patterns in text
export function identifyPatterns(text) {
  const foundPatterns = [];

  // Loop through each pattern category
  Object.entries(patterns).forEach(([category, patternList]) => {
    patternList.forEach((pattern) => {
      // Create a new RegExp object to reset lastIndex
      const regex = new RegExp(pattern.regex);
      let match;

      // Find all matches
      while ((match = regex.exec(text)) !== null) {
        // Avoid infinite loops with zero-width matches
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        foundPatterns.push({
          match: match[0],
          index: match.index,
          length: match[0].length,
          type: pattern.type,
          category,
          definition: patternDefinitions[pattern.type],
        });
      }
    });
  });

  // Sort patterns by index to handle overlapping patterns
  foundPatterns.sort((a, b) => a.start - b.start);

  // Remove overlapping patterns (keep the longer one)
  for (let i = 0; i < foundPatterns.length - 1; i++) {
    const current = foundPatterns[i];
    const next = foundPatterns[i + 1];

    // Check if patterns overlap
    if (current.index + current.length > next.index) {
      // Keep the longer pattern
      if (current.length > next.length) {
        foundPatterns.splice(i + 1, 1);
        i--; // Recheck this index
      } else {
        foundPatterns.splice(i, 1);
        i--; // Recheck this index
      }
    }
  }

  return foundPatterns;
}

// Generate insights based on found patterns
function generateInsights(foundPatterns, patternCounts, wordCount) {
  const insights = [];

  const totalPatterns = foundPatterns.length;

  // Most common pattern insight
  if (totalPatterns > 0) {
    const mostCommonType = Object.keys(patternCounts).reduce((a, b) =>
      patternCounts[a] > patternCounts[b] ? a : b
    );

    insights.push({
      type: "most_common",
      title: "Most Common Pattern",
      message: `Your most frequent pattern is ${patternDefinitions[
        mostCommonType
      ].name.toLowerCase()}. ${patternDefinitions[mostCommonType].impact}.`,
      count: patternCounts[mostCommonType],
    });
  }

  // Simple insights based on pattern count
  if (totalPatterns > 3) {
    insights.push({
      type: "multiple_patterns",
      title: "Multiple Softening Patterns",
      message:
        "Your message uses several different types of softening language. Consider if this matches your intended tone.",
      severity: "medium",
    });
  } else if (totalPatterns === 0) {
    insights.push({
      type: "direct_style",
      title: "Direct Communication Style",
      message:
        "Your text uses direct, clear communication without common softening patterns.",
      severity: "info",
    });
  }

  return insights;
}

// Determine overall communication style
function determineOverallStyle(totalPatterns, wordCount) {
  if (totalPatterns === 0) {
    return {
      style: "Direct",
      description:
        "Your communication is clear and straightforward with no detected softening language.",
      confidence: "high",
    };
  } else if (totalPatterns <= 2) {
    return {
      style: "Balanced",
      description:
        "Your communication balances directness with some diplomatic language.",
      confidence: "medium",
    };
  } else {
    return {
      style: "Gentle",
      description:
        "Your communication emphasizes politeness and softer language patterns.",
      confidence: "low",
    };
  }
}

// Main analysis function - simplified to focus on analysis only
export function analyzeText(text) {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const originalText = text;
  const foundPatterns = identifyPatterns(originalText);
  const wordCount = originalText
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Count patterns by type and category
  const patternCounts = {};
  const categoryCounts = {};

  foundPatterns.forEach((pattern) => {
    patternCounts[pattern.type] = (patternCounts[pattern.type] || 0) + 1;
    categoryCounts[pattern.category] =
      (categoryCounts[pattern.category] || 0) + 1;
  });

  const insights = generateInsights(foundPatterns, patternCounts, wordCount);
  const overallStyle = determineOverallStyle(foundPatterns.length, wordCount);

  return {
    original: originalText,
    patterns: foundPatterns,
    patternCounts,
    categoryCounts,
    totalPatterns: foundPatterns.length,
    wordCount,
    insights,
    overallStyle,
  };
}

// Export the main functions
const textAnalysis = {
  analyzeText,
  identifyPatterns,
  patternDefinitions,
};

export default textAnalysis;
