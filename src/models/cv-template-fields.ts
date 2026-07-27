import { z } from "zod";
import templateFieldsManifest from "@/app/assets/cv-template-fields.json";
import { type CvFormValues, cvFormSchema } from "@/models/cv";
import {
  CV_PREVIEW_TEMPLATE_IDS,
  type CvPreviewTemplateId,
} from "@/models/cv-builder";

export const CV_FORM_FIELD_NAMES = [
  "fullName",
  "role",
  "photo",
  "email",
  "phone",
  "location",
  "links",
  "languages",
  "primarySkills",
  "secondarySkills",
  "skillCategories",
  "domains",
  "aboutMe",
  "techPrinciples",
  "projects",
  "education",
] as const satisfies readonly (keyof CvFormValues)[];

export type CvFormFieldName = (typeof CV_FORM_FIELD_NAMES)[number];

type MissingFields = Exclude<keyof CvFormValues, CvFormFieldName>;
const _exhaustive: MissingFields extends never ? true : never = true;
void _exhaustive;

const cvFormFieldNameSchema = z.enum(CV_FORM_FIELD_NAMES);
const templateFieldListSchema = z.array(cvFormFieldNameSchema).nonempty();

const templateFieldsManifestSchema = z
  .object({
    classic: templateFieldListSchema,
    minimal: templateFieldListSchema,
  } satisfies Record<CvPreviewTemplateId, typeof templateFieldListSchema>)
  .superRefine((manifest, ctx) => {
    for (const [id, fields] of Object.entries(manifest)) {
      if (new Set(fields).size !== fields.length) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate field entries for template "${id}"`,
        });
      }
    }
  });

const parsedManifest = templateFieldsManifestSchema.parse(
  templateFieldsManifest,
);

export function fieldsForTemplate(
  templateId: CvPreviewTemplateId,
): readonly CvFormFieldName[] {
  return parsedManifest[templateId];
}

export function schemaForTemplate(templateId: CvPreviewTemplateId) {
  const consumed = fieldsForTemplate(templateId);
  const shape = cvFormSchema.shape;

  return z.object(
    Object.fromEntries(consumed.map((name) => [name, shape[name]])),
  ) as unknown as typeof cvFormSchema;
}

export function resolveTemplateId(
  value: string | null | undefined,
): CvPreviewTemplateId {
  if (
    value != null &&
    (CV_PREVIEW_TEMPLATE_IDS as readonly string[]).includes(value)
  ) {
    return value as CvPreviewTemplateId;
  }

  return "minimal";
}

export function isTopLevelFormField(name: string): name is CvFormFieldName {
  return (CV_FORM_FIELD_NAMES as readonly string[]).includes(name);
}

export function topLevelFormField(name: string): CvFormFieldName | null {
  const root = name.split(".")[0] ?? name;
  return isTopLevelFormField(root) ? root : null;
}
