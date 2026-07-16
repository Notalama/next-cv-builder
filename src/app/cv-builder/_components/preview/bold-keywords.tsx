import type { ReactNode } from "react";
import { splitCommaList } from "@/app/cv-builder/_template";

export function collectSkillKeywords(
  primarySkills: string,
  secondarySkills?: string,
) {
  return [
    ...new Set([
      ...splitCommaList(primarySkills),
      ...splitCommaList(secondarySkills),
    ]),
  ]
    .filter((keyword) => keyword.length > 1)
    .sort((a, b) => b.length - a.length);
}

export function boldKeywords(text: string, keywords: string[]): ReactNode {
  if (!text || keywords.length === 0) return text;

  const escaped = keywords.map((keyword) =>
    keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const pattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
  const matches = [...text.matchAll(pattern)];

  if (matches.length === 0) return text;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const [index, match] of matches.entries()) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) {
      nodes.push(text.slice(lastIndex, matchIndex));
    }
    nodes.push(
      <strong key={`kw-${index}`} className="font-semibold">
        {match[0]}
      </strong>,
    );
    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
