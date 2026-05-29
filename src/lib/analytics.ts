import api from "@/lib/api";

export type AnalyticsEventInput = {
  action: string;
  topicId: string;
  score?: number;
  weakTopic?: boolean;
  strongTopic?: boolean;
  unitNumber?: number;
  incrementTopicsStudied?: boolean;
  incrementQuizzesDone?: boolean;
  unlockedUnit?: boolean;
  completedTopicCount?: number;
  summary?: Record<string, unknown>;
  weekly?: unknown[];
  scores?: unknown[];
  weakTopics?: unknown[];
  strongTopics?: unknown[];
  courseProgress?: unknown[];
  persona?: unknown;
  analysis?: unknown;
};

export async function trackAnalyticsEvent(input: AnalyticsEventInput) {
  try {
    const payload: Record<string, unknown> = {
      activity: [
        {
          action: input.action,
          topic: input.topicId,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    if (input.incrementTopicsStudied || input.incrementQuizzesDone) {
      payload.weekly = input.weekly ?? [];
    }

    if (typeof input.score === "number") {
      payload.scores = input.scores ?? [];
      if (typeof input.weakTopic === "boolean") {
        payload.weakTopics = input.weakTopics ?? [];
      }
      if (typeof input.strongTopic === "boolean") {
        payload.strongTopics = input.strongTopics ?? [];
      }
    }

    if (input.unlockedUnit) {
      payload.summary = input.summary ?? {};
      payload.courseProgress = input.courseProgress ?? [];
    }

    if (typeof input.persona !== "undefined") {
      payload.persona = input.persona;
    }

    if (typeof input.analysis !== "undefined") {
      payload.analysis = input.analysis;
    }

    await api.put("/analytics/dashboard", payload);
  } catch {
    // Analytics must never block the user flow.
  }
}
