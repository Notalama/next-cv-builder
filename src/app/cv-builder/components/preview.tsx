import type { CvFormValues } from '../schema';
import { splitCommaList } from '../template';

export default function CvBuilderPreview({ data }: { data: CvFormValues }) {
  const [github, linkedIn] = (data.links ?? '').split(',');

  return (
    <div className="cv-preview-root w-full max-w-5xl mx-auto my-4 bg-white p-6 md:p-8 shadow-sm print:shadow-none print:my-0 print:p-0 text-slate-800 antialiased font-sans">

      <div className="flex flex-col md:flex-row gap-8 print:flex-row print:gap-8">

        <div className="w-full md:w-1/4 print:w-1/4 bg-slate-50 p-4 rounded-xl border border-slate-100 print:bg-slate-50 print:border-slate-200 shrink-0">

          <div className="mb-5 flex justify-start">
            {data.photo ? (
              <img
                src={data.photo}
                alt={`${data.fullName} portrait`}
                className="h-30 w-30 rounded-full border-2 border-slate-500 bg-slate-100 object-cover p-0.5"
              />
            ) : (
              <svg className="w-20 h-20 rounded-full border-2 border-slate-500 bg-slate-100 p-0.5" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" fill="#e2e8f0"/>
                <circle cx="50" cy="40" r="18" fill="#475569"/>
                <path d="M22 80 C22 62, 32 55, 50 55 C68 55, 78 62, 78 80 Z" fill="#475569"/>
              </svg>
            )}
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">{data.fullName}</h1>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-1">{data.role}</p>
          </div>

          <div className="mb-6 break-inside-avoid">
            <div className="border-l-2 border-slate-500 pl-2 mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Contact Info</h2>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5">
              <p><strong className="text-slate-800">Email:</strong> {data.email}</p>
              <p><strong className="text-slate-800">Phone:</strong> {data.phone}</p>
              <p><strong className="text-slate-800">Location:</strong> {data.location}</p>
              {github?.trim() && (
                <p><strong className="text-slate-800">GitHub:</strong> {github.trim()}</p>
              )}
              {linkedIn?.trim() && (
                <p><strong className="text-slate-800">LinkedIn:</strong> {linkedIn.trim()}</p>
              )}
            </div>
          </div>

          <div className="mb-6 break-inside-avoid">
            <div className="border-l-2 border-slate-500 pl-2 mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Languages</h2>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5">
              {data.languages.map((language, index) => (
                <div className="flex justify-between" key={`${language.name}-${index}`}>
                  <span className="font-medium text-slate-800">{language.name}</span>
                  <span className="text-slate-500">{language.level}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 break-inside-avoid">
            <div className="border-l-2 border-slate-500 pl-2 mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Primary Skills</h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {splitCommaList(data.primarySkills).map((skill) => (
                <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300 rounded" key={skill}>{skill}</span>
              ))}
            </div>
          </div>

          <div className="mb-6 break-inside-avoid">
            <div className="border-l-2 border-slate-500 pl-2 mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Secondary Skills</h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {splitCommaList(data.secondarySkills).map((skill) => (
                <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded" key={skill}>{skill}</span>
              ))}
            </div>
          </div>

          <div className="mb-4 break-inside-avoid">
            <div className="border-l-2 border-slate-500 pl-2 mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Domains</h2>
            </div>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              {splitCommaList(data.domains).map((domain) => (
                <li key={domain}>{domain}</li>
              ))}
            </ul>
          </div>

        </div>

        <div className="w-full md:w-3/4 print:w-3/4 space-y-6">

          <div className="break-inside-avoid">
            <div className="border-b-2 border-slate-200 pb-1 mb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">About Me & Experience Summary</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {data.aboutMe}
            </p>
          </div>

          <div className="break-inside-avoid">
            <div className="border-b-2 border-slate-200 pb-1 mb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Core Technical Principles</h2>
            </div>
            <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside pl-1">
              {data.techPrinciples.split('\n').filter(Boolean).map((line) => {
                const colonIndex = line.indexOf(': ');
                const hasTitle = colonIndex > 0;
                const title = hasTitle ? line.slice(0, colonIndex) : line;
                const description = hasTitle ? line.slice(colonIndex + 2) : '';

                return (
                  <li key={line}>
                    {description ? (
                      <>
                        <strong className="text-slate-900">{title}:</strong> {description}
                      </>
                    ) : (
                      line
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <div className="border-b-2 border-slate-200 pb-1 mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Selected Project Records</h2>
            </div>

            <div className="space-y-8">
              {data.projects.map((project, index) => (
                <div
                  className="border-l-2 border-slate-300 pl-4 break-inside-avoid"
                  key={`${project.companyName}-${project.period}-${index}`}
                >
                  <div className="flex justify-between items-start flex-wrap gap-1 mb-1">
                    <h3 className="text-sm font-bold text-slate-900">{project.companyName}</h3>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded print:p-0 print:bg-transparent">
                      {project.period}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1.5">
                    <strong className="font-semibold text-slate-700">Position:</strong> {project.position}
                  </p>
                  <p className="text-sm text-slate-700 leading-normal mb-2">
                    <strong className="font-semibold text-slate-800">Description & My Role:</strong> {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {splitCommaList(project.technologies).map((tech) => (
                      <span
                        className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 rounded"
                        key={tech}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
