/* ─── Study Interface Types & Constants ─── */

export interface Topic {
  topicId: string;
  topicName: string;
  isCompleted?: boolean;
  unitNumber?: number;
}

export interface Unit {
  unitName: string;
  unitNumber: number;
  topics: Topic[];
}

export interface CourseData {
  courseName: string;
  department?: string;
  semester?: string;
  units: Unit[];
  unitCompleted?: number;
}

export const TAB_CONFIG = [
  { key: "notes", label: "Notes", emoji: "📝" },
  { key: "quiz", label: "Quiz", emoji: "🧪" },
] as const;

export type TabKey = (typeof TAB_CONFIG)[number]["key"];

export const SHIMMER_CSS = `
@keyframes cc-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes cc-spin {
  to { transform: rotate(360deg); }
}
@keyframes cc-flip {
  0%   { transform: rotateY(0deg); }
  100% { transform: rotateY(180deg); }
}
@keyframes cc-flip-back {
  0%   { transform: rotateY(180deg); }
  100% { transform: rotateY(360deg); }
}
@keyframes cc-fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;
