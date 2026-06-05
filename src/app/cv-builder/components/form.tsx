"use client";

import {
  Briefcase,
  Code,
  Globe,
  Languages,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { type FieldPath, useFieldArray, useFormContext } from "react-hook-form";
import { CvBuilderToolbar } from "@/app/cv-builder/components/toolbar";
import { useApplyPlaceholderOnTabKey } from "@/app/cv-builder/hooks/tab-listener";
import { type CvFormValues, cvFormSchema } from "@/app/cv-builder/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type CvBuilderFormProps = {
  isPreviewOnly: boolean;
  onTogglePreviewOnly: () => void;
  onExportPdf: () => void;
};

export default function CvBuilderForm({
  isPreviewOnly,
  onTogglePreviewOnly,
  onExportPdf,
}: CvBuilderFormProps) {
  const [focusedField, setFocusedField] =
    useState<FieldPath<CvFormValues> | null>(null);
  const [savedFormPayload, setSavedFormPayload] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useFormContext<CvFormValues>();

  useApplyPlaceholderOnTabKey({
    fieldName: focusedField,
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control: control,
    name: "languages",
  });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control: control,
    name: "projects",
  });

  const onSubmit = (data: CvFormValues) => {
    console.log("Submitted CV Data:", data);
  };

  const applySavedResults = () => {
    setImportError(null);

    try {
      const parsed = JSON.parse(savedFormPayload);
      const result = cvFormSchema.safeParse(parsed);

      if (!result.success) {
        setImportError(
          "Invalid object format. Please paste a valid saved form JSON object.",
        );
        return;
      }

      reset(result.data);
    } catch {
      setImportError("Invalid JSON. Please paste a valid JSON object.");
    }
  };

  const handlePhotoUpload = (
    file: File | undefined,
    onChange: (value: string) => void,
  ) => {
    if (!file) {
      onChange("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () =>
      onChange(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            CV Blueprint Creator
          </h1>
          <p className="text-muted-foreground text-sm">
            Fill out your professional profiles, skills, and project experience
            below.
          </p>
        </div>
        <CvBuilderToolbar
          isPreviewOnly={isPreviewOnly}
          onTogglePreviewOnly={onTogglePreviewOnly}
          onExportPdf={onExportPdf}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* SECTION 1: Personal & Contact Info */}
        <Card className="border border-muted bg-card/50 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <User size={20} />
            </div>
            <div>
              <CardTitle className="text-xl">Contact & Identity</CardTitle>
              <CardDescription>
                Your essential professional headers
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      onFocusCapture={() => setFocusedField("fullName")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Role</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Lead Front-End Engineer"
                      {...field}
                      onFocusCapture={() => setFocusedField("role")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                      onFocusCapture={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+380..."
                      {...field}
                      onFocusCapture={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Lviv, Ukraine"
                      {...field}
                      onFocusCapture={() => setFocusedField("location")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="links"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Links (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="GitHub / LinkedIn / Portfolio"
                      {...field}
                      onFocusCapture={() => setFocusedField("links")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      onChange={(event) =>
                        handlePhotoUpload(
                          event.target.files?.[0],
                          field.onChange,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* SECTION 2: Profile & Engineering Principles */}
        <Card className="border border-muted bg-card/50 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Globe size={20} />
            </div>
            <div>
              <CardTitle className="text-xl">Professional Overview</CardTitle>
              <CardDescription>
                Describe your background and core philosophies
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={control}
              name="aboutMe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Me / Experience Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief overview of your architectural history, years of experience, and general background..."
                      className="min-h-[100px]"
                      {...field}
                      onFocusCapture={() => setFocusedField("aboutMe")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="techPrinciples"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Principles</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Clean Architecture, Type Safety, Performance-first rendering, Scalable Monorepos..."
                      className="min-h-[80px]"
                      onFocusCapture={() => setFocusedField("techPrinciples")}
                      {...field}
                      onBlur={() => setFocusedField(null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* SECTION 3: Skills, Languages & Domains */}
        <Card className="border border-muted bg-card/50 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Code size={20} />
            </div>
            <div>
              <CardTitle className="text-xl">Skills & Competencies</CardTitle>
              <CardDescription>
                Core execution stacks, language tracks, and industry knowledge
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={control}
                name="primarySkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Skills</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="React, TypeScript, Next.js, Tailwind CSS (Comma separated)"
                        {...field}
                        onFocusCapture={() => setFocusedField("primarySkills")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="secondarySkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Skills</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Node.js, Docker, Webpack, AWS basics (Comma separated)"
                        {...field}
                        onFocusCapture={() =>
                          setFocusedField("secondarySkills")
                        }
                        onBlur={() => setFocusedField(null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="domains"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domains of Experience</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E-commerce, FinTech, Automotive Simulation, EdTech (Comma separated)"
                        {...field}
                        onFocusCapture={() => setFocusedField("domains")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4 bg-muted" />

            {/* Dynamic Languages Subform */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium flex items-center gap-2">
                  <Languages size={16} /> Languages & Fluency
                </FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendLanguage({ name: "", level: "" })}
                  className="h-8 px-2 text-xs"
                >
                  <Plus size={14} className="mr-1" /> Add Language
                </Button>
              </div>

              <div className="space-y-2">
                {languageFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-end gap-3 bg-muted/30 p-2 rounded-md border border-muted/50"
                  >
                    <div className="grid grid-cols-2 gap-2 flex-1">
                      <FormField
                        control={control}
                        name={`languages.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormControl>
                              <Input
                                placeholder="e.g., English"
                                className="h-9"
                                {...field}
                                onFocusCapture={() =>
                                  setFocusedField(`languages.${index}.name`)
                                }
                                onBlur={() => setFocusedField(null)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`languages.${index}.level`}
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormControl>
                              <Input
                                placeholder="e.g., C1 / Fluent"
                                className="h-9"
                                {...field}
                                onFocusCapture={() =>
                                  setFocusedField(`languages.${index}.level`)
                                }
                                onBlur={() => setFocusedField(null)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {languageFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLanguage(index)}
                        className="text-destructive hover:bg-destructive/10 h-9 w-9"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4: Dynamic Project Logs (Unlimited) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Briefcase size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Project History
                </h2>
                <p className="text-xs text-muted-foreground">
                  Append as many professional projects as needed
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                appendProject({
                  companyName: "",
                  period: "",
                  position: "",
                  description: "",
                  technologies: "",
                  domain: "",
                })
              }
              className="gap-1 shadow-sm"
            >
              <Plus size={16} /> Add Project Card
            </Button>
          </div>

          <div className="space-y-4">
            {projectFields.map((field, index) => (
              <Card
                key={field.id}
                className="relative border-l-4 border-l-primary bg-card shadow-sm transition-all"
              >
                {projectFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProject(index)}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-primary">
                    Project #{index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1 space-y-4">
                    <FormField
                      control={control}
                      name={`projects.${index}.companyName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="GlobalLogic, Google, etc."
                              {...field}
                              onFocusCapture={() =>
                                setFocusedField(`projects.${index}.companyName`)
                              }
                              onBlur={() => setFocusedField(null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`projects.${index}.period`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Period of Work</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Jan 2025 - Present"
                              {...field}
                              onFocusCapture={() =>
                                setFocusedField(`projects.${index}.period`)
                              }
                              onBlur={() => setFocusedField(null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`projects.${index}.position`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position on the project</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Front-End Engineer"
                              {...field}
                              onFocusCapture={() =>
                                setFocusedField(`projects.${index}.position`)
                              }
                              onBlur={() => setFocusedField(null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <FormField
                      control={control}
                      name={`projects.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description & Your Role</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Detail what the system does and explicitly what your responsibilities and contributions were..."
                              className="min-h-[110px] resize-y"
                              {...field}
                              onFocusCapture={() =>
                                setFocusedField(`projects.${index}.description`)
                              }
                              onBlur={() => setFocusedField(null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`projects.${index}.technologies`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Key Technologies Used</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="React 19, TypeScript, Nx Monorepo, Tailwind CSS (Comma separated)"
                              {...field}
                              onFocusCapture={() =>
                                setFocusedField(
                                  `projects.${index}.technologies`,
                                )
                              }
                              onBlur={() => setFocusedField(null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="border border-muted bg-card/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Import Saved Form Data</CardTitle>
            <CardDescription>
              Paste a previously saved CV object (JSON) and apply it to all
              fields.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={savedFormPayload}
              onChange={(event) => setSavedFormPayload(event.target.value)}
              className="min-h-[140px] font-mono text-xs"
              placeholder='{"fullName":"John Doe","position":"Lead Front-End Engineer", "...":"..."}'
            />
            {importError ? (
              <p className="text-sm text-destructive">{importError}</p>
            ) : null}
            <Button type="button" variant="outline" onClick={applySavedResults}>
              Apply Saved Results
            </Button>
          </CardContent>
        </Card>

        {/* Action Submission Zone */}
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto font-medium px-8 shadow-md"
          >
            Save and Compile Data
          </Button>
        </div>
      </form>
    </div>
  );
}
