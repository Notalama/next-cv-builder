export function isMp4File(file: { type: string; name: string }): boolean {
  return file.type === "video/mp4" || file.name.toLowerCase().endsWith(".mp4");
}

export function padFrameIndex(index: number, total: number): string {
  const digits = Math.max(4, String(total).length);
  return String(index).padStart(digits, "0");
}

export function videoFrameFileName(index: number, total: number): string {
  return `frame-${padFrameIndex(index, total)}.png`;
}
