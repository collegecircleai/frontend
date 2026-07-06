export type BillingMode = "monthly" | "yearly";

export interface PlanDefinition {
  id: string;
  name: string;
  duration: string;
  price: number;
  strikethroughPrice?: number;
  annualPrice?: number;
  tagline: string;
  description: string;
  features: string[];
  ctaLabel: string;
  quote: string;
  isPopular?: boolean;
}

export interface TopupDefinition {
  id: string;
  name: string;
  durationHours: number;
  price: number;
  description: string;
  useCases: string[];
  ctaLabel: string;
}

export const ACADEMIC_YEAR_LABEL = "2026-2027";

export const RECHARGE_PLANS: PlanDefinition[] = [
  {
    id: "survival-pack",
    name: "Survival Pack",
    duration: "15 days",
    price: 30,
    tagline: "Your Academic Survival Kit",
    description:
      "Perfect for assignments, internals, last-minute revision, viva prep & PYQ analysis.",
    features: [
      "Full Platform Access",
      "Assignment Maker (up to 4)",
      "Exam Support",
      "Revision Tools",
      "PYQ Intelligence",
    ],
    ctaLabel: "Get Survival Pack",
    quote: "I can survive this semester.",
  },
  {
    id: "cgpa-builder",
    name: "CGPA Builder",
    duration: "30 days",
    price: 99,
    strikethroughPrice: 150,
    annualPrice: 900,
    tagline: "Most Popular",
    description:
      "Everything in Survival Pack — plus the systems to actually get organized.",
    features: [
      "Everything in Survival Pack",
      "Personalized Learning Paths (Advanced)",
      "Assignment Maker (Unlimited)",
      "Smart Revision Plans",
      "Personalized Tests",
      "Productivity Systems",
      "Academic Tracking",
      "Explorer Fellowship Community",
      "Career Guidance",
      "AI Workshops / Projects (free)",
      "Networking Groups",
      "Monthly Challenges",
      "AI Mentor",
      "Early Feature Access",
    ],
    ctaLabel: "Build my CGPA",
    quote: "I finally feel organized.",
    isPopular: true,
  },
  {
    id: "topper-list",
    name: "Topper List",
    duration: "1 month",
    price: 499,
    annualPrice: 5000,
    tagline: "Elite",
    description:
      "Topper List + Curious Student + Elite Study — merged into one tier. The complete academic growth ecosystem.",
    features: [
      "Everything in CGPA Builder",
      "Founder Sessions",
      "Monthly Guidance Call",
      "Premium Badge",
      "Private Student Network",
      "Collaboration Groups",
      "Priority Event Access",
      "Ambassador Network",
      "Leadership Pathway",
      "Startup Discovery Sessions",
      "Builder & Creator Communities",
      "Premium Networking",
      "Premium Workshops",
      "Internship Guidance",
      "Elite Recognition",
    ],
    ctaLabel: "Go Elite",
    quote: "I'm building my future, not just studying.",
  },
];

export const RECHARGE_TOPUPS: TopupDefinition[] = [
  {
    id: "quick-boost",
    name: "Quick Boost",
    durationHours: 12,
    price: 20,
    description: "Unlimited access for 12 hours.",
    useCases: [
      "Assignment deadlines",
      "Internal submissions",
      "Last-minute study sessions",
    ],
    ctaLabel: "Activate Quick Boost",
  },
  {
    id: "assignment-rescue",
    name: "Assignment Rescue",
    durationHours: 24,
    price: 50,
    description: "Unlimited Assignment & PPT generation for 24 hours.",
    useCases: ["Assignments", "Reports", "Presentations", "Viva preparation"],
    ctaLabel: "Activate Assignment Rescue",
  },
  {
    id: "exam-rescue",
    name: "Exam Rescue",
    durationHours: 48,
    price: 60,
    description: "Unlimited revision, PYQ & exam-prep tools for 48 hours.",
    useCases: ["Revision Systems", "PYQ Analysis", "Exam Preparation Tools"],
    ctaLabel: "Activate Exam Rescue",
  },
];
