export function ContactLink({ label, url }: { label: string; url: string }) {
  const trimmedUrl = url.trim();
  const segments = trimmedUrl.replace(/\/+$/, "").split("/");
  const displayName = segments[segments.length - 1] || trimmedUrl;
  const href = /^https?:\/\//i.test(trimmedUrl)
    ? trimmedUrl
    : `https://${trimmedUrl}`;

  return (
    <p className="flex gap-1">
      <strong className="text-slate-800 shrink-0">{label}:</strong>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="line-clamp-2 min-w-0 break-all underline-offset-2 hover:underline"
      >
        {displayName}
      </a>
    </p>
  );
}
