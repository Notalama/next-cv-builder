import { cvTemplate } from "./cv-template";

function getValueAtPath(obj: unknown, path: string): unknown {
  let current: unknown = obj;
  for (const segment of path.split(".")) {
    if (current == null || typeof current !== "object") return undefined;
    const key = /^\d+$/.test(segment) ? Number(segment) : segment;
    current = (current as Record<string | number, unknown>)[key];
  }
  return current;
}

export function getTemplateFieldValue(path: string): string | undefined {
  const value = getValueAtPath(cvTemplate, path);
  return typeof value === "string" ? value : undefined;
}

export function getTemplatePlaceholder(path: string): string {
  return getTemplateFieldValue(path) ?? "";
}

export function isFieldEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  return false;
}

export function splitCommaList(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
