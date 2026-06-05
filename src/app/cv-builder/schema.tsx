import z from "zod";

const projectSchema = z.object({
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
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  location: z.string().min(2, "Location is required"),
  links: z.string().optional(),

  // Left column lists
  languages: z.array(
    z.object({
      name: z.string().min(1, "Language name required"),
      level: z.string().min(1, "Proficiency level required"),
    }),
  ),
  primarySkills: z
    .string()
    .min(2, "Enter at least a few core skills (comma separated)"),
  secondarySkills: z.string().optional(),
  domains: z
    .string()
    .min(2, "Enter domains you have worked in (comma separated)"),

  // Right column summary
  aboutMe: z.string().min(10, "Profile summary must be longer"),
  techPrinciples: z
    .string()
    .min(10, "Please list some of your core engineering principles"),

  // Projects array
  projects: z.array(projectSchema),
});

export type CvFormValues = z.infer<typeof cvFormSchema>;
