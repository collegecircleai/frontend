"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ArrowRight, Plus } from "lucide-react";
import api from "@/lib/api";
// import LeftPanel from "@/components/LeftPanel";

interface Course {
  id: string;
  name: string;
  department?: string;
  semester?: string;
  unitCount: number;
  progress: number;
  completedUnits: number;
}

export default function CoursePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses/my");
        const raw = response.data?.data;
        const items = Array.isArray(raw) ? raw : [];

        const mappedCourses: Course[] = items.map((course: any) => {
          const totalUnits = Number(course.total_units ?? 0);
          const completedUnits = Number(course.unit_completed ?? 0);
          const progress =
            totalUnits > 0
              ? Math.min(
                  100,
                  Math.max(0, Math.round((completedUnits / totalUnits) * 100)),
                )
              : 0;

          return {
            id: course.course_id,
            name: course.name ?? "Untitled Course",
            department: course.department ?? "General",
            semester: course.semester ? String(course.semester) : "-",
            unitCount: totalUnits,
            progress,
            completedUnits,
          };
        });

        setCourses(mappedCourses);
      } catch {
        setError("Unable to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Panel */}
      {/* <LeftPanel variant="course" /> */}

      {/* Main Content */}
      <div 
        style={{ 
          flex: 1, 
          paddingBottom: 60,
          padding: isMobile ? "24px 20px" : "40px 56px",
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%"
        }}
      >

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: isMobile ? 24 : 32,
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: 8,
            }}
          >
            My Courses
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              color: "var(--mist)",
            }}
          >
            View and manage your enrolled courses. {courses.length} courses in
            progress.
          </p>
        </div>

        {loading && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--mist)",
              marginBottom: 16,
            }}
          >
            Loading courses...
          </p>
        )}

        {error && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "#DC2626",
              marginBottom: 16,
            }}
          >
            {error}
          </p>
        )}

        {/* Upload CTA */}
        <div style={{ marginBottom: 32 }}>
          <button
            onClick={() => router.push("/upload")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              background: "#4D3FFF",
              border: "none",
              borderRadius: 999,
              padding: "12px 24px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#3D2FEF")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#4D3FFF")}
          >
            <Plus size={16} /> Upload New Course
          </button>
        </div>

        {/* Courses Grid */}
         <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile 
              ? "1fr" 
              : "repeat(auto-fill, minmax(340px, 1fr))",
            gap: isMobile ? 16 : 24,
          }}
        >

          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => router.push(`/course/${course.id}`)}
               style={{
                background: "var(--deep)",
                borderRadius: 24,
                padding: isMobile ? 20 : 28,
                boxShadow: "0 8px 30px rgba(0,0,0,0.02)",
                border: "1px solid var(--border-light)",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                position: "relative",
                overflow: "hidden"
              }}

               onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "var(--violet)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.02)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border-light)";
              }}

            >
              {/* Icon */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "linear-gradient(135deg,#4D3FFF,#7B70FF)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BookOpen size={28} color="white" />
              </div>

              {/* Course Info */}
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--mist)",
                    marginBottom: 4,
                  }}
                >
                  {course.department} • Semester {course.semester}
                </p>
                 <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: isMobile ? 18 : 20,
                    fontWeight: 600,
                    color: "var(--ink)",
                    marginBottom: 8,
                    lineHeight: 1.3,
                    wordBreak: "break-word",
                    overflowWrap: "anywhere"
                  }}
                >
                  {course.name}
                </h3>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--mist)",
                  }}
                >
                  {course.unitCount} units
                </p>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: 8 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--mist)",
                    }}
                  >
                    Progress
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  >
                    {course.progress}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "var(--border-light)",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      background: "#4D3FFF",
                      width: `${course.progress}%`,
                      borderRadius: 999,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={(e) => {
                  router.push(`/course/${course.id}`);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  marginTop: 8,
                  background: "var(--violet-pale)",
                  color: "var(--violet)",
                  border: "none",
                  borderRadius: 12,
                  padding: "10px 16px",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                Continue <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Empty state fallback */}
        {!loading && courses.length === 0 && !error && (
          <div
            style={{
              background: "var(--deep)",
              borderRadius: 20,
              padding: 60,
              textAlign: "center",
              border: "1px solid var(--border-light)",
              boxShadow: "0 2px 16px rgba(77,63,255,0.06)",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>📚</div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: 8,
              }}
            >
              No courses yet
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--mist)",
                marginBottom: 24,
              }}
            >
              Upload your first course plan to get started.
            </p>
            <button
              onClick={() => router.push("/upload")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                borderRadius: 999,
                padding: "12px 28px",
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                background: "#4D3FFF",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Plus size={16} /> Upload Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
