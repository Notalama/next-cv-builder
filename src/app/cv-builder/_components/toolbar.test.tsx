import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CvBuilderControlsProps } from "@/models/cv-builder";
import "@/test/rtl-cleanup";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/app/cv-builder/_components/preview/templates", () => ({
  CV_PREVIEW_TEMPLATES: {
    classic: {
      id: "classic",
      label: "Classic Sidebar",
      Component: () => null,
    },
    minimal: {
      id: "minimal",
      label: "Minimal",
      Component: () => null,
    },
  },
}));

import { CvBuilderToolbar } from "./toolbar";

function renderToolbar(overrides: Partial<CvBuilderControlsProps> = {}) {
  const props: CvBuilderControlsProps = {
    isPreviewOnly: false,
    onTogglePreviewOnly: vi.fn(),
    onExportPdf: vi.fn(),
    onApplyPreset: vi.fn(),
    onClearForm: vi.fn(),
    templateId: "classic",
    onTemplateChange: vi.fn(),
    ...overrides,
  };

  return {
    user: userEvent.setup(),
    props,
    ...render(<CvBuilderToolbar {...props} />),
  };
}

describe("CvBuilderToolbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("links to the speed reader page", () => {
    renderToolbar();

    expect(screen.getByRole("link", { name: /speed reader/i })).toHaveAttribute(
      "href",
      "/cv-builder/speed-reader",
    );
  });

  it("shows the selected template label", () => {
    renderToolbar({ templateId: "minimal" });

    expect(screen.getByRole("button", { name: /minimal/i })).toBeVisible();
  });

  it("calls onTemplateChange when another template is selected", async () => {
    const { user, props } = renderToolbar({ templateId: "classic" });

    await user.click(screen.getByRole("button", { name: /classic sidebar/i }));

    const menu = await screen.findByRole("menu");
    await user.click(
      within(menu).getByRole("menuitemradio", { name: /minimal/i }),
    );

    expect(props.onTemplateChange).toHaveBeenCalledWith("minimal");
  });

  it("calls onApplyPreset when Apply preset is clicked", async () => {
    const { user, props } = renderToolbar();

    await user.click(screen.getByRole("button", { name: /apply preset/i }));

    expect(props.onApplyPreset).toHaveBeenCalledTimes(1);
  });

  it("calls onClearForm when Clear form is clicked", async () => {
    const { user, props } = renderToolbar();

    await user.click(screen.getByRole("button", { name: /clear form/i }));

    expect(props.onClearForm).toHaveBeenCalledTimes(1);
  });

  it("shows Preview only and hides Export PDF when form is visible", () => {
    renderToolbar({ isPreviewOnly: false });

    expect(screen.getByRole("button", { name: /preview only/i })).toBeVisible();
    expect(screen.queryByRole("button", { name: /export pdf/i })).toBeNull();
  });

  it("shows Show form and Export PDF in preview-only mode", () => {
    renderToolbar({ isPreviewOnly: true });

    expect(screen.getByRole("button", { name: /show form/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /export pdf/i })).toBeVisible();
  });

  it("calls onTogglePreviewOnly when Preview only is clicked", async () => {
    const { user, props } = renderToolbar({ isPreviewOnly: false });

    await user.click(screen.getByRole("button", { name: /preview only/i }));

    expect(props.onTogglePreviewOnly).toHaveBeenCalledTimes(1);
  });

  it("calls onTogglePreviewOnly when Show form is clicked", async () => {
    const { user, props } = renderToolbar({ isPreviewOnly: true });

    await user.click(screen.getByRole("button", { name: /show form/i }));

    expect(props.onTogglePreviewOnly).toHaveBeenCalledTimes(1);
  });

  it("calls onExportPdf when Export PDF is clicked", async () => {
    const { user, props } = renderToolbar({ isPreviewOnly: true });

    await user.click(screen.getByRole("button", { name: /export pdf/i }));

    expect(props.onExportPdf).toHaveBeenCalledTimes(1);
  });
});
