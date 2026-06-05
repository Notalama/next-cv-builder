import type { CvFormValues } from "@/app/cv-builder/schema";

/** Sample CV content used as input placeholders and Tab-to-fill defaults. */
export const cvTemplate: CvFormValues = {
  fullName: "John Doe",
  role: "Lead Front-End Engineer",
  photo: "",
  email: "john.doe@example.com",
  phone: "+380 97 000 0000",
  location: "Lviv, Ukraine",
  links: "github.com/johndoe/linkedin.com/in/johndoe",
  languages: [
    { name: "English", level: "C1 / Fluent" },
    { name: "Ukrainian", level: "Native" },
  ],
  primarySkills: "React, TypeScript, Next.js, Tailwind CSS",
  secondarySkills: "Node.js, Docker, Webpack, AWS basics",
  domains: "E-commerce, FinTech, Automotive Simulation, EdTech",
  aboutMe:
    "Performance-driven Lead Front-End Engineer with over 10 years of professional software architecture experience. Specialized in building highly scalable micro-frontend architectures, high-performance web spaces, and modular monorepo configurations. Proven track record of guiding cross-functional agile engineering groups, setting codebase health patterns, and optimizing bundle distribution sizes for enterprise products.",
  techPrinciples: [
    "Strict Type Safety & Code Completeness: Enforcing deep static analysis and clean design boundaries to minimize run-time crashes.",
    "Modular Monorepos over Monoliths: Leveraging isolated encapsulation tracks for multi-team distribution speeds.",
    "Performance-First Rendering: Obsession with Core Web Vitals, tree-shaking, smart caching, and payload budgeting.",
  ].join("\n"),
  projects: [
    {
      companyName: "GlobalLogic Inc.",
      period: "Nov 2024 - Present",
      domain:
        "Intelligent Railway Infrastructure & Condition Monitoring Systems",
      description:
        "Served as Senior Front-End Lead driving the visualization tracking interface processing high-speed LiDAR cloud captures and odometry arrays. Designed real-time geometric point charts mapping complex state conditions across hundreds of transport arrays.",
      technologies:
        "React Three Fiber, TypeScript, Nx Monorepos, Tailwind CSS, Zustand",
      position: "Senior Front-End Lead",
    },
    {
      companyName: "FinTech Nexus Suite",
      period: "Jan 2022 - Oct 2024",
      domain: "Multi-Tenant Banking SaaS Portal",
      description:
        "Orchestrated migration from a legacy monolithic core into decentralized micro-frontends. Established core configuration modules shared across 6 decoupled global delivery branches, significantly dropping cross-team deployment blockers.",
      technologies: "Angular, Module Federation, RxJS, Cypress, Sass",
      position: "Senior Front-End Engineer",
    },
    {
      companyName: "NextGen E-Comm Engine",
      period: "Aug 2019 - Dec 2021",
      domain: "High-Volume Consumer E-Commerce Platform",
      description:
        "Re-architected checkout funnels and item detail modules. Implemented server-side content caching configurations on edge layers, resulting in a 40% uptick in organic search acquisition speeds and 14% higher conversion completion.",
      technologies: "Next.js, GraphQL, Redux Toolkit, Tailwind CSS",
      position: "Senior Front-End Engineer",
    },
  ],
};
