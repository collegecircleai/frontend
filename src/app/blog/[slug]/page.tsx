import Image from "next/image";
import ThemedImage from "@/components/blog/ThemedImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/landing/Header";
import ArticleToc from "./ArticleToc";
import { blogs } from "@/data/blogs";

type BlogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Heading = { id: string; text: string };

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  return blogs.map((blog) => ({ slug: blog.slug }));
}

function formatContent(content: string, title: string) {
  const cleanContent = content
    .split("SEO & Publishing Notes (Internal — Do Not Publish)")[0]
    .trim();

  const lines = cleanContent.split("\n");

  if (lines[0]?.trim() === title.trim()) {
    lines.shift();
  }

  const sections = [
    "The One Number That Should Change Everything",
    "Why Indian College Students Need This More Than Anyone",
    "What Personalized Learning Actually Means (And What It Does Not)",
    "How AI Makes This Work in an Indian College Context",
    "The Research Is Clear. The Opportunity Is Now.",
    "What Should You Look For in an AI Learning Tool?",
    "The Student Who Stopped Crying",
    "The Global Tools Are Good. But They Were Not Built for You.",
    'What "Built for India" Actually Has to Mean',
    "The Pricing Reality No One Talks About",
    "What Features Actually Matter (A Honest Comparison)",
    "What Is Coming Next",
    "The Real Question",
  ];

  const elements: React.ReactNode[] = [];
  const headings: Heading[] = [];

  let paragraph: string[] = [];
  let skipNextIfBlankLabel = false;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;

    const text = paragraph.join(" ").trim();

    if (text) {
      elements.push(
        <p key={`p-${elements.length}`} className="article-paragraph">
          {text}
        </p>,
      );
    }

    paragraph = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      return;
    }

    if (
      line.startsWith("Meta Title:") ||
      line.startsWith("Meta Description:") ||
      line.startsWith("Target Keywords:") ||
      line.startsWith("Slug:")
    ) {
      const parts = line.split(":");
      const value = parts[1];

      skipNextIfBlankLabel = !value || value.trim() === "";
      return;
    }

    if (skipNextIfBlankLabel) {
      skipNextIfBlankLabel = false;
      return;
    }

    if (line.startsWith("By Mr. Owl")) return;

    if (sections.includes(line)) {
      flushParagraph();

      const id = slugify(line);

      headings.push({
        id,
        text: line,
      });

      elements.push(
        <h2 key={`h-${elements.length}`} id={id} className="article-heading">
          {line}
        </h2>,
      );

      return;
    }

    paragraph.push(line);
  });

  flushParagraph();

  return {
    elements,
    headings,
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;

  const blog = blogs.find((item) => item.slug === slug);

  if (!blog) {
    notFound();
  }

  const { elements, headings } = formatContent(blog.content, blog.title);

  const related = blogs.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <>
      <Header />

      <main className="article-page">
        <article className="article-container">
          {/* Breadcrumb */}
          <div className="article-breadcrumb">
            <Link href="/blog">Resources</Link>
            <span>/</span>
            <Link href="/blog">Blog</Link>
            <span>/</span>
            <span className="article-breadcrumb-current">{blog.title}</span>
          </div>

          {/* Header */}
          <header className="article-header">
            <p className="article-category">{blog.category}</p>

            <h1 className="article-title">{blog.title}</h1>

            <div className="article-byline">
              <span>{blog.author}</span>
              <span className="article-dot">•</span>
              <span>College Circle AI</span>
            </div>
          </header>

          {/* Hero Image */}
          <div className="article-hero-image">
            <ThemedImage
              lightSrc={blog.image}
              darkSrc={blog.imageDark}
              alt={blog.title}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 1180px"
            />
          </div>

          {/* Three-column layout */}
          <div className="article-layout">
            {/* Left: On this page */}
            <ArticleToc headings={headings} />

            {/* Center: Body */}
            <div className="article-body">{elements}</div>

            {/* Right: Related Articles */}
            <aside className="article-related">
              <p className="article-related-label">Related Articles</p>

              <div className="article-related-list">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="article-related-card"
                  >
                    <div className="article-related-image">
                      <ThemedImage
                        lightSrc={item.image}
                        darkSrc={item.imageDark}
                        alt={item.title}
                        fill
                        sizes="96px"
                      />
                    </div>

                    <div>
                      <p className="article-related-category">
                        {item.category}
                      </p>

                      <p className="article-related-title">{item.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          </div>

          {/* Footer */}
          <footer className="article-footer">
            <div>
              <p className="article-footer-label">COLLEGE CIRCLE AI</p>

              <p className="article-footer-text">
                Learning, education technology, and student success.
              </p>
            </div>

            <Link href="/blog" className="article-footer-link">
              More articles
              <span>→</span>
            </Link>
          </footer>
        </article>
      </main>
    </>
  );
}
