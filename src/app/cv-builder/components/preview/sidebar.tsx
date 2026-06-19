import { BadgeList } from "@/app/cv-builder/components/preview/badge-list";
import { ContactLink } from "@/app/cv-builder/components/preview/contact-link";
import { PreviewSectionHeading } from "@/app/cv-builder/components/preview/section-heading";
import type { CvFormValues } from "@/app/cv-builder/schema";
import { splitCommaList } from "@/app/cv-builder/template";

export type PreviewSidebarProps = {
  data: CvFormValues;
};

function PhotoBlock({ photo, fullName }: { photo?: string; fullName: string }) {
  return (
    <div className="mb-5 flex justify-start">
      {photo ? (
        // biome-ignore lint/performance/noImgElement: Its an necessary avatar image
        <img
          src={photo}
          alt={`${fullName} portrait`}
          className="h-30 w-30 rounded-full border-2 border-slate-500 bg-slate-100 object-cover p-0.5"
        />
      ) : (
        <svg
          className="w-20 h-20 rounded-full border-2 border-slate-500 bg-slate-100 p-0.5"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Portrait placeholder</title>
          <circle cx="50" cy="50" r="50" fill="#e2e8f0" />
          <circle cx="50" cy="40" r="18" fill="#475569" />
          <path
            d="M22 80 C22 62, 32 55, 50 55 C68 55, 78 62, 78 80 Z"
            fill="#475569"
          />
        </svg>
      )}
    </div>
  );
}

export function PreviewSidebar({ data }: PreviewSidebarProps) {
  const [github, linkedIn] = (data.links ?? "").split(",");

  return (
    <div className="w-full md:w-1/4 print:w-1/4 bg-slate-50 rounded-xl border border-slate-100 print:bg-slate-50 print:border-slate-200 shrink-0">
      <PhotoBlock photo={data.photo} fullName={data.fullName} />

      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
          {data.fullName}
        </h1>
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-1">
          {data.role}
        </p>
      </div>

      <div className="mb-6 break-inside-avoid">
        <PreviewSectionHeading title="Contact Info" variant="sidebar" />
        <div className="text-xs text-slate-600 space-y-1.5">
          <p>
            <strong className="text-slate-800">Email:</strong> {data.email}
          </p>
          <p>
            <strong className="text-slate-800">Phone:</strong> {data.phone}
          </p>
          <p>
            <strong className="text-slate-800">Location:</strong>{" "}
            {data.location}
          </p>
          {github?.trim() && <ContactLink label="GitHub" url={github} />}
          {linkedIn?.trim() && <ContactLink label="LinkedIn" url={linkedIn} />}
        </div>
      </div>

      <div className="mb-6 break-inside-avoid">
        <PreviewSectionHeading title="Languages" variant="sidebar" />
        <div className="text-xs text-slate-600 space-y-1.5">
          {data.languages.map((language, index) => (
            <div
              className="flex justify-between"
              key={`${language.name}-${index}`}
            >
              <span className="font-medium text-slate-800">
                {language.name}
              </span>
              <span className="text-slate-500">{language.level}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 break-inside-avoid">
        <PreviewSectionHeading title="Primary Skills" variant="sidebar" />
        <BadgeList
          items={splitCommaList(data.primarySkills)}
          badgeClassName="border border-slate-300"
        />
      </div>

      <div className="mb-6 break-inside-avoid">
        <PreviewSectionHeading title="Secondary Skills" variant="sidebar" />
        <BadgeList items={splitCommaList(data.secondarySkills)} />
      </div>

      <div className="mb-4 break-inside-avoid">
        <PreviewSectionHeading title="Domains" variant="sidebar" />
        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
          {splitCommaList(data.domains).map((domain) => (
            <li key={domain}>{domain}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
