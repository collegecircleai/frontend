import { useState, useEffect } from "react";
// COMMENTED: API import is no longer needed with dummy data
import { api, getFriendlyErrorMessage } from "@/lib/api";

export interface QuizBloomAnalysis {
  strengths?: string[];
  weaknesses?: string[];
  recommendedFocus?: string[];
  persona?: {
    label?: string;
    summary?: string;
    style?: string;
    strengths?: string[];
    improvementAreas?: string[];
  };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  bloomLevel?:
    | "remember"
    | "understand"
    | "apply"
    | "analyze"
    | "evaluate"
    | "create";
  conceptFocus?: string;
  rationale?: string;
}

export interface TopicContent {
  notes: { detailed: string; summary: string; short: string } | null;
  flashcards: { question: string; answer: string }[] | null;
  quiz: QuizQuestion[] | null;
  quizAnalysis?: QuizBloomAnalysis | null;
  mockExam: { sections: any[] } | null;
  visuals: { imageUrl: string; caption: string }[] | null;
  videos: { title: string; url: string }[] | null;
}

const nullContent: TopicContent = {
  notes: null,
  flashcards: null,
  quiz: null,
  quizAnalysis: null,
  mockExam: null,
  visuals: null,
  videos: null,
};

const getApiBaseUrl = () => {
  const baseUrl = (api as any)?.defaults?.baseURL || "";
  return String(baseUrl).replace(/\/+$/, "");
};

const normalizeQuizQuestions = (quizPayload: any): QuizQuestion[] => {
  const quizFromApi = quizPayload?.questions || [];

  return quizFromApi.map((q: any) => {
    const optionsArray = Array.isArray(q.options) ? q.options : [];
    const correctIndex =
      q.correct !== undefined
        ? q.correct
        : typeof q.correctAnswer === "string"
          ? optionsArray.indexOf(q.correctAnswer)
          : -1;

    return {
      question: q.question,
      options: optionsArray,
      correct: correctIndex,
      bloomLevel: q.bloomLevel,
      conceptFocus: q.conceptFocus,
      rationale: q.rationale,
    };
  });
};

const unwrapNotesPayload = (responseBody: any) => responseBody?.data ?? responseBody;

const readSseStream = async (
  response: Response,
  onEvent: (event: string, data: any) => void,
) => {
  if (!response.body) {
    throw new Error("Streaming response body is not available");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let eventName = "message";
  let dataLines: string[] = [];

  const emitEvent = () => {
    if (!dataLines.length) {
      eventName = "message";
      return;
    }

    const rawData = dataLines.join("\n");
    dataLines = [];
    eventName = "message";

    try {
      onEvent(eventName || "message", JSON.parse(rawData));
    } catch {
      onEvent(eventName || "message", { raw: rawData });
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

    let boundary = buffer.indexOf("\n");
    while (boundary >= 0) {
      const line = buffer.slice(0, boundary).replace(/\r$/, "");
      buffer = buffer.slice(boundary + 1);

      if (!line) {
        if (dataLines.length) {
          const rawData = dataLines.join("\n");
          const currentEvent = eventName;
          dataLines = [];
          eventName = "message";
          try {
            onEvent(currentEvent, JSON.parse(rawData));
          } catch {
            onEvent(currentEvent, { raw: rawData });
          }
        }
      } else if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trimStart());
      }

      boundary = buffer.indexOf("\n");
    }

    if (done) {
      if (dataLines.length) {
        const rawData = dataLines.join("\n");
        const currentEvent = eventName;
        dataLines = [];
        try {
          onEvent(currentEvent, JSON.parse(rawData));
        } catch {
          onEvent(currentEvent, { raw: rawData });
        }
      }
      break;
    }
  }
};

export function useTopicContent(
  courseId: string,
  topicId: string,
  unitNumber: number = 0,
  topicName: string = "",
) {
  const [content, setContent] = useState<TopicContent>({ ...nullContent });
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [notesGenerationNonce, setNotesGenerationNonce] = useState(0);
  const [usePersonalisation, setUsePersonalisation] = useState(true);

  useEffect(() => {
    // Allow generation even when `topicId` is missing by falling back
    // to `topicName` or a unit-based identifier. Only bail out when
    // the courseId is not available.
    if (!courseId) return;

    const fetchOrGenerate = async () => {
      // Generate detailed notes via AI
      await generateDetailedNotes(courseId, topicId, unitNumber, topicName);
    };

    const generateDetailedNotes = async (
      courseId: string,
      topicId: string,
      unitNumber: number,
      topicName: string,
    ) => {
      const resolvedTopicId = topicId || topicName || `unit-${unitNumber}`;

      // Ensure all values sent to the server are explicit strings to avoid
      // accidental `undefined` values that trigger Zod errors on older
      // server builds.
      const payloadTitle = String(topicName || resolvedTopicId || "");
      const cacheBustedTitle = `${payloadTitle} [${usePersonalisation ? 'Personalised' : 'Standard'}]`;
      const payloadContent = String(topicName || resolvedTopicId || "");
      const payloadCourseId = courseId ? String(courseId) : undefined;
      const payloadTopicId = String(resolvedTopicId);
      const payloadUnit = String(unitNumber ?? "");

      console.log(
        `[useTopicContent] Generating detailed notes for topic: ${topicId}, unit: ${unitNumber}`,
      );
      setLoading({ notes: true });
      setError(null);

      try {
        const requestUrl = `${getApiBaseUrl()}/ai/notes?stream=true`;
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await fetch(requestUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            title: cacheBustedTitle,
            content: payloadContent,
            course_id: payloadCourseId,
            topicId: payloadTopicId,
            unit: payloadUnit,
            personalisation: usePersonalisation 
              ? undefined 
              : { tone: "formal", audienceLevel: "intermediate", requiredLength: "medium", outputStyle: "paragraphs" },
          }),
        });

        if (!response.ok) {
          const responseText = await response.text();
          throw new Error(
            responseText || `Request failed with status ${response.status}`,
          );
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("text/event-stream")) {
          const responseBody = await response.json();
          const payload = unwrapNotesPayload(responseBody);
          const notesText =
            typeof payload?.notes === "string" ? payload.notes : "";
          const quizPayload = payload?.quiz;

          setContent({
            notes: {
              detailed: notesText,
              summary: "",
              short: "",
            },
            quiz: normalizeQuizQuestions(quizPayload),
            quizAnalysis: quizPayload?.bloomAnalysis ?? null,
            flashcards: [],
            mockExam: null,
            visuals: null,
            videos: null,
          });
          setLoading({});
          return;
        }

        let notesBuffer = "";
        let quizFromStream: any = null;
        let quizAnalysisFromStream: QuizBloomAnalysis | null = null;
        let isStreaming = false;
        let receivedSomeEvent = false;

        setContent({
          ...nullContent,
          notes: { detailed: "", summary: "", short: "" },
          quiz: [],
          quizAnalysis: null,
        });

        await readSseStream(response, (event, data) => {
          // Mark that we received an SSE event (not raw JSON response)
          if (event !== "message" && !receivedSomeEvent) {
            isStreaming = true;
            receivedSomeEvent = true;
          }

          if (event === "notes_token" && typeof data?.token === "string") {
            notesBuffer += data.token;
            setContent((prev) => ({
              ...prev,
              notes: {
                detailed: notesBuffer,
                summary: prev.notes?.summary || "",
                short: prev.notes?.short || "",
              },
            }));
            return;
          }

          if (event === "notes_done" && typeof data?.notes === "string") {
            notesBuffer = data.notes;
            setContent((prev) => ({
              ...prev,
              notes: {
                detailed: notesBuffer,
                summary: prev.notes?.summary || "",
                short: prev.notes?.short || "",
              },
            }));
            return;
          }

          if (event === "quiz" && data?.quiz) {
            quizFromStream = data.quiz;
            quizAnalysisFromStream = data.quiz?.bloomAnalysis ?? null;

            const quizFromApi = data.quiz?.questions || [];
            const transformedQuiz = quizFromApi.map((q: any) => ({
              question: q.question,
              options: q.options,
              correct: q.options.indexOf(q.correctAnswer),
              bloomLevel: q.bloomLevel,
              conceptFocus: q.conceptFocus,
              rationale: q.rationale,
            }));

            setContent((prev) => ({
              ...prev,
              quiz: transformedQuiz,
              quizAnalysis: quizAnalysisFromStream,
            }));
            return;
          }

          if (event === "done") {
            const notesText =
              typeof data?.notes === "string" ? data.notes : notesBuffer;
            const quizPayload = data?.quiz || quizFromStream;
            const quizFromApi = quizPayload?.questions || [];
            const transformedQuiz = quizFromApi.map((q: any) => ({
              question: q.question,
              options: q.options,
              correct: q.options.indexOf(q.correctAnswer),
              bloomLevel: q.bloomLevel,
              conceptFocus: q.conceptFocus,
              rationale: q.rationale,
            }));

            setContent({
              notes: {
                detailed: notesText,
                summary: "",
                short: "",
              },
              quiz: transformedQuiz,
              quizAnalysis:
                quizPayload?.bloomAnalysis ?? quizAnalysisFromStream ?? null,
              flashcards: [],
              mockExam: null,
              visuals: null,
              videos: null,
            });
            setLoading({});
          }

          if (event === "error") {
            throw new Error(
              data?.message || "Failed to generate study materials",
            );
          }

          // Handle non-streaming JSON response (all data comes at once)
          if (!receivedSomeEvent && event === "message" && data?.notes) {
            receivedSomeEvent = true;
            isStreaming = false;

            // This is a non-streaming JSON response - show all content immediately
            const notesText = typeof data.notes === "string" ? data.notes : "";
            const quizPayload = data.quiz;
            const transformedQuiz = normalizeQuizQuestions(quizPayload);

            setContent({
              notes: {
                detailed: notesText,
                summary: "",
                short: "",
              },
              quiz: transformedQuiz,
              quizAnalysis: quizPayload?.bloomAnalysis ?? null,
              flashcards: [],
              mockExam: null,
              visuals: null,
              videos: null,
            });
            setLoading({});
          }
        });

        if (!quizFromStream && notesBuffer) {
          setContent((prev) => ({
            ...prev,
            notes: {
              detailed: notesBuffer,
              summary: prev.notes?.summary || "",
              short: prev.notes?.short || "",
            },
          }));
        }

        setLoading({});
      } catch (err: any) {
        if (!err?.response && typeof err?.status !== "number") {
          try {
            const legacyResponse = await api.post("/ai/notes", {
              title: cacheBustedTitle,
              content: payloadContent,
              course_id: payloadCourseId,
              topicId: payloadTopicId,
              unit: payloadUnit,
              personalisation: usePersonalisation 
                ? undefined 
                : { tone: "formal", audienceLevel: "intermediate", requiredLength: "medium", outputStyle: "paragraphs" },
            });

            const legacyPayload =
              legacyResponse.data?.data ?? legacyResponse.data;
            const legacyNotes =
              typeof legacyPayload.notes === "string"
                ? legacyPayload.notes
                : JSON.stringify(legacyPayload.notes || "");
            const legacyQuiz = normalizeQuizQuestions(legacyPayload.quiz);

            setContent({
              notes: {
                detailed: legacyNotes,
                summary: "",
                short: "",
              },
              quiz: legacyQuiz,
              quizAnalysis: legacyPayload.quiz?.bloomAnalysis ?? null,
              flashcards: [],
              mockExam: null,
              visuals: null,
              videos: null,
            });
            setLoading({});
            return;
          } catch (legacyError: any) {
            err = legacyError;
          }
        }

        console.error(
          "[useTopicContent] Detailed notes generation failed:",
          err,
        );
        console.error("[useTopicContent] Error details:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          statusText: err.response?.statusText,
          code: err.code,
        });

        const msg = getFriendlyErrorMessage(
          err,
          "Unable to generate study materials right now.",
        );
        const isTimeout =
          err.code === "ECONNABORTED" || msg.includes("timeout");

        if (isTimeout) {
          console.warn(
            "[useTopicContent] Request timeout. The AI service is taking longer than expected.",
          );
          setError(
            "The AI service is taking longer than expected to generate content. Please try again in a moment.",
          );
        } else if (
          msg.toLowerCase().includes("credit") ||
          err.response?.status === 402
        ) {
          console.warn(
            "[useTopicContent] Insufficient credits. Using fallback content...",
          );
          const fallbackData: TopicContent = {
            notes: {
              detailed: `# ${topicId}\n\nThis is a basic overview of ${topicId}. (AI credits exhausted)\n\n## Key Concepts\n- Fundamentals of ${topicId}\n- Basic implementations and use cases\n- Common patterns and best practices`,
              summary: `A concise overview of ${topicId}.`,
              short: `- Key point about ${topicId}`,
            },
            quiz: [],
            quizAnalysis: null,
            flashcards: [],
            mockExam: null,
            visuals: null,
            videos: null,
          };
          setContent(fallbackData);
          setError("AI Credits Exhausted: Using fallback content.");
        } else {
          setError(`Failed to generate study materials: ${msg}`);
        }
        setLoading({});
      }
    };

    if (notesGenerationNonce > 0) {
      fetchOrGenerate();
    }
  }, [courseId, topicId, unitNumber, topicName, notesGenerationNonce, usePersonalisation]);

  const generateForTab = async (
    tab: "flashcards" | "quiz" | "summary" | "short" | "notes",
  ) => {
    // Check if already generating or loaded
    if (loading[tab]) return;
    if (tab === "notes") {
      setLoading((prev) => ({ ...prev, notes: true }));
      setNotesGenerationNonce((prev) => prev + 1);
      return;
    }
    if (
      content.notes &&
      (tab === "summary" || tab === "short") &&
      content.notes[tab]
    )
      return;
    if (tab === "quiz" && content.quiz && content.quiz.length > 0) return;
    if (
      tab === "flashcards" &&
      content.flashcards &&
      content.flashcards.length > 0
    )
      return;

    setLoading((prev) => ({ ...prev, [tab]: true }));
    try {
      if (tab === "summary") {
        // COMMENTED: API call to generate summary
        // const res = await api.post("/ai/notes", {
        //   course_id: courseId,
        //   title: `${topicId} - Summary`,
        //   content: `Provide a concise summary (2-3 paragraphs) of the key concepts for: ${topicId}`,
        // });
        // const payload = res.data?.data ?? res.data;
        // const summaryText =
        //   typeof payload.notes === "string"
        //     ? payload.notes
        //     : JSON.stringify(payload);

        // DUMMY DATA
        const summaryText = `${topicId} is a fundamental concept that encompasses several key principles. It involves understanding the core mechanisms and how they interact with other systems. This topic is essential for building a strong foundation in the field.

Key areas to focus on include the basic principles, practical applications, and common patterns used in industry. Understanding ${topicId} will enable you to make informed decisions in related areas and solve complex problems effectively.

Practice and hands-on experience are crucial for mastering this topic. Regular revision and working through examples will help reinforce your understanding and prepare you for advanced concepts.`;

        setContent((prev) => {
          if (!prev.notes) return prev;
          const newNotes = { ...prev.notes, summary: summaryText };
          return { ...prev, notes: newNotes };
        });
      } else if (tab === "short") {
        // COMMENTED: API call to generate key takeaways
        // const res = await api.post("/ai/notes", {
        //   course_id: courseId,
        //   title: `${topicId} - Key Takeaways`,
        //   content: `Generate a bullet-point list of the top 5 key takeaways for: ${topicId}`,
        // });
        // const payload = res.data?.data ?? res.data;
        // const shortText =
        //   typeof payload.notes === "string"
        //     ? payload.notes
        //     : JSON.stringify(payload);

        // DUMMY DATA
        const shortText = `## Key Takeaways: ${topicId}

1. **Fundamental Principle**: ${topicId} is based on core concepts that apply across various domains and scenarios.

2. **Practical Application**: Understanding how to apply these concepts in real-world situations is critical for success.

3. **Common Patterns**: There are established patterns and best practices that should be followed for optimal results.

4. **Edge Cases**: Be aware of special cases and exceptions that require different approaches or handling.

5. **Continuous Learning**: This field evolves constantly, so staying updated with new developments is essential.`;

        setContent((prev) => {
          if (!prev.notes) return prev;
          const newNotes = { ...prev.notes, short: shortText };
          return { ...prev, notes: newNotes };
        });
      } else if (tab === "quiz") {
        // COMMENTED: API call to generate quiz
        // const res = await api.post("/ai/notes", {
        //   course_id: courseId,
        //   title: `${topicId} - Quiz`,
        //   content: `Generate 5 multiple choice quiz questions for: ${topicId}.
        //   Return ONLY valid JSON: [{"question":"...","options":["a","b","c","d"],"correct":0}]`,
        // });

        // const payload = res.data?.data ?? res.data;
        // const text =
        //   typeof payload.notes === "string"
        //     ? payload.notes
        //     : JSON.stringify(payload);

        // // Extract JSON from potential markdown wrapping
        // const jsonMatch = text.match(/\[\s*\{[\s\S]*?\}\s*\]/);
        // const jsonStr = jsonMatch ? jsonMatch[0] : text;

        // DUMMY DATA
        const quizData = [
          {
            question: `What is the primary purpose of ${topicId}?`,
            options: [
              "To optimize performance and efficiency",
              "To provide a framework for understanding complex systems",
              "To enable better decision making",
              "All of the above",
            ],
            correct: 3,
          },
          {
            question: `Which of the following is a key characteristic of ${topicId}?`,
            options: [
              "It is static and unchanging",
              "It is adaptable to different contexts",
              "It only works in academic settings",
              "It has no practical applications",
            ],
            correct: 1,
          },
          {
            question: `In practice, ${topicId} is most commonly used for:`,
            options: [
              "Theoretical research only",
              "Solving real-world problems and optimization",
              "Entertainment purposes",
              "None of the above",
            ],
            correct: 1,
          },
          {
            question: `What is a common challenge when dealing with ${topicId}?`,
            options: [
              "It is too simple to be useful",
              "It is difficult to understand and apply correctly",
              "It has no documented best practices",
              "It is never used in industry",
            ],
            correct: 1,
          },
          {
            question: `Which statement about ${topicId} is most accurate?`,
            options: [
              "It is becoming less relevant over time",
              "It requires continuous learning and adaptation",
              "It is only relevant for experts",
              "It is a one-time learning topic",
            ],
            correct: 1,
          },
        ];

        setContent((prev) => {
          return {
            ...prev,
            quiz: Array.isArray(quizData) ? quizData : [],
          };
        });
      } else if (tab === "flashcards") {
        // COMMENTED: API call to generate flashcards
        // const res = await api.post("/ai/flashcards", {
        //   question: `Generate flashcards for: ${topicId}`,
        //   personalisation: {
        //     audienceLevel: "beginner",
        //     tone: "friendly",
        //   },
        // });

        // const payload = res.data?.data ?? res.data;
        // const flashcardArray = Array.isArray(payload) ? payload : [payload];

        // const formatted = flashcardArray
        //   .map((fc) => ({
        //     question: fc.question || "",
        //     answer: fc.answer || "",
        //   }))
        //   .filter((fc) => fc.question && fc.answer);

        // DUMMY DATA
        const formatted = [
          {
            question: `Define ${topicId}`,
            answer: `${topicId} is a comprehensive approach/concept that encompasses various methodologies and principles designed to achieve specific objectives and solve problems effectively.`,
          },
          {
            question: `What are the main principles of ${topicId}?`,
            answer: `The main principles include understanding fundamental concepts, applying best practices, adapting to context, continuous improvement, and staying updated with industry standards.`,
          },
          {
            question: `How is ${topicId} applied in practice?`,
            answer: `In practice, ${topicId} is applied by analyzing requirements, identifying relevant patterns, implementing solutions carefully, testing thoroughly, and iterating based on feedback.`,
          },
          {
            question: `What are common mistakes when dealing with ${topicId}?`,
            answer: `Common mistakes include ignoring edge cases, not following best practices, inadequate testing, poor documentation, and failing to adapt to changing requirements.`,
          },
          {
            question: `Why is ${topicId} important to learn?`,
            answer: `Understanding ${topicId} is crucial for solving complex problems, making informed decisions, optimizing performance, and succeeding in related professional roles.`,
          },
          {
            question: `What skills are needed to master ${topicId}?`,
            answer: `Key skills include analytical thinking, practical problem-solving, attention to detail, continuous learning mindset, ability to read documentation, and hands-on practice.`,
          },
        ];

        setContent((prev) => {
          return { ...prev, flashcards: formatted };
        });
      }
    } catch (err) {
      console.error(`[useTopicContent] Failed to generate ${tab}:`, err);
      setError(getFriendlyErrorMessage(err, `Failed to generate ${tab}.`));
    } finally {
      setLoading((prev) => ({ ...prev, [tab]: false }));
    }
  };

  return { content, loading, error, generateForTab, usePersonalisation, setUsePersonalisation };
}
