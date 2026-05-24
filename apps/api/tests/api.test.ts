import { describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { request } from "node:http";
import { join } from "node:path";
import {
  appendMessage,
  createApiRuntimeConfig,
  createApiServer,
  createGroundedProjectRetrievalFlow,
  handleGroundedProjectDialoguePageRoute,
  composeGroundedProjectResponse,
  createProject,
  createProjectSessionMessage,
  createMapDiffArtifact,
  createSession,
  getMessage,
  getProject,
  getProjectDocument,
  getProjectDocumentText,
  getSession,
  health,
  listProjectDocuments,
  searchProjectDocuments,
  materializeMapSnapshot,
  registerProjectDocument,
  resolveLabRelativePath,
  renderGroundedProjectDialoguePage,
  renderGroundedProjectRetrievalFlow,
  validateClaimRequest,
  writeApiErrorLog
} from "../src/index";
import { createEmptyGraphSnapshot, projectClaimToMapNode } from "@avg/graph";
import validResponseFixture from "../../../tests/fixtures/avg-response/valid.json";

describe("api app smoke surface", () => {
  it("exposes health status", () => {
    expect(health()).toEqual({ status: "ok", service: "avg-api" });
  });

  it("validates API runtime config before the server starts", () => {
    expect(
      createApiRuntimeConfig(
        {},
        {
          AVG_API_REQUEST_TIMEOUT_MS: "2500",
          AVG_API_REQUEST_BODY_LIMIT_BYTES: "64000",
          AVG_API_LOG_DIRECTORY: ".avg-logs-test"
        }
      )
    ).toEqual({
      requestTimeoutMs: 2500,
      requestBodyLimitBytes: 64000,
      logDirectory: ".avg-logs-test"
    });

    expect(() =>
      createApiRuntimeConfig(
        {},
        {
          AVG_API_REQUEST_TIMEOUT_MS: "0",
          AVG_API_REQUEST_BODY_LIMIT_BYTES: "64000",
          AVG_API_LOG_DIRECTORY: ".avg-logs-test"
        }
      )
    ).toThrow("AVG_API_REQUEST_TIMEOUT_MS must be a positive integer.");
  });

  it("keeps lab file paths inside the configured workspace boundary", () => {
    const resolved = resolveLabRelativePath("E:/LA/avg-lab", "apps/api/src/index.ts");

    expect(resolved.absolutePath).toContain("apps");
    expect(() => resolveLabRelativePath("E:/LA/avg-lab", "../../etc/passwd")).toThrow(
      "Path traversal outside the AVG lab boundary is not allowed."
    );
    expect(() =>
      resolveLabRelativePath("E:/LA/avg-lab", "E:/Windows/System32/drivers/etc/hosts")
    ).toThrow("Absolute paths are not allowed");
  });

  it("writes API error context into a local log file without exposing it in responses", () => {
    const tempRoot = mkdtempSync(".avg-api-log-");

    try {
      writeApiErrorLog(new Error("private traceback context"), {
        requestTimeoutMs: 1000,
        requestBodyLimitBytes: 1000,
        logDirectory: tempRoot
      });

      const logPath = join(tempRoot, "api-errors.ndjson");
      expect(existsSync(logPath)).toBe(true);
      expect(readFileSync(logPath, "utf8")).toContain("private traceback context");
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("validates claim request bodies through the contract validator", () => {
    const response = validateClaimRequest({
      id: "claim_001",
      statement: "This is a working API contract slice.",
      claim_status: "hypothesis",
      language_mode: "operational_description",
      scope: "MVP-0 smoke test.",
      risks: []
    });

    expect(response.accepted).toBe(true);
  });

  it("creates and links projects, sessions and messages in memory", () => {
    const project = createProject("Launch project");
    const session = createSession(project.id, "Kickoff");
    const message = appendMessage(session.id, "Start the dialogue.");

    expect(getProject(project.id)).toEqual(project);
    expect(getSession(session.id)).toEqual(session);
    expect(getMessage(message.id)).toEqual(message);
    expect(message.role).toBe("user");
  });

  it("creates a linked project/session/message slice in one call", () => {
    const record = createProjectSessionMessage(
      "Research project",
      "Synthesis",
      "Capture the main idea."
    );

    expect(record.project.name).toBe("Research project");
    expect(record.session.projectId).toBe(record.project.id);
    expect(record.message.sessionId).toBe(record.session.id);
    expect(record.message.content).toBe("Capture the main idea.");
  });

  it("registers project-local documents through the API boundary", () => {
    const project = createProject("Retrieval project");
    const result = registerProjectDocument(project.id, {
      title: "Strategy notes",
      source_kind: "local_markdown",
      text: "Registered document text stays local for retrieval.",
      created_at: "2026-05-20T00:00:00.000Z",
      metadata: {
        origin: "manual"
      }
    });

    expect(result.document).toEqual({
      id: "doc_001",
      project_id: project.id,
      title: "Strategy notes",
      source_kind: "local_markdown",
      created_at: "2026-05-20T00:00:00.000Z",
      metadata: {
        origin: "manual"
      }
    });
    expect(getProjectDocument(result.document.id)).toEqual(result.document);
    expect(getProjectDocumentText(result.document.id)).toBe(
      "Registered document text stays local for retrieval."
    );
    expect(listProjectDocuments(project.id)).toEqual([result.document]);
  });

  it("rejects document registration for unknown projects and invalid text", () => {
    expect(() =>
      registerProjectDocument("project_missing", {
        title: "Missing project source",
        source_kind: "local_text",
        text: "source"
      })
    ).toThrow("Unknown project");

    const project = createProject("Invalid document project");
    expect(() =>
      registerProjectDocument(project.id, {
        title: "Empty source",
        source_kind: "local_text",
        text: ""
      })
    ).toThrow("text is required");
  });

  it("searches project snippets and composes a grounded response boundary", () => {
    const project = createProject("Grounding project");

    const registered = registerProjectDocument(project.id, {
      title: "Strategy notes",
      source_kind: "local_markdown",
      text: "This response keeps the distinction between map and territory clear."
    });

    const search = searchProjectDocuments(project.id, "map and territory");

    expect(search.hits[0]).toMatchObject({
      document_id: registered.document.id,
      snippet_id: `snip_${registered.document.id}_001`,
      citation_id: `cit_${registered.document.id}_001`,
      confidence: "high"
    });

    const report = composeGroundedProjectResponse(project.id, {
      response: validResponseFixture,
      query: "map and territory",
      limit: 3
    });

    expect(report.accepted).toBe(true);
    expect(report.groundedResponse?.grounding.citations[0]).toMatchObject({
      id: `cit_${registered.document.id}_001`,
      snippet_id: `snip_${registered.document.id}_001`
    });
    expect(report.groundedResponse?.grounding.boundary_statement).toContain("grounded only");
  });

  it("renders a grounded project dialogue page from the API boundary", () => {
    const project = createProject("Dialogue page project");

    registerProjectDocument(project.id, {
      title: "Dialogue notes",
      source_kind: "local_markdown",
      text: "The dialogue page should show grounded responses inline."
    });

    const response = {
      id: "response_002",
      project_id: project.id,
      session_id: "session_002",
      message_id: "message_002",
      summary: "Grounded page-ready response",
      scope: "dialogue page bridge",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["retrieval_grounded"],
      map_territory_boundary: "preserved",
      next_action: "render the dialogue page"
    } as const;

    const page = renderGroundedProjectDialoguePage(project.id, {
      sessionId: "session_002",
      messages: [
        { id: "message_001", role: "user", content: "start the page" },
        { id: "message_002", role: "assistant", content: "grounded page bridge" }
      ],
      response,
      query: "grounded page bridge"
    });

    expect(page).toContain('data-page="dialogue-flow-page"');
    expect(page).toContain('data-panel="grounded-response-details-panel"');
    expect(page).toContain("Grounded page-ready response");
    expect(page).toContain("The dialogue page should show grounded responses inline.");
  });

  it("creates and renders a grounded retrieval flow with retrieval hits and citations", () => {
    const project = createProject("Grounded flow project");

    const registered = registerProjectDocument(project.id, {
      title: "Flow notes",
      source_kind: "local_markdown",
      text: "Grounded retrieval should show snippet ids, citation ids and confidence."
    });

    const response = {
      id: "response_705",
      project_id: project.id,
      session_id: "session_705",
      message_id: "message_705",
      summary: "Grounded flow response",
      scope: "AVG-705 API flow",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["retrieval_grounded"],
      map_territory_boundary: "preserved",
      next_action: "inspect hits and citations"
    } as const;

    const flow = createGroundedProjectRetrievalFlow(project.id, {
      response,
      query: "snippet ids citation ids confidence"
    });

    expect(flow.retrieval.hits[0]).toMatchObject({
      document_id: registered.document.id,
      snippet_id: `snip_${registered.document.id}_001`,
      citation_id: `cit_${registered.document.id}_001`,
      confidence: "high"
    });
    expect(flow.report.groundedResponse?.grounding.citations[0]).toMatchObject({
      snippet_id: `snip_${registered.document.id}_001`
    });

    const html = renderGroundedProjectRetrievalFlow(project.id, {
      sessionId: "session_705",
      response,
      query: "snippet ids citation ids confidence"
    });

    expect(html).toContain('data-surface="grounded-retrieval-flow"');
    expect(html).toContain(`data-snippet-id="snip_${registered.document.id}_001"`);
    expect(html).toContain(`data-citation-id="cit_${registered.document.id}_001"`);
    expect(html).toContain('data-confidence="high"');
    expect(html).toContain("Grounded retrieval should show snippet ids");
  });

  it("serves the grounded dialogue page route over the API boundary", () => {
    const project = createProject("Route project");

    registerProjectDocument(project.id, {
      title: "Route notes",
      source_kind: "local_markdown",
      text: "The HTTP route should render the grounded page."
    });

    const response = {
      id: "response_003",
      project_id: project.id,
      session_id: "session_003",
      message_id: "message_003",
      summary: "Route-rendered grounded response",
      scope: "HTTP route bridge",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["retrieval_grounded"],
      map_territory_boundary: "preserved",
      next_action: "serve the page route"
    } as const;

    const routeResponse = handleGroundedProjectDialoguePageRoute(
      "POST",
      `/projects/${project.id}/dialogue/page`,
      JSON.stringify({
        sessionId: "session_003",
        messages: [
          { id: "message_001", role: "user", content: "route request" },
          { id: "message_002", role: "assistant", content: "route reply" }
        ],
        response,
        query: "HTTP route bridge"
      })
    );

    expect(routeResponse.statusCode).toBe(200);
    expect(routeResponse.headers["content-type"]).toContain("application/json");
    const parsed = JSON.parse(routeResponse.body);
    expect(parsed).toHaveProperty("html");
    expect(parsed).toHaveProperty("structuredResponse");
    expect(parsed.html).toContain('data-page="dialogue-flow-page"');
    expect(parsed.html).toContain("Route-rendered grounded response");
    expect(parsed.html).toContain("The HTTP route should render the grounded page.");
  });

  it("serves the grounded retrieval flow route and keeps missing evidence visible", () => {
    const project = createProject("Grounded flow route project");
    const response = {
      id: "response_705_route",
      project_id: project.id,
      session_id: "session_705_route",
      message_id: "message_705_route",
      summary: "Route-rendered grounded retrieval response",
      scope: "AVG-705 route bridge",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "high",
      risk_markers: ["missing_evidence"],
      map_territory_boundary: "preserved",
      next_action: "register evidence before claiming support"
    } as const;

    const routeResponse = handleGroundedProjectDialoguePageRoute(
      "POST",
      `/projects/${project.id}/retrieval/grounded-flow`,
      JSON.stringify({
        sessionId: "session_705_route",
        response,
        query: "unmatched evidence"
      })
    );

    expect(routeResponse.statusCode).toBe(200);
    expect(routeResponse.headers["content-type"]).toContain("application/json");
    const parsed = JSON.parse(routeResponse.body);
    expect(parsed).toHaveProperty("retrieval");
    expect(parsed).toHaveProperty("report");
    expect(parsed.retrieval.hits).toEqual([]);
    expect(parsed.retrieval.retrieval_confidence).toBe("none");
    expect(parsed.report.boundaryNotes).toContainEqual(
      expect.stringContaining("retrieval evidence")
    );
  });

  it("serves document registration and retrieval search routes over the API boundary", () => {
    const project = createProject("HTTP retrieval project");

    const documentResponse = handleGroundedProjectDialoguePageRoute(
      "POST",
      `/projects/${project.id}/documents`,
      JSON.stringify({
        title: "HTTP notes",
        source_kind: "local_markdown",
        text: "HTTP retrieval keeps citations attached to snippets.",
        created_at: "2026-05-20T00:00:00.000Z",
        metadata: {
          origin: "route-test"
        }
      })
    );
    const documentBody = JSON.parse(documentResponse.body) as {
      document: {
        id: string;
        project_id: string;
        title: string;
      };
    };

    expect(documentResponse.statusCode).toBe(201);
    expect(documentBody.document).toMatchObject({
      project_id: project.id,
      title: "HTTP notes"
    });

    const searchResponse = handleGroundedProjectDialoguePageRoute(
      "POST",
      `/projects/${project.id}/retrieval/search`,
      JSON.stringify({
        query: "citations snippets",
        limit: 2
      })
    );
    const searchBody = JSON.parse(searchResponse.body) as {
      hits: Array<{
        document_id: string;
        snippet_id: string;
        citation_id: string;
        matched_text: string;
      }>;
      retrieval_confidence: string;
    };

    expect(searchResponse.statusCode).toBe(200);
    expect(searchBody.retrieval_confidence).toBe("high");
    expect(searchBody.hits[0]).toMatchObject({
      document_id: documentBody.document.id,
      snippet_id: `snip_${documentBody.document.id}_001`,
      citation_id: `cit_${documentBody.document.id}_001`,
      matched_text: "HTTP retrieval keeps citations attached to snippets."
    });
  });

  it("returns explicit route errors for invalid retrieval requests and missing evidence", () => {
    const project = createProject("HTTP retrieval error project");

    const invalidSearch = handleGroundedProjectDialoguePageRoute(
      "POST",
      `/projects/${project.id}/retrieval/search`,
      JSON.stringify({
        limit: 1
      })
    );

    expect(invalidSearch.statusCode).toBe(400);
    expect(JSON.parse(invalidSearch.body)).toMatchObject({
      code: "RETRIEVAL_QUERY_REQUIRED"
    });

    const emptySearch = handleGroundedProjectDialoguePageRoute(
      "POST",
      `/projects/${project.id}/retrieval/search`,
      JSON.stringify({
        query: "unmatched evidence"
      })
    );

    expect(emptySearch.statusCode).toBe(200);
    expect(JSON.parse(emptySearch.body)).toMatchObject({
      hits: [],
      retrieval_confidence: "none"
    });
  });

  it("rejects traversal-like route ids before they reach project lookup", () => {
    const response = handleGroundedProjectDialoguePageRoute(
      "POST",
      "/projects/..%2F..%2Fetc%2Fpasswd/retrieval/search",
      JSON.stringify({ query: "anything" })
    );

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      status: "error",
      code: "INVALID_ROUTE_ID"
    });
  });

  it("enforces HTTP body limits with a safe error envelope", async () => {
    const tempRoot = mkdtempSync(".avg-api-limit-log-");
    const server = createApiServer({
      config: {
        requestTimeoutMs: 1000,
        requestBodyLimitBytes: 8,
        logDirectory: tempRoot
      }
    });

    try {
      await new Promise<void>((resolvePromise) => server.listen(0, resolvePromise));
      const address = server.address();
      if (address === null || typeof address === "string") {
        throw new Error("Expected an ephemeral local server port.");
      }

      const response = await new Promise<{ statusCode: number; body: string }>(
        (resolvePromise, rejectPromise) => {
          const clientRequest = request(
            {
              hostname: "127.0.0.1",
              port: address.port,
              path: "/projects/project_001/retrieval/search",
              method: "POST",
              headers: {
                "content-type": "application/json"
              }
            },
            (clientResponse) => {
              const chunks: Buffer[] = [];
              clientResponse.on("data", (chunk: Buffer) => chunks.push(chunk));
              clientResponse.on("end", () => {
                resolvePromise({
                  statusCode: clientResponse.statusCode ?? 0,
                  body: Buffer.concat(chunks).toString("utf8")
                });
              });
            }
          );

          clientRequest.on("error", rejectPromise);
          clientRequest.end(JSON.stringify({ query: "too large for the configured test limit" }));
        }
      );

      expect(response.statusCode).toBe(413);
      expect(JSON.parse(response.body)).toMatchObject({
        status: "error",
        code: "REQUEST_BODY_TOO_LARGE",
        message: "The request body exceeds the configured API limit."
      });
      expect(response.body).not.toContain("Request body too large.");
      expect(existsSync(join(tempRoot, "api-errors.ndjson"))).toBe(true);
    } finally {
      await new Promise<void>((resolvePromise, rejectPromise) => {
        server.close((error) => {
          if (error) {
            rejectPromise(error);
            return;
          }

          resolvePromise();
        });
      });
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("materializes map snapshots from projections and snapshots", () => {
    const projection = projectClaimToMapNode({
      id: "claim_010",
      statement: "Map diffs should preserve boundary metadata.",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      risks: ["boundary_loss"],
      source_refs: ["source_010"],
      scope: "Sprint 5 artifact surface"
    });

    const from = createEmptyGraphSnapshot();
    const to = materializeMapSnapshot(projection);
    const artifact = createMapDiffArtifact(from, projection);

    expect(to).toEqual({
      nodes: [projection.node],
      edges: projection.edges
    });
    expect(artifact.kind).toBe("map_diff");
    expect(artifact.from).toEqual(from);
    expect(artifact.to).toEqual(to);
    expect(artifact.diff.addedNodes).toEqual([projection.node]);
    expect(artifact.diff.addedEdges).toEqual(projection.edges);
  });
});
