import type { CvFormValues } from "@/models/cv";
import { cvFormSchema } from "@/models/cv";

/**
 * Fictional CV shown in the public template previews. Kept separate from
 * `cv-preset.json` so no real contact details are served to anonymous visitors.
 */
export const LANDING_DEMO_CV: CvFormValues = cvFormSchema.parse({
  fullName: "Alex Morgan",
  role: "Senior Product Engineer",
  photo: "",
  email: "alex.morgan@example.com",
  phone: "+1 555 0134",
  location: "Berlin, Germany",
  links: "https://github.com/example, https://www.linkedin.com/in/example",
  languages: [
    { name: "English", level: "Native" },
    { name: "German", level: "B2" },
  ],
  primarySkills: "TypeScript, React, Next.js, Node.js, PostgreSQL",
  secondarySkills:
    "GraphQL, Tailwind CSS, Playwright, Vitest, Docker, Terraform, AWS, Figma",
  skillCategories:
    "Frontend: React, Next.js, TypeScript\nState & data: TanStack Query, Zustand, GraphQL\nStyling: Tailwind CSS, CSS Modules, design systems\nBackend: Node.js, PostgreSQL, Drizzle ORM\nTesting: Vitest, Playwright, Testing Library\nCloud & DevOps: AWS, Docker, GitHub Actions",
  domains: "SaaS, Developer Tools, E-commerce, Marketplaces",
  aboutMe:
    "Senior product engineer with 9 years of experience turning fuzzy product ideas into shipped, measurable features.\nComfortable owning a slice end to end: schema design, server rendering, interaction details, and the tests that keep it honest.\nHappiest in small teams where engineering sits close to the customer.",
  techPrinciples:
    "Design for the reader: code is read far more often than it is written, so clarity beats cleverness.\nTest the behaviour, not the implementation: suites should survive refactors and still catch regressions.\nMeasure before optimising: profile first, then spend the complexity budget where it pays off.",
  projects: [
    {
      companyName: "Northwind Labs",
      period: "2023 - Present",
      position: "Senior Product Engineer",
      domain: "Developer Tools",
      description:
        "Led the rebuild of the customer-facing dashboard on the App Router, cutting time to first byte by 40% and replacing a hand-rolled data layer with typed server actions. Introduced a shared component library that three product teams now build on.",
      technologies: "Next.js, TypeScript, PostgreSQL, Drizzle ORM, Playwright",
    },
    {
      companyName: "Harbor Commerce",
      period: "2020 - 2023",
      position: "Full-stack Engineer",
      domain: "E-commerce",
      description:
        "Owned checkout for a marketplace serving 1.2M monthly shoppers. Rewrote the payment flow around idempotent server operations, which removed a long tail of duplicate-charge incidents, and drove the automated test suite from 20% to 80% coverage.",
      technologies: "React, Node.js, Stripe, Redis, GraphQL",
    },
    {
      companyName: "Meridian Studio",
      period: "2017 - 2020",
      position: "Frontend Engineer",
      domain: "SaaS",
      description:
        "Built analytics interfaces for B2B clients, including a virtualised table that renders 100k rows without dropping frames. Set up the design-token pipeline that kept eight client themes in sync from a single source.",
      technologies: "React, Redux, D3.js, Sass, Webpack",
    },
  ],
  education: [
    {
      institution: "Technical University of Munich",
      period: "2013 - 2017",
      degree: "BSc in Computer Science",
    },
  ],
});
