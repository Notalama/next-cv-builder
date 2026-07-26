import { z } from "zod";

export const cvLanguageSchema = z.object({
  name: z.string().min(1, "Language name required"),
  level: z.string().min(1, "Proficiency level required"),
});

export const cvEducationSchema = z.object({
  institution: z.string().min(2, "Institution name is required"),
  period: z.string().min(2, "Period is required (e.g., 2009 - 2013)"),
  degree: z.string().min(2, "Degree is required"),
});

export const cvProjectSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  period: z
    .string()
    .min(2, "Period of work is required (e.g., 2024 - Present)"),
  position: z.string().min(2, "Position on the project is required"),
  description: z
    .string()
    .min(10, "Please provide a more descriptive summary and your role"),
  technologies: z
    .string()
    .min(2, "Enter at least one key technology (comma separated)"),
  domain: z.string().min(2, "Domain is required"),
});

export const cvFormSchema = z.object({
  // Contact details
  fullName: z.string().min(2, "Full name is required"),
  role: z.string().min(2, "Professional title/role is required"),
  photo: z.string().optional(),
  email: z.email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  location: z.string().min(2, "Location is required"),
  links: z.string().optional(),

  // Left column lists
  languages: z.array(cvLanguageSchema),
  primarySkills: z
    .string()
    .min(2, "Enter at least a few core skills (comma separated)"),
  secondarySkills: z.string().optional(),
  skillCategories: z.string().optional(),
  domains: z
    .string()
    .min(2, "Enter domains you have worked in (comma separated)"),

  // Right column summary
  aboutMe: z.string().min(10, "Profile summary must be longer"),
  techPrinciples: z
    .string()
    .min(10, "Please list some of your core engineering principles"),

  // Projects array
  projects: z.array(cvProjectSchema),

  // Education
  education: z.array(cvEducationSchema),
});

export type CvLanguage = z.infer<typeof cvLanguageSchema>;
export type CvEducation = z.infer<typeof cvEducationSchema>;
export type CvProject = z.infer<typeof cvProjectSchema>;
export type CvFormValues = z.infer<typeof cvFormSchema>;

export type CvImportResult =
  | { ok: true; data: CvFormValues }
  | { ok: false; message: string };

export const EMPTY_CV_LANGUAGE: CvLanguage = { name: "", level: "" };

export const EMPTY_CV_EDUCATION: CvEducation = {
  institution: "",
  period: "",
  degree: "",
};

export const EMPTY_CV_PROJECT: CvProject = {
  companyName: "",
  period: "",
  position: "",
  description: "",
  technologies: "",
  domain: "",
};

export const CV_FORM_DEFAULT_VALUES: CvFormValues = {
  fullName: "",
  role: "",
  photo: "",
  email: "",
  phone: "",
  location: "",
  links: "",
  languages: [EMPTY_CV_LANGUAGE],
  primarySkills: "",
  secondarySkills: "",
  skillCategories: "",
  domains: "",
  aboutMe: "",
  techPrinciples: "",
  projects: [EMPTY_CV_PROJECT],
  education: [EMPTY_CV_EDUCATION],
};
