import { describe, expect, it } from "vitest";
import { blobToUint8Array, createZipBlob } from "@/lib/sprite/create-zip-blob";

function readUint32LE(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset] ?? 0) |
      ((bytes[offset + 1] ?? 0) << 8) |
      ((bytes[offset + 2] ?? 0) << 16) |
      ((bytes[offset + 3] ?? 0) << 24)) >>>
    0
  );
}

function readUint16LE(bytes: Uint8Array, offset: number): number {
  return (bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8);
}

describe("createZipBlob", () => {
  it("builds a store ZIP with expected signatures and entry names", async () => {
    const payload = new TextEncoder().encode("png-bytes");
    const zip = createZipBlob([
      { name: "frame-0001.png", data: payload },
      { name: "frame-0002.png", data: payload },
    ]);

    expect(zip.type).toBe("application/zip");
    const bytes = await blobToUint8Array(zip);

    expect(readUint32LE(bytes, 0)).toBe(0x04034b50);

    const firstNameLength = readUint16LE(bytes, 26);
    const firstName = new TextDecoder().decode(
      bytes.slice(30, 30 + firstNameLength),
    );
    expect(firstName).toBe("frame-0001.png");

    const endOffset = bytes.length - 22;
    expect(readUint32LE(bytes, endOffset)).toBe(0x06054b50);
    expect(readUint16LE(bytes, endOffset + 8)).toBe(2);
    expect(readUint16LE(bytes, endOffset + 10)).toBe(2);
  });

  it("supports an empty archive", async () => {
    const zip = createZipBlob([]);
    const bytes = await blobToUint8Array(zip);
    expect(readUint32LE(bytes, 0)).toBe(0x06054b50);
    expect(readUint16LE(bytes, 8)).toBe(0);
  });
});

describe("blobToUint8Array", () => {
  it("reads blob contents", async () => {
    const blob = new Blob([new Uint8Array([1, 2, 3])]);
    await expect(blobToUint8Array(blob)).resolves.toEqual(
      new Uint8Array([1, 2, 3]),
    );
  });
});
