import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import cvPreset from "@/app/assets/cv-preset.json";
import type { CvFormValues } from "@/models/cv";

const { getCvPresetValuesMock } = vi.hoisted(() => ({
  getCvPresetValuesMock: vi.fn(),
}));

vi.mock("@/app/cv-builder/_components/form", () => ({
  default: ({
    onTogglePreviewOnly,
    onApplyPreset,
    cvId,
  }: {
    onTogglePreviewOnly: () => void;
    onApplyPreset: () => void;
    cvId?: string;
  }) => (
    <div>
      <span data-testid="form-cv-id">{cvId ?? "none"}</span>
      <button type="button" onClick={onTogglePreviewOnly}>
        Preview only
      </button>
      <button type="button" onClick={onApplyPreset}>
        Apply preset
      </button>
    </div>
  ),
}));

vi.mock("@/app/cv-builder/_components/toolbar", () => ({
  CvBuilderToolbar: ({
    onTogglePreviewOnly,
  }: {
    onTogglePreviewOnly: () => void;
  }) => (
    <button type="button" onClick={onTogglePreviewOnly}>
      Show form
    </button>
  ),
}));

vi.mock("@/app/cv-builder/_components/preview/templates", () => ({
  DEFAULT_CV_PREVIEW_TEMPLATE_ID: "classic",
  CV_PREVIEW_TEMPLATES: {
    classic: {
      id: "classic",
      label: "Classic",
      Component: ({ data }: { data: CvFormValues }) => (
        <div data-testid="cv-preview">{data.fullName || "empty"}</div>
      ),
    },
  },
}));

vi.mock("@/app/cv-builder/_utils/apply-saved-results", () => ({
  getCvPresetValues: getCvPresetValuesMock,
}));

vi.mock("@/app/cv-builder/_utils/export-pdf", () => ({
  exportCvPreviewPdf: vi.fn(),
}));

import { CvBuilder } from "./cv-builder";

describe("CvBuilder", () => {
  beforeEach(() => {
    getCvPresetValuesMock.mockReset();
    getCvPresetValuesMock.mockReturnValue(cvPreset as CvFormValues);
  });

  it("renders form and preview with preset values for new CVs", () => {
    render(<CvBuilder />);

    expect(screen.getByRole("button", { name: "Preview only" })).toBeVisible();
    expect(screen.getByTestId("cv-preview")).toHaveTextContent("Borys Koblents");
    expect(screen.queryByRole("button", { name: "Show form" })).toBeNull();
  });

  it("passes cvId to the form", () => {
    render(<CvBuilder cvId="cv-123" />);

    expect(screen.getByTestId("form-cv-id")).toHaveTextContent("cv-123");
  });

  it("hydrates preview from initialData", () => {
    render(
      <CvBuilder
        initialData={{ ...(cvPreset as CvFormValues), fullName: "Ada Lovelace" }}
      />,
    );

    expect(screen.getByTestId("cv-preview")).toHaveTextContent("Ada Lovelace");
  });

  it("hides the form in preview-only mode and can restore it", async () => {
    const user = userEvent.setup();
    render(<CvBuilder />);

    await user.click(screen.getByRole("button", { name: "Preview only" }));

    expect(screen.queryByRole("button", { name: "Preview only" })).toBeNull();
    expect(screen.getByRole("button", { name: "Show form" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Show form" }));

    expect(screen.getByRole("button", { name: "Preview only" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Show form" })).toBeNull();
  });

  it("applies preset data to the preview", async () => {
    const user = userEvent.setup();
    getCvPresetValuesMock.mockReturnValue({
      ...(cvPreset as CvFormValues),
      fullName: "Preset User",
    });

    render(<CvBuilder />);

    await user.click(screen.getByRole("button", { name: "Apply preset" }));

    expect(getCvPresetValuesMock).toHaveBeenCalled();
    expect(screen.getByTestId("cv-preview")).toHaveTextContent("Preset User");
  });
});
