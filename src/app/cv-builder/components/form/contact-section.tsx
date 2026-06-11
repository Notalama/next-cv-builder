import { User } from "lucide-react";
import { PhotoFormField } from "@/app/cv-builder/components/form/photo-form-field";
import { FormSectionHeader } from "@/app/cv-builder/components/form/section-header";
import { TextFormField } from "@/app/cv-builder/components/form/text-form-field";
import type { CvFormValues } from "@/app/cv-builder/schema";
import { Card, CardContent } from "@/components/ui/card";

const ContactFormFields: {
  name: keyof CvFormValues;
  label: string;
  placeholder: string;
}[] = [
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
] as const;

export function ContactSection() {
  return (
    <Card className="border border-muted bg-card/50 shadow-sm">
      <FormSectionHeader
        icon={User}
        title="Contact & Identity"
        description="Your essential professional headers"
      />
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ContactFormFields.map((field) => (
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
