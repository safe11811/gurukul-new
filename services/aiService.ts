
import { ProblemSolution, QuizQuestion, SubjectType, DifficultyLevel, Flashcard, ClassLevel, QuizParams } from "../types";

// --- API CONFIGURATION ---
const OPENROUTER_API_KEY = "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";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";


// Models - Optimized for JSON reliability
// Using Gemini 2.0 Flash Lite as default for better instruction following on JSON tasks
const MODEL_DEFAULT = "nvidia/nemotron-3-ultra-550b-a55b:free";
const MODEL_MATH = "nvidia/nemotron-3-ultra-550b-a55b:free"; 
const MODEL_CS = "nvidia/nemotron-3-ultra-550b-a55b:free";
const MODEL_VISION = "nvidia/nemotron-nano-12b-v2-vl:free";

// --- MOCK DATA ---
const getMockSolution = (prompt: string, subject: string): string => {
  if (subject === SubjectType.CS) {
    return JSON.stringify({
      problemStatement: "Generate Python code for: " + prompt,
      difficulty: "medium",
      finalAnswer: "```python\n# Mock Code Solution (Offline Mode)\ndef solution():\n    print('The AI service is currently unavailable.')\n    print('Please check your internet connection.')\n    return True\n```",
      steps: [
        {
          id: "1",
          label: "Service Unavailable",
          description: "We could not reach the coding model (404/Network Error).",
          type: "concept",
          connections: [{ id: "2", label: "Next" }]
        },
        {
          id: "2",
          label: "Fallback Action",
          description: "This is a placeholder response. Try again later.",
          type: "action",
          connections: []
        }
      ],
      tips: ["Check network connection", "Verify API status"]
    });
  }

  return JSON.stringify({
    problemStatement: prompt.replace('Solve step-by-step: ', '').replace('"', ''),
    difficulty: "medium",
    finalAnswer: "$$\\text{Service Unavailable}$$",
    steps: [
      {
        id: "1",
        label: "Offline Mode",
        description: "We could not reach the AI service. This is a sample response.",
        type: "concept",
        why: "Network or API Error occurred.",
        connections: [{ id: "2" }]
      },
      {
        id: "2",
        label: "Sample Step",
        description: "Please check your connection.",
        type: "formula",
        connections: []
      }
    ],
    tips: ["Check network", "Retry request"]
  });
};

const getMockQuiz = (count: number, subject: string): string => {
  const questions = Array.from({ length: count }).map((_, i) => ({
    text: `Sample Question ${i + 1} for ${subject} (Offline Mode)`,
    type: "mcq",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: "Option A",
    explanation: "This is a placeholder explanation because the AI service could not be reached or returned invalid data.",
    difficulty: "Intermediate",
    tags: [subject, "General"]
  }));
  return JSON.stringify(questions);
};

const getMockFlashcards = (subject: string, topic: string): string => {
  const cards = Array.from({ length: 5 }).map((_, i) => ({
    front: `${topic} Concept ${i + 1}`,
    back: `Definition for concept ${i + 1} in ${subject}. (Offline Mode)`,
    tags: [subject]
  }));
  return JSON.stringify(cards);
};

const getMockProject = (topic: string): string => {
  return JSON.stringify({
    title: topic,
    content: "We are currently offline. Please check your internet connection to generate a human-like draft for your project."
  });
};

// --- HELPER: ROBUST JSON PARSER ---
const parseResponse = (text: string) => {
  if (!text) return null;
  
  let cleaned = text.trim();

  // 1. Remove Markdown Code Blocks (common source of errors)
  // Matches ```json ... ``` or just ``` ... ```
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  
  // 2. Escape fix: Detect single backslashes that are part of LaTeX but invalid in JSON strings
  // Replace \ that is NOT followed by a valid escape char (" \ / b f n r t u) with \\
  // This fixes cases like "val": "\sigma" -> "val": "\\sigma"
  const fixedEscapes = cleaned.replace(/\\(?!["\\/bfnrtu])/g, "\\\\");

  // 3. Try Direct Parse with fixed escapes
  try {
    return JSON.parse(fixedEscapes);
  } catch (e) {
    // 4. Fallback: Try parsing original just in case regex was too aggressive
    try {
        return JSON.parse(cleaned);
    } catch (e2) {
        // Continue to extraction method
    }
  }

  // 5. Extract JSON Object or Array manually
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  
  let start = -1;
  let end = -1;

  // Determine if we are looking for an object or array based on what comes first
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
     start = firstBrace;
     end = cleaned.lastIndexOf('}');
  } else if (firstBracket !== -1) {
     start = firstBracket;
     end = cleaned.lastIndexOf(']');
  }

  if (start !== -1 && end !== -1) {
      let candidate = cleaned.substring(start, end + 1);
      
      // Try parsing candidate directly
      try {
          return JSON.parse(candidate);
      } catch (e3) {
          // Apply escape fix to candidate
          const fixedCandidate = candidate.replace(/\\(?!["\\/bfnrtu])/g, "\\\\");
          try {
              return JSON.parse(fixedCandidate);
          } catch (e4) {
               // Last resort: Aggressive repair
               try {
                  // Fix: Bad escapes (e.g. \_ instead of _)
                  let repaired = fixedCandidate.replace(/\\([^"\\\/bfnrtu])/g, '$1');
                  
                  // Fix: Missing commas between key-value pairs (e.g. "val" "key":)
                  repaired = repaired.replace(/\"\s+[\r\n]+\s*\"/g, '", "');

                  // Fix: Trailing commas
                  repaired = repaired.replace(/,\s*([\]}])/g, '$1');
                  
                  return JSON.parse(repaired);
               } catch (e5) {
                   console.warn("JSON Repair Failed:", e5);
               }
          }
      }
  }
  
  console.warn("AI Response was not valid JSON. Using raw text fallback if possible.");
  return null;
};

// --- API CALLER ---
const callAI = async (messages: any[], mockFallback: () => string, model: string = MODEL_DEFAULT) => {
  // Simple retry logic for 429
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.3, // Lower temperature for more deterministic JSON
          top_p: 0.9,
        })
      });

      if (response.status === 429) {
        console.warn(`AI Rate Limited (429). Retrying attempt ${attempt + 1}...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1))); // Exponential-ish backoff
        continue;
      }

      if (!response.ok) {
          console.warn(`AI API Error ${response.status}: ${response.statusText}. Using offline fallback.`);
          return mockFallback();
      }

      const data = await response.json();
      
      // Check if OpenRouter returned an error object inside 200 OK
      if (data.error) {
          console.warn("AI API Error:", data.error);
          return mockFallback();
      }

      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error("Empty response from AI");
      }
      return content;

    } catch (e) {
      if (attempt === 2) {
         console.warn("AI Network Error or Offline after retries. Using fallback.", e);
         return mockFallback();
      }
    }
  }
  return mockFallback();
};

export const solveProblemWithAI = async (
  problemText: string,
  subject: string,
  mode: 'normal' | 'analogy' = 'normal',
  imageData?: string
): Promise<ProblemSolution | null> => {
  
  // Model Selection Logic
  let selectedModel = MODEL_DEFAULT;
  if (subject === SubjectType.MATH) selectedModel = MODEL_MATH;
  if (subject === SubjectType.CS) selectedModel = MODEL_CS;
  if (imageData) selectedModel = MODEL_VISION;

  // Prompt Logic
  let systemPrompt = '';
  
  const commonJsonSchema = `
    CRITICAL: Output ONLY valid JSON.
    
    LATEX RULES:
    1. Use "$" for inline math (e.g., "$x^2$").
    2. Use "$$" for block math (e.g., "$$\\int f(x) dx$$").
    3. DOUBLE ESCAPE all backslashes (e.g., use "\\\\frac" not "\\frac").
    
    Schema:
    {
      "problemStatement": "Clean version of the problem",
      "difficulty": "easy" | "medium" | "hard",
      "finalAnswer": "The final result in Block LaTeX $$...$$",
      "steps": [
        {
          "id": "1",
          "label": "Short Title",
          "description": "Explanation with text and math. Use $...$ for inline. DOUBLE ESCAPE backslashes!",
          "type": "concept" | "formula" | "action" | "result" | "decision",
          "why": "Deep insight",
          "connections": [ { "id": "2", "label": "Optional Label (e.g. Yes/No/Next)" } ]
        }
      ],
      "tips": ["Pro tip 1"]
    }`;

  if (subject === SubjectType.CS && !imageData) {
    systemPrompt = `You are an expert Senior Software Engineer and Computer Science Tutor.
    Your goal is to generate high-quality, efficient code and explain it step-by-step.
    
    CRITICAL: Output ONLY valid JSON. Do not add markdown text outside the JSON.
    Escape all backslashes and double quotes inside strings.
    
    Output STRICT JSON matching this schema:
    {
      "problemStatement": "Refined problem description",
      "difficulty": "easy" | "medium" | "hard",
      "finalAnswer": "The complete code block in markdown format (e.g. \`\`\`python ... \`\`\`)",
      "steps": [
        {
          "id": "1",
          "label": "Step Title",
          "description": "Explanation of the logic.",
          "type": "action" | "concept" | "decision",
          "why": "Reasoning behind this step",
          "connections": [ { "id": "2", "label": "Next" } ]
        }
      ],
      "tips": ["Best practice tip", "Optimization tip"]
    }`;
  } else {
    systemPrompt = `You are a friendly expert tutor in ${subject}.
    Your goal is to explain the solution step-by-step using a Visual Flowchart structure.
    ${commonJsonSchema}`;
  }

  let messages: any[] = [];

  if (imageData) {
    // Vision Request Construction
    const visionPrompt = `Analyze the image content (math problem, diagram, or code). 
    Extract the problem and solve it step-by-step following this JSON structure strictly.
    ${systemPrompt}
    
    User Note: ${problemText}`;

    messages = [
      {
        role: "user",
        content: [
          { type: "text", text: visionPrompt },
          { type: "image_url", image_url: { url: imageData } }
        ]
      }
    ];
  } else {
    // Text Request Construction
    const userPrompt = mode === 'analogy' && subject !== SubjectType.CS
      ? `Solve this using a real-world analogy first: "${problemText}"` 
      : `Solve/Generate: "${problemText}"`;

    messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];
  }

  const responseText = await callAI(
    messages,
    () => getMockSolution(problemText || "Image Problem", subject),
    selectedModel
  );

  const parsed = parseResponse(responseText);
  if (!parsed) {
    console.warn("Parsing failed, using fresh mock data.");
    return JSON.parse(getMockSolution(problemText, subject)) as ProblemSolution;
  }
  
  // Normalize connections if the model returns string[] instead of object[]
  if (parsed.steps && Array.isArray(parsed.steps)) {
      parsed.steps.forEach((step: any) => {
          if (step.connections && step.connections.length > 0) {
              if (typeof step.connections[0] === 'string') {
                  step.connections = step.connections.map((id: string) => ({ id }));
              }
          }
      });
  }

  return parsed as ProblemSolution;
};

export const generateQuizQuestions = async (params: QuizParams): Promise<QuizQuestion[]> => {
  // Use a strict NCERT examiner persona
  const systemPrompt = `You are an expert NCERT Examiner for India.
  Your task is to generate quiz questions STRICTLY adhering to the NCERT syllabus for ${params.subject} - ${params.classLevel || 'Class 11'}.
  
  CRITICAL RULES:
  1. Content Scope: Questions must be STRICTLY within the specific chapters/topics provided in the user prompt. DO NOT include concepts from other chapters, higher grades, or JEE/NEET unless specified.
  2. Difficulty: Align strictly with ${params.difficulty} level as defined in CBSE/NCERT examinations.
  3. Formatting: Double escape all LaTeX backslashes (e.g. \\\\frac). Use $ for inline math and $$ for block math.
  4. Output: Return ONLY a valid JSON Array.
  
  Schema:
  [
    {
      "text": "Question text (LaTeX allowed)",
      "type": "mcq" | "short_answer" | "boolean",
      "options": ["Option A", "Option B", "Option C", "Option D"] (Required for mcq),
      "correctAnswer": "Option A",
      "explanation": "NCERT-based explanation",
      "difficulty": "${params.difficulty}",
      "tags": ["topic_name"]
    }
  ]`;

  const userPrompt = `Generate ${params.count} questions.
  Scope/Topic: ${params.topic}.
  Question Types: ${params.types.join(', ')}.
  
  Instruction: If the topic above lists specific chapters, ONLY ask questions derived directly from those chapters in the NCERT textbook.`;

  // Use Math model for math quizzes for better logic, default for others
  const model = params.subject === SubjectType.MATH ? MODEL_MATH : MODEL_DEFAULT;

  const responseText = await callAI(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    () => getMockQuiz(params.count, params.subject),
    model
  );

  const questions = parseResponse(responseText);
  
  if (Array.isArray(questions)) {
    return questions.map((q, i) => ({ ...q, id: `q-${Date.now()}-${i}` }));
  }
  
  return JSON.parse(getMockQuiz(params.count, params.subject)).map((q: any, i: number) => ({ ...q, id: `q-mock-${i}` }));
};

export const generateFlashcards = async (subject: SubjectType, topic: string): Promise<Flashcard[]> => {
   const systemPrompt = `Create 10 flashcards for ${subject} in JSON based on NCERT standards. Double escape LaTeX backslashes. Use $ for inline math. Schema: [{"front": "string", "back": "string", "tags": ["string"]}]`;
   const userPrompt = `Topic: ${topic}`;

   const responseText = await callAI(
     [
       { role: "system", content: systemPrompt },
       { role: "user", content: userPrompt }
     ],
     () => getMockFlashcards(subject, topic),
     MODEL_DEFAULT
   );

   let cards = parseResponse(responseText);
   if (!Array.isArray(cards)) {
      if (cards && cards.cards) cards = cards.cards;
      else cards = JSON.parse(getMockFlashcards(subject, topic));
   }

   return cards.map((c: any, i: number) => ({
     id: `fc-${Date.now()}-${i}`,
     front: c.front,
     back: c.back,
     subject,
     mastered: false,
     tags: c.tags || []
   }));
};

export interface DailyGoalContext {
  subjects: SubjectType[];
  classLevel?: ClassLevel;
  masteryMap: Record<string, number>;
  studyTimeMap: Record<string, number>;
  recentQuizScores?: { subject: string; score: number }[];
  streakCount?: number;
}

export interface GoalItem {
  id: string;
  text: string;
  completed: boolean;
  isAISuggested?: boolean;
}

export const generateAIDailyGoals = async (context: DailyGoalContext): Promise<GoalItem[]> => {
  const getFallbackGoals = (): GoalItem[] => {
    const goals: GoalItem[] = [];
    const subjects = context.subjects && context.subjects.length > 0 ? context.subjects : [SubjectType.PHYSICS, SubjectType.CHEMISTRY, SubjectType.MATH];
    
    // Sort subjects by mastery (ascending)
    const sortedByMastery = [...subjects].sort((a, b) => (context.masteryMap[a] || 0) - (context.masteryMap[b] || 0));
    const lowestMasterySub = sortedByMastery[0] || SubjectType.PHYSICS;
    
    // Sort subjects by study time (ascending)
    const sortedByStudyTime = [...subjects].sort((a, b) => (context.studyTimeMap[a] || 0) - (context.studyTimeMap[b] || 0));
    const lowestStudySub = sortedByStudyTime[0] || SubjectType.CHEMISTRY;
    const secondLowestStudySub = sortedByStudyTime[1] || SubjectType.MATH;

    goals.push({
      id: `ai-goal-1-${Date.now()}`,
      text: `🎯 Review low-mastery concepts in ${lowestMasterySub} (${context.masteryMap[lowestMasterySub] || 0}% current score)`,
      completed: false,
      isAISuggested: true
    });

    goals.push({
      id: `ai-goal-2-${Date.now()}`,
      text: `⏱️ Complete a 25-min Pomodoro Focus Sprint on ${lowestStudySub}`,
      completed: false,
      isAISuggested: true
    });

    goals.push({
      id: `ai-goal-3-${Date.now()}`,
      text: `⚡ Practice 5 NCERT exam questions or flashcards in ${secondLowestStudySub}`,
      completed: false,
      isAISuggested: true
    });

    if (context.streakCount && context.streakCount > 0) {
      goals.push({
        id: `ai-goal-4-${Date.now()}`,
        text: `🔥 Complete today's session to extend your ${context.streakCount}-day study streak!`,
        completed: false,
        isAISuggested: true
      });
    }

    return goals;
  };

  const systemPrompt = `You are a personalized AI Study Planner and NCERT Academic Coach.
Based on the student's learning history, subject mastery, focus study time, and streak, generate 3-4 specific, actionable, highly motivating daily study goals for today.

CRITICAL RULES:
1. Target areas where the student has lower mastery score or lower study time recently.
2. Formulate concise, motivating action items (12-18 words max each).
3. Include relevant emoji at start of each goal (e.g. 🧪, 📐, ⚡, ⏱️, 📖).
4. Output STRICT JSON array of strings matching schema: ["Goal string 1", "Goal string 2", "Goal string 3"]`;

  const userPrompt = `Student Context:
- Grade: ${context.classLevel || 'Grade 11'}
- Enrolled Subjects: ${context.subjects.join(', ')}
- Subject Mastery %: ${JSON.stringify(context.masteryMap)}
- Past Week Focus Time (mins): ${JSON.stringify(context.studyTimeMap)}
- Current Day Streak: ${context.streakCount || 0}`;

  try {
    const responseText = await callAI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      () => JSON.stringify(getFallbackGoals().map(g => g.text)),
      MODEL_DEFAULT
    );

    const parsed = parseResponse(responseText);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(0, 4).map((textStr: string, idx: number) => ({
        id: `ai-goal-${Date.now()}-${idx}`,
        text: typeof textStr === 'string' ? textStr : String(textStr),
        completed: false,
        isAISuggested: true
      }));
    }
  } catch (err) {
    console.warn("AI Goal generation error, using smart fallback:", err);
  }

  return getFallbackGoals();
};

export const generateHumanLikeDraft = async (
  subject: SubjectType,
  assignmentType: string,
  topic: string,
  tone: 'Simple' | 'Academic' | 'Creative'
): Promise<{ title: string; content: string }> => {
  
  const systemPrompt = `You are a helpful student assistant. 
  Your goal is to draft an assignment that sounds 100% HUMAN and NATURAL.
  
  CRITICAL STYLE GUIDELINES (To avoid AI Detection):
  1. DO NOT use AI clichés like "delve", "tapestry", "landscape", "pivotal", "in conclusion", "crucial", "testament".
  2. Use VARIED sentence structure. Mix very short sentences with longer ones. (Burstiness).
  3. Use ACTIVE voice.
  4. Include specific examples rather than vague generalizations.
  5. Write with a slightly imperfect, personal voice suitable for a student.
  6. Do not use perfect markdown lists unless strictly necessary. Paragraphs are better.
  
  Output STRICT JSON matching this schema:
  {
    "title": "A catchy title for the assignment",
    "content": "The full body text of the assignment."
  }
  
  IMPORTANT JSON RULES:
  - The "content" field MUST be a single string.
  - Use literal '\\n' for newlines within the content string.
  - DO NOT include raw line breaks (newlines) inside the JSON string values.
  - Escape all double quotes inside the content string (e.g. \\").`;

  const userPrompt = `Subject: ${subject}
  Type: ${assignmentType}
  Topic: ${topic}
  Tone: ${tone} (Adjust vocabulary accordingly).`;

  const responseText = await callAI(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    () => getMockProject(topic),
    MODEL_DEFAULT
  );

  const parsed = parseResponse(responseText);
  if (!parsed) {
    return JSON.parse(getMockProject(topic));
  }
  return parsed;
};
