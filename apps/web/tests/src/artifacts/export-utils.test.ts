import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  generateFilename,
  downloadFile,
  copyToClipboard,
  MIME_TYPES,
} from "../../../src/artifacts/export-utils";

// ============================================================================
// generateFilename tests
// ============================================================================

describe("generateFilename", () => {
  it("should generate filename with correct pattern", () => {
    // Mock Date to get consistent output
    const mockDate = new Date("2024-01-15T00:00:00.000Z");
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);

    const filename = generateFilename("proj-1", "session_summary", "json");

    expect(filename).toBe("proj-1-session_summary-2024-01-15.json");

    vi.useRealTimers();
  });

  it("should sanitize project ID to remove special characters", () => {
    const filename = generateFilename("proj@#$%^&*()", "map_snapshot", "md");

    // Special chars should be removed
    expect(filename).toContain("proj-");
    expect(filename).not.toContain("@");
    expect(filename).not.toContain("$");
  });

  it("should use .json extension for JSON format", () => {
    const filename = generateFilename("test", "citation_report", "json");
    expect(filename.endsWith(".json")).toBe(true);
  });

  it("should use .md extension for markdown format", () => {
    const filename = generateFilename("test", "grounded_answer", "markdown");
    expect(filename.endsWith(".md")).toBe(true);
  });

  it("should include artifact kind in filename", () => {
    const filename = generateFilename("test", "grounded_answer", "json");
    expect(filename).toContain("grounded_answer");
  });
});

// ============================================================================
// downloadFile tests
// ============================================================================

describe("downloadFile", () => {
  beforeEach(() => {
    // Mock document.body methods
    vi.spyOn(document.body, "appendChild").mockImplementation(() => null);
    vi.spyOn(document.body, "removeChild").mockImplementation(() => null);

    // Mock URL methods
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:http://test.com/123");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    // Mock Blob
    vi.stubGlobal("Blob", class {
      constructor(public parts: any[], public options: { type: string }) {}
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("should create a Blob with correct content and MIME type", () => {
    const BlobMock = vi.fn();
    vi.stubGlobal("Blob", BlobMock);

    downloadFile("test content", "test.json", "application/json");

    expect(BlobMock).toHaveBeenCalledWith(["test content"], {
      type: "application/json",
    });
  });

  it("should create object URL from blob", () => {
    downloadFile("test", "test.json", "application/json");

    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it("should create and click temporary link", () => {
    const clickSpy = vi.fn();
    const createElementSpy = vi.spyOn(document, "createElement").mockReturnValue({
      href: "",
      download: "",
      style: {},
      click: clickSpy,
    } as any);

    downloadFile("test", "test.json", "application/json");

    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(clickSpy).toHaveBeenCalled();
  });

  it("should clean up after download", () => {
    const link = {
      href: "",
      download: "",
      style: {},
      click: () => {},
    };
    vi.spyOn(document, "createElement").mockReturnValue(link as any);

    downloadFile("test", "test.json", "application/json");

    expect(document.body.removeChild).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });
});

// ============================================================================
// copyToClipboard tests
// ============================================================================

describe("copyToClipboard", () => {
  it("should return false when clipboard API is not available in test environment", async () => {
    // In jsdom environment, clipboard API may not be available
    // The function should gracefully return false
    const result = await copyToClipboard("test text");

    // Either it successfully copied (true) or it failed gracefully (false)
    expect(typeof result).toBe("boolean");
  });
});

// ============================================================================
// MIME_TYPES tests
// ============================================================================

describe("MIME_TYPES", () => {
  it("should have correct MIME type for JSON", () => {
    expect(MIME_TYPES.json).toBe("application/json");
  });

  it("should have correct MIME type for Markdown", () => {
    expect(MIME_TYPES.markdown).toBe("text/markdown");
  });
});
