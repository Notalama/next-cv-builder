import { describe, expect, it } from "vitest";
import { CV_FORM_DEFAULT_VALUES } from "@/models/cv";
import { CV_PREVIEW_TEMPLATE_IDS } from "@/models/cv-builder";
import {
  CV_FORM_FIELD_NAMES,
  fieldsForTemplate,
  schemaForTemplate,
} from "@/models/cv-template-fields";

describe("cv-template-fields", () => {
  it("exposes a field list for every preview template", () => {
    for (const templateId of CV_PREVIEW_TEMPLATE_IDS) {
      expect(fieldsForTemplate(templateId).length).toBeGreaterThan(0);
    }
  });

  it("keeps domain optional so empty projects can validate at the project level", () => {
    const schema = schemaForTemplate("minimal");
    const result = schema.safeParse({
      ...CV_FORM_DEFAULT_VALUES,
      fullName: "Ada Lovelace",
      role: "Engineer",
      email: "ada@example.com",
      phone: "+12345",
      location: "London",
      primarySkills: "Math",
      aboutMe: "A longer profile summary for Ada.",
      projects: [
        {
          companyName: "Analytical Engine",
          period: "1842 - 1843",
          position: "Mathematician",
          description: "Wrote notes that were longer than the paper itself.",
          technologies: "Punch cards",
          domain: "",
        },
      ],
      education: [
        {
          institution: "Self-taught",
          period: "1830 - 1840",
          degree: "Mathematics",
        },
      ],
      languages: [{ name: "English", level: "Native" }],
    });

    expect(result.success).toBe(true);
  });

  it("does not require techPrinciples under the Minimal schema", () => {
    const schema = schemaForTemplate("minimal");
    const result = schema.safeParse({
      ...CV_FORM_DEFAULT_VALUES,
      fullName: "Ada Lovelace",
      role: "Engineer",
      email: "ada@example.com",
      phone: "+12345",
      location: "London",
      primarySkills: "Math",
      aboutMe: "A longer profile summary for Ada.",
      techPrinciples: "",
      projects: [
        {
          companyName: "Analytical Engine",
          period: "1842 - 1843",
          position: "Mathematician",
          description: "Wrote notes that were longer than the paper itself.",
          technologies: "Punch cards",
          domain: "",
        },
      ],
      education: [
        {
          institution: "Self-taught",
          period: "1830 - 1840",
          degree: "Mathematics",
        },
      ],
      languages: [{ name: "English", level: "Native" }],
    });

    expect(result.success).toBe(true);
  });

  it("requires techPrinciples under the Classic schema", () => {
    const schema = schemaForTemplate("classic");
    const result = schema.safeParse({
      ...CV_FORM_DEFAULT_VALUES,
      fullName: "Ada Lovelace",
      role: "Engineer",
      email: "ada@example.com",
      phone: "+12345",
      location: "London",
      primarySkills: "Math",
      domains: "Science",
      aboutMe: "A longer profile summary for Ada.",
      techPrinciples: "",
      projects: [
        {
          companyName: "Analytical Engine",
          period: "1842 - 1843",
          position: "Mathematician",
          description: "Wrote notes that were longer than the paper itself.",
          technologies: "Punch cards",
          domain: "",
        },
      ],
      education: [
        {
          institution: "Self-taught",
          period: "1830 - 1840",
          degree: "Mathematics",
        },
      ],
      languages: [{ name: "English", level: "Native" }],
    });

    expect(result.success).toBe(false);
  });

  it("only includes known form field names in template manifests", () => {
    const known = new Set<string>(CV_FORM_FIELD_NAMES);

    for (const templateId of CV_PREVIEW_TEMPLATE_IDS) {
      for (const field of fieldsForTemplate(templateId)) {
        expect(known.has(field)).toBe(true);
      }
    }
  });
});
