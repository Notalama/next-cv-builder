"use client";

import { User } from "lucide-react";
import { PhotoFormField } from "@/app/cv-builder/_components/form/photo-form-field";
import { FormSectionHeader } from "@/app/cv-builder/_components/form/section-header";
import { useTemplateFields } from "@/app/cv-builder/_components/form/template-fields-context";
import { TextFormField } from "@/app/cv-builder/_components/form/text-form-field";
import { Card, CardContent } from "@/components/ui/card";
import type { CvTextFieldConfig } from "@/models/cv-builder";

const CONTACT_FORM_FIELDS: readonly CvTextFieldConfig[] = [
  {
    name: "fullName",
    label: "Full Name",
    placeholder: "John Doe",
  },
  {
    name: "role",
    label: "Professional Role",
    placeholder: "Lead Front-End Engineer",
  },
  {
    name: "email",
    label: "Email Address",
    placeholder: "john.doe@example.com",
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "+380...",
  },
  {
    name: "location",
    label: "Location",
    placeholder: "Lviv, Ukraine",
  },
  {
    name: "links",
    label: "Professional Links (Optional)",
    placeholder: "GitHub / LinkedIn / Portfolio",
  },
];

const CONTACT_FIELD_NAMES = [
  ...CONTACT_FORM_FIELDS.map((field) => field.name),
  "photo",
] as const;

export function ContactSection() {
  const { isConsumed } = useTemplateFields();

  if (!CONTACT_FIELD_NAMES.some((name) => isConsumed(name))) {
    return null;
  }

  return (
    <Card className="border border-muted bg-card/50 shadow-sm">
      <FormSectionHeader
        icon={User}
        title="Contact & Identity"
        description="Your essential professional headers"
      />
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONTACT_FORM_FIELDS.map((field) => (
          <TextFormField
            key={field.name}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
          />
        ))}
        <PhotoFormField />
      </CardContent>
    </Card>
  );
}
