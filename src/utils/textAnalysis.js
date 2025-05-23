// Pattern libraries
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
        });
      }
    });
  });

  // Sort patterns by index to handle overlapping patterns
  foundPatterns.sort((a, b) => a.index - b.index);

  // Remove overlapping patterns
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

// Simple transformation rules
const transformationRules = {
  direct: [
    // Better handling of doubt phrases at beginning of sentences
    {
      from: /i('m| am) not sure if (this is|that is|these are|those are)/gi,
      to: function (match, g1, g2) {
        // Capitalize the first letter of g2
        return g2.charAt(0).toUpperCase() + g2.slice(1);
      },
    },
    { from: /i('m| am) not sure/gi, to: "I am confident" },
    { from: /i might be wrong,? but/gi, to: "" },
    { from: /sorry to bother you,?\s*/gi, to: "" },
    { from: /i was wondering if\s*/gi, to: "I need " },
    { from: /would it be possible to\s*/gi, to: "Please " },
    { from: /\bjust\b\s*/gi, to: "" },
    { from: /\ba little\b\s*/gi, to: "" },
    { from: /\bkind of\b\s*/gi, to: "" },
    { from: /\bsort of\b\s*/gi, to: "" },
    { from: /\bmaybe\b\s*/gi, to: "" },
    { from: /\bpossibly\b\s*/gi, to: "" },
    { from: /if you don't mind\s*/gi, to: "" },
    { from: /when you have a chance\s*/gi, to: "by Friday " },
    { from: /i hope this isn't an inconvenience,?\s*/gi, to: "" },
    { from: /does that make sense\?/gi, to: "" },
    {
      from: /sorry for all the questions/gi,
      to: "These questions will help clarify the requirements",
    },
    {
      from: /sorry for the delay\s*/gi,
      to: "The timeline has been extended. ",
    },
  ],
  neutral: [
    // Better handling of doubt phrases
    {
      from: /i('m| am) not sure if (this is|that is|these are|those are)/gi,
      to: function (match, g1, g2) {
        return "I believe " + g2;
      },
    },
    { from: /i('m| am) not sure/gi, to: "I believe" },
    { from: /i might be wrong,? but/gi, to: "I think " },
    { from: /sorry to bother you,?\s*/gi, to: "" },
    { from: /i was wondering if\s*/gi, to: "Could you " },
    { from: /would it be possible to\s*/gi, to: "Please " },
    { from: /\bjust\b\s*/gi, to: "" },
    {
      from: /sorry for all the questions/gi,
      to: "Thank you for addressing these questions.",
    },
    {
      from: /does that make sense\?/gi,
      to: "Please let me know if you have any questions.",
    },
    { from: /no pressure/gi, to: "I appreciate your consideration" },
  ],
  softened: [
    // Mostly keep as is, but could add some additional softeners
    { from: /send me this/gi, to: "send this to me when you have a chance" },
    { from: /I need/gi, to: "I would appreciate" },
    { from: /must be done/gi, to: "would ideally be completed" },
  ],
};

// Main analysis function
export function analyzeText(text, tone) {
  // Store the original text
  const originalText = text;

  // Identify all patterns in the original text
  const foundPatterns = identifyPatterns(originalText);

  // Apply transformations based on selected tone
  let transformed = originalText;

  // Apply simple transformation rules
  transformationRules[tone]?.forEach((rule) => {
    if (typeof rule.to === "function") {
      // Handle function-based replacements
      transformed = transformed.replace(rule.from, rule.to);
    } else {
      // Handle string-based replacements
      transformed = transformed.replace(rule.from, rule.to);
    }
  });

  // Make sure the first letter is capitalized after transformations
  transformed = transformed.replace(/^[a-z]/, (match) => match.toUpperCase());

  // Fix any double spaces
  transformed = transformed.replace(/\s{2,}/g, " ");

  // Fix any sentences that might now start with lowercase letters
  transformed = transformed.replace(/\.\s+[a-z]/g, (match) =>
    match.replace(/[a-z]/, (letter) => letter.toUpperCase())
  );

  return {
    original: originalText,
    transformed,
    patterns: foundPatterns,
  };
}

// Export the full module
const textAnalysis = {
  analyzeText,
  identifyPatterns,
};

export default textAnalysis;
