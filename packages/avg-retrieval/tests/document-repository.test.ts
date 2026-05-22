import { describe, expect, it } from "vitest";
import { chunkDocumentText, createDocumentRepository } from "../src/index";

describe("document repository", () => {
  it("chunks document text into stable snippet ids", () => {
    const chunks = chunkDocumentText({
      document_id: "doc_007",
      project_id: "project_001",
      source_label: "Strategy notes",
      text: `First paragraph keeps the boundary visible.

${Array.from({ length: 80 }, (_, index) => `token${index + 1}`).join(" ")}`
    });

    expect(chunks[0]).toEqual({
      id: "snip_doc_007_001",
      document_id: "doc_007",
      project_id: "project_001",
      ordinal: 1,
      text: "First paragraph keeps the boundary visible.",
      location: "paragraph 1",
      source_label: "Strategy notes"
    });
    expect(chunks[1]).toEqual({
      id: "snip_doc_007_002",
      document_id: "doc_007",
      project_id: "project_001",
      ordinal: 2,
      text: expect.any(String),
      location: "paragraph 2 segment 1",
      source_label: "Strategy notes"
    });
    expect(chunks[1]!.text.length).toBeLessThanOrEqual(240);
  });

  it("registers project-local documents with stable ids and metadata", () => {
    const repository = createDocumentRepository({
      now: () => "2026-05-20T00:00:00.000Z"
    });

    const result = repository.registerDocument({
      project_id: "project_001",
      title: " Strategy notes ",
      source_kind: "local_markdown",
      text: "AVG must preserve source boundaries.",
      metadata: {
        origin: "manual"
      }
    });

    expect(result.document).toEqual({
      id: "doc_001",
      project_id: "project_001",
      title: "Strategy notes",
      source_kind: "local_markdown",
      created_at: "2026-05-20T00:00:00.000Z",
      metadata: {
        origin: "manual"
      }
    });
    expect(repository.getDocument("doc_001")).toEqual(result.document);
    expect(repository.getDocumentText("doc_001")).toBe("AVG must preserve source boundaries.");
  });

  it("keeps document records isolated from caller mutation", () => {
    const repository = createDocumentRepository({
      now: () => "2026-05-20T00:00:00.000Z"
    });

    const result = repository.registerDocument({
      project_id: "project_001",
      title: "Source",
      source_kind: "local_text",
      text: "local source",
      metadata: {
        origin: "manual"
      }
    });

    result.document.title = "mutated";
    result.document.metadata!.origin = "mutated";

    expect(repository.getDocument("doc_001")).toEqual({
      id: "doc_001",
      project_id: "project_001",
      title: "Source",
      source_kind: "local_text",
      created_at: "2026-05-20T00:00:00.000Z",
      metadata: {
        origin: "manual"
      }
    });
  });

  it("rejects invalid document metadata and empty text", () => {
    const repository = createDocumentRepository();

    expect(() =>
      repository.registerDocument({
        project_id: "project_001",
        title: "Empty",
        source_kind: "local_text",
        text: ""
      })
    ).toThrow("text is required");

    expect(() =>
      repository.registerDocument({
        project_id: "project_001",
        title: "Bad source",
        source_kind: "remote_url" as "local_text",
        text: "content"
      })
    ).toThrow("Unsupported source_kind");
  });

  it("lists documents by project without exposing stored state", () => {
    const repository = createDocumentRepository({
      now: () => "2026-05-20T00:00:00.000Z"
    });

    repository.registerDocument({
      project_id: "project_001",
      title: "One",
      source_kind: "local_text",
      text: "one"
    });
    repository.registerDocument({
      project_id: "project_002",
      title: "Two",
      source_kind: "local_text",
      text: "two"
    });

    const documents = repository.listDocuments("project_001");
    documents[0]!.title = "mutated";

    expect(documents).toHaveLength(1);
    expect(repository.listDocuments("project_001")[0]!.title).toBe("One");
    expect(repository.listDocuments()).toHaveLength(2);
  });

  it("returns ranked snippet hits with citation ids and project isolation", () => {
    const repository = createDocumentRepository({
      now: () => "2026-05-20T00:00:00.000Z"
    });

    repository.registerDocument({
      project_id: "project_001",
      title: "Strategy notes",
      source_kind: "local_markdown",
      text: "AVG keeps scope visible.\n\nAVG keeps claim status visible."
    });

    repository.registerDocument({
      project_id: "project_002",
      title: "Other notes",
      source_kind: "local_text",
      text: "AVG keeps scope visible."
    });

    const result = repository.searchDocuments("project_001", "AVG");

    expect(result).toEqual({
      hits: [
        {
          snippet_id: "snip_doc_001_001",
          document_id: "doc_001",
          project_id: "project_001",
          score: 1,
          confidence: "high",
          citation_id: "cit_doc_001_001",
          matched_text: "AVG keeps scope visible.",
          source_label: "Strategy notes"
        },
        {
          snippet_id: "snip_doc_001_002",
          document_id: "doc_001",
          project_id: "project_001",
          score: 1,
          confidence: "high",
          citation_id: "cit_doc_001_002",
          matched_text: "AVG keeps claim status visible.",
          source_label: "Strategy notes"
        }
      ],
      retrieval_confidence: "high"
    });
  });

  it("rejects empty retrieval queries", () => {
    const repository = createDocumentRepository();

    expect(() => repository.searchDocuments("project_001", "   ")).toThrow("query is required");
  });
});
