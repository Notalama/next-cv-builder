import cvPreset from "@/app/assets/cv-preset.json";
import type { CvFormValues } from "@/models/cv";
import { cvFormSchema } from "@/models/cv";

/** Sample CV content used as input placeholders and Tab-to-fill defaults. */
export const cvTemplate: CvFormValues = cvFormSchema.parse({
  ...cvPreset,
  photo: "",
});
