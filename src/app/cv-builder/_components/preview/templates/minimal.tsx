import {
  boldKeywords,
  collectSkillKeywords,
} from "@/app/cv-builder/_components/preview/bold-keywords";
import { splitCommaList } from "@/app/cv-builder/_template";
import type {
  CvEducation,
  CvFormValues,
  CvLanguage,
  CvProject,
} from "@/models/cv";
import type { CvPreviewTemplateProps } from "@/models/cv-builder";

function parseColonLine(line: string) {
  const colonIndex = line.indexOf(": ");
  const hasTitle = colonIndex > 0;

  return {
    title: hasTitle ? line.slice(0, colonIndex) : line,
    description: hasTitle ? line.slice(colonIndex + 2) : "",
  };
}

function parseContactLinks(links: string | undefined) {
  const parts = (links ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  let github = "";
  let linkedIn = "";

  for (const part of parts) {
    const lower = part.toLowerCase();
    if (lower.includes("github") && !github) github = part;
    else if (lower.includes("linkedin") && !linkedIn) linkedIn = part;
  }

  if (!github && parts[0]) github = parts[0];
  if (!linkedIn && parts[1]) linkedIn = parts[1];

  return { github, linkedIn };
}

function formatLinkDisplay(url: string) {
  return url
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

function collectKeywords(data: CvFormValues) {
  const fromSkills = collectSkillKeywords(
    data.primarySkills,
    data.secondarySkills,
  );
  const fromProjects = data.projects.flatMap((project) =>
    splitCommaList(project.technologies),
  );
  return [...new Set([...fromSkills, ...fromProjects])]
    .filter((keyword) => keyword.length > 1)
    .sort((a, b) => b.length - a.length);
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="h-px flex-1 bg-black" />
      <h2 className="shrink-0 text-[11pt] font-normal uppercase tracking-[0.25em] text-black">
        {title}
      </h2>
      <div className="h-px flex-1 bg-black" />
    </div>
  );
}

function descriptionBullets(description: string) {
  const lines = description
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 1) return lines;

  const sentences = description
    .split(/(?<=\.)\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  return sentences.length > 1
    ? sentences
    : [description.trim()].filter(Boolean);
}

function groupConsecutiveProjects(projects: CvProject[]) {
  const groups: { companyName: string; projects: CvProject[] }[] = [];

  for (const project of projects) {
    const lastGroup = groups.at(-1);
    if (lastGroup?.companyName === project.companyName) {
      lastGroup.projects.push(project);
      continue;
    }

    groups.push({ companyName: project.companyName, projects: [project] });
  }

  return groups;
}

function WorkExperienceEntry({
  project,
  keywords,
  companyName,
}: {
  project: CvProject;
  keywords: string[];
  companyName?: string;
  location?: string;
}) {
  const bullets = descriptionBullets(project.description);

  return (
    <div className="break-inside-avoid mb-5 last:mb-0">
      {companyName && <p className="text-[10pt] text-black">{companyName}</p>}
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[10.5pt] font-semibold text-black">
          {project.position}
        </h3>
        <span className="shrink-0 text-[10pt] text-black">
          {project.period}
        </span>
      </div>
      {bullets.length > 0 && (
        <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[10pt] leading-snug text-black">
          {bullets.map((bullet, index) => (
            <li
              key={`${project.companyName}-${project.period}-bullet-${index}`}
            >
              {boldKeywords(bullet, keywords)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function WorkExperienceGroup({
  companyName,
  location,
  projects,
  keywords,
}: {
  companyName: string;
  location: string;
  projects: CvProject[];
  keywords: string[];
}) {
  return (
    <>
      {projects.map((project, index) => (
        <WorkExperienceEntry
          key={`${project.period}-${index}`}
          project={project}
          keywords={keywords}
          companyName={index === 0 ? companyName : undefined}
          location={index === 0 ? location : undefined}
        />
      ))}
    </>
  );
}

function EducationEntry({ entry }: { entry: CvEducation }) {
  return (
    <div className="break-inside-avoid mb-4 last:mb-0">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[10.5pt] font-semibold text-black">
          {entry.institution}
        </h3>
        <span className="shrink-0 text-[10pt] text-black">{entry.period}</span>
      </div>
      <p className="text-[10pt] text-black">{entry.degree}</p>
    </div>
  );
}

function SkillsList({ skillCategories }: { skillCategories?: string }) {
  const categories = (skillCategories ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({ line, ...parseColonLine(line) }));

  if (categories.length === 0) return null;

  return (
    <ul className="space-y-1 text-[10pt] leading-snug text-black">
      {categories.map(({ line, title, description }) => (
        <li key={line}>
          {description ? (
            <>
              <strong className="font-semibold">{title}:</strong> {description}
            </>
          ) : (
            title
          )}
        </li>
      ))}
    </ul>
  );
}

function LanguagesList({ languages }: { languages: CvLanguage[] }) {
  const filledLanguages = languages.filter(
    (language) => language.name.trim() && language.level.trim(),
  );

  if (filledLanguages.length === 0) return null;

  return (
    <ul className="space-y-1 text-[10pt] leading-snug text-black">
      {filledLanguages.map((language, index) => (
        <li key={`${language.name}-${index}`}>
          {language.name} – {language.level}
        </li>
      ))}
    </ul>
  );
}

export function MinimalTemplate({ data }: CvPreviewTemplateProps) {
  const { github, linkedIn } = parseContactLinks(data.links);
  const keywords = collectKeywords(data);
  const contactParts = [
    data.phone,
    data.email,
    linkedIn ? formatLinkDisplay(linkedIn) : "",
    github ? formatLinkDisplay(github) : "",
    data.location,
  ].filter(Boolean);

  return (
    <div className="cv-preview-root mx-auto my-4 w-full max-w-[800px] bg-white px-12 py-10 text-black shadow-sm antialiased print:my-0 print:mx-0 print:max-w-none print:px-10 print:py-8 print:shadow-none font-sans">
      <header className="mb-6 text-center">
        <h1 className="text-[22pt] font-bold uppercase leading-tight tracking-wide text-black">
          {data.fullName}
        </h1>
        {data.role && (
          <p className="mt-1 text-[12pt] font-normal uppercase tracking-wide text-black">
            {data.role}
          </p>
        )}
        {contactParts.length > 0 && (
          <p className="mt-2 text-[9.5pt] leading-relaxed text-black">
            {contactParts.join(" | ")}
          </p>
        )}
      </header>

      {data.aboutMe && (
        <section>
          <SectionHeading title="Summary" />
          <p className="text-[10pt] leading-relaxed text-black">
            {boldKeywords(data.aboutMe, keywords)}
          </p>
        </section>
      )}

      {data.skillCategories && (
        <section>
          <SectionHeading title="Skills" />
          <SkillsList skillCategories={data.skillCategories} />
        </section>
      )}

      {data.projects.length > 0 && (
        <section>
          <SectionHeading title="Work Experience" />
          <div>
            {groupConsecutiveProjects(data.projects).map((group, index) => (
              <WorkExperienceGroup
                key={`${group.companyName}-${index}`}
                companyName={group.companyName}
                location={data.location}
                projects={group.projects}
                keywords={keywords}
              />
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section>
          <SectionHeading title="Education" />
          <div>
            {data.education.map((entry, index) => (
              <EducationEntry
                key={`${entry.institution}-${entry.period}-${index}`}
                entry={entry}
              />
            ))}
          </div>
        </section>
      )}

      {data.languages.length > 0 && (
        <section>
          <SectionHeading title="Languages" />
          <LanguagesList languages={data.languages} />
        </section>
      )}
    </div>
  );
}
