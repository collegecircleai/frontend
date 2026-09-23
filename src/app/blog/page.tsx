"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  BarChart3,
  Users,
  FileText,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Clock,
} from "lucide-react";
import Header from "@/components/landing/Header";
import ThemedImage from "@/components/blog/ThemedImage";
import { blogs } from "@/data/blogs";

const categories = [
  "All",
  "Study Tips",
  "Learning Strategies",
  "Exams",
  "Student Life",
  "Productivity",
];

const topics = [
  { label: "Study Tips", icon: GraduationCap },
  { label: "Exams", icon: GraduationCap },
  { label: "Productivity", icon: BarChart3 },
  { label: "Student Life", icon: Users },
  { label: "Learning Strategies", icon: FileText },
  { label: "Career Growth", icon: Lightbulb },
];

function estimateReadingTime(content: string): number {
  const clean = content.split(
    "SEO & Publishing Notes (Internal — Do Not Publish)",
  )[0];
  const words = clean.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogPage() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const runSearch = () => {
    setSearchQuery(inputValue.trim().toLowerCase());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runSearch();
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      !searchQuery ||
      blog.title.toLowerCase().includes(searchQuery) ||
      blog.category.toLowerCase().includes(searchQuery);

    const matchesCategory =
      activeCategory === "All" ||
      blog.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />

      <main className="blog-page">
        {/* Hero */}
        <section className="blog-hero-v2">
          <div className="blog-hero-grid">
            <div className="blog-hero-text">
              <p className="blog-eyebrow-v2">COLLEGE CIRCLE AI / RESOURCES</p>

              <h1 className="blog-title-v2">
                Ideas for a <em>smarter</em> semester
              </h1>

              <p className="blog-description-v2">
                Practical guides, study strategies and fresh perspectives to
                help you learn, grow and make the most of your college journey.
              </p>

              <div className="blog-search-bar">
                <Search
                  size={16}
                  onClick={runSearch}
                  style={{ cursor: "pointer" }}
                />
                <input
                  type="text"
                  placeholder="Search articles, topics or keywords..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div className="blog-pills">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`blog-pill ${
                      activeCategory === cat ? "blog-pill-active" : ""
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="blog-hero-image">
              <ThemedImage
                lightSrc="/Blog/Picture4.png"
                darkSrc="/Blog/Picture4-dark.png"
                alt="Student studying with AI-powered learning tools"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 620px"
              />
            </div>
          </div>
        </section>

        {/* Latest Articles */}
        <section className="blog-latest-section">
          <div className="blog-latest-heading">
            <div>
              <p className="blog-section-kicker">LATEST ARTICLES</p>
              <h2>Learn. Apply. Grow.</h2>
            </div>

            <Link href="/blog" className="blog-view-all">
              View all articles <span>→</span>
            </Link>
          </div>

          <div className="blog-grid-v2">
            {filteredBlogs.map((blog) => (
              <Link
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                className="blog-card-link"
              >
                <article className="blog-card">
                  <div className="blog-card-image">
                    <ThemedImage
                      lightSrc={blog.image}
                      darkSrc={blog.imageDark}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    />
                  </div>

                  <div className="blog-card-content">
                    <p className="blog-card-category">{blog.category}</p>

                    <h3>{blog.title}</h3>

                    <p className="blog-card-excerpt">
                      Explore how AI-powered learning can help students study
                      according to their own pace.
                    </p>

                    <div className="blog-card-footer">
                      <Clock size={14} />
                      <span>{estimateReadingTime(blog.content)} min read</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <p className="blog-no-results">
              No articles match your search. Try a different keyword.
            </p>
          )}
        </section>

        {/* Explore Topics */}
        <section className="blog-topics-section">
          <p className="blog-section-kicker">EXPLORE TOPICS</p>

          <div className="blog-topics-row">
            <div className="blog-topics-list">
              {topics.map((topic) => {
                const Icon = topic.icon;

                return (
                  <button
                    key={topic.label}
                    type="button"
                    className="blog-topic-item"
                  >
                    <Icon size={16} />
                    <span>{topic.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="blog-topics-nav">
              <button type="button" aria-label="Previous">
                <ChevronLeft size={16} />
              </button>

              <button type="button" aria-label="Next">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
