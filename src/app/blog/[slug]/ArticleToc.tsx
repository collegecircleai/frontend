"use client";

import { useEffect, useState } from "react";

type Heading = {
  id: string;
  text: string;
};

type ArticleTocProps = {
  headings: Heading[];
};

export default function ArticleToc({ headings }: ArticleTocProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!headings.length) return;

    const headingElements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter(Boolean) as HTMLElement[];

    if (!headingElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-120px 0px -65% 0px",
        threshold: 0,
      },
    );

    headingElements.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [headings]);

  const handleTopicClick = (id: string) => {
    setActiveId(id);

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <aside className="article-toc">
      <div className="article-toc-sticky">
        <p className="article-toc-label">On this page</p>

        <nav className="article-toc-list">
          {headings.map((heading) => (
            <button
              key={heading.id}
              type="button"
              onClick={() => handleTopicClick(heading.id)}
              className={`article-toc-link ${
                activeId === heading.id ? "article-toc-link-active" : ""
              }`}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
