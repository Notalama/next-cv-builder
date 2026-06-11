import { PreviewSectionHeading } from "@/app/cv-builder/components/preview/section-heading";

export type TechPrinciplesProps = {
  techPrinciples: string;
};

type PrincipleLine = {
  line: string;
  title: string;
  description: string;
};

function parsePrincipleLine(line: string): PrincipleLine {
  const colonIndex = line.indexOf(": ");
  const hasTitle = colonIndex > 0;

  return {
    line,
    title: hasTitle ? line.slice(0, colonIndex) : line,
    description: hasTitle ? line.slice(colonIndex + 2) : "",
  };
}

export function TechPrinciples({ techPrinciples }: TechPrinciplesProps) {
  const principles = techPrinciples
    .split("\n")
    .filter(Boolean)
    .map(parsePrincipleLine);

  return (
    <div className="break-inside-avoid">
      <PreviewSectionHeading title="Core Technical Principles" variant="main" />
      <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside pl-1">
        {principles.map(({ line, title, description }) => (
          <li key={line}>
            {description ? (
              <>
                <strong className="text-slate-900">{title}:</strong>{" "}
                {description}
              </>
            ) : (
              line
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
