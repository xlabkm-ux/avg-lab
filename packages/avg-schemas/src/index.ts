import { readFileSync } from "node:fs";
import Ajv2020, { type AnySchema, type ErrorObject, type ValidateFunction } from "ajv/dist/2020.js";

export const claimStatuses = [
  "definition",
  "working_distinction",
  "operational_marker",
  "indirect_sign",
  "hypothesis",
  "metaphor_only",
  "prohibited_positive_claim",
  "boundary_statement"
] as const;

export type ClaimStatus = (typeof claimStatuses)[number];

export const languageModes = [
  "direct_description",
  "operational_description",
  "conditional_description",
  "metaphor",
  "symbolic_pointer",
  "silence_required"
] as const;

export type LanguageMode = (typeof languageModes)[number];

export interface AvgClaim {
  id: string;
  statement: string;
  claim_status: ClaimStatus;
  language_mode: LanguageMode;
  scope?: string;
  risks: string[];
  repair?: string;
  source_refs?: string[];
}

export interface AvgMapNode {
  id: string;
  type: "term" | "claim" | "concept" | "map" | "risk" | "source_fragment" | "artifact" | "mode";
  label: string;
  definition?: string;
  coordinates: {
    access_mode: "knowable" | "indirectly_accessible" | "unknowable" | "mixed" | "unknown";
    language_mode: LanguageMode;
    claim_status?: string;
  };
  map_safety: {
    known_risks?: string[];
  };
}

export interface AvgMapEdge {
  id: string;
  type:
    | "defines"
    | "supports"
    | "contradicts"
    | "depends_on"
    | "contains"
    | "manifests_as"
    | "risks"
    | "repairs"
    | "cites"
    | "analogizes";
  from: string;
  to: string;
  claim_status: string;
  scope?: string;
  constraints?: string[];
}

export const dialogueValidationRisks = ["low", "medium", "high", "critical"] as const;

export type DialogueValidationRisk = (typeof dialogueValidationRisks)[number];

export const mapTerritoryBoundaryStates = ["preserved", "unclear", "violated"] as const;

export type MapTerritoryBoundaryState = (typeof mapTerritoryBoundaryStates)[number];

export const documentSourceKinds = ["local_text", "local_markdown", "local_document"] as const;

export type DocumentSourceKind = (typeof documentSourceKinds)[number];

export interface AvgDocumentRef {
  id: string;
  project_id: string;
  title: string;
  source_kind: DocumentSourceKind;
  created_at: string;
  metadata?: Record<string, string>;
}

export interface AvgStructuredResponse {
  id: string;
  project_id: string;
  session_id: string;
  message_id: string;
  summary: string;
  scope: string;
  claim_status: ClaimStatus;
  language_mode: LanguageMode;
  validation_risk: DialogueValidationRisk;
  risk_markers: string[];
  map_territory_boundary: MapTerritoryBoundaryState;
  next_action: string;
  artifacts?: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: ErrorObject[];
}

const ajv = new Ajv2020({ allErrors: true, strict: false });

function loadSchema(pathFromRepoRoot: string): AnySchema {
  const schemaUrl = new URL(`../../../${pathFromRepoRoot}`, import.meta.url);
  return JSON.parse(readFileSync(schemaUrl, "utf8")) as AnySchema;
}

export const claimSchema = loadSchema("schemas/json-schema/claim.schema.json");
export const mapNodeSchema = loadSchema("schemas/json-schema/map-node.schema.json");
export const mapEdgeSchema = loadSchema("schemas/json-schema/map-edge.schema.json");
export const avgResponseSchema = loadSchema("schemas/json-schema/avg-response.schema.json");
export const documentSchema = loadSchema("schemas/json-schema/document.schema.json");

const claimValidator = ajv.compile<AvgClaim>(claimSchema);
const mapNodeValidator = ajv.compile<AvgMapNode>(mapNodeSchema);
const mapEdgeValidator = ajv.compile<AvgMapEdge>(mapEdgeSchema);
const avgResponseValidator = ajv.compile<AvgStructuredResponse>(avgResponseSchema);
const documentValidator = ajv.compile<AvgDocumentRef>(documentSchema);

function runValidator<T>(validator: ValidateFunction<T>, value: unknown): ValidationResult {
  const valid = validator(value);
  return {
    valid,
    errors: valid ? [] : [...(validator.errors ?? [])]
  };
}

export function validateClaim(value: unknown): ValidationResult {
  return runValidator(claimValidator, value);
}

export function validateMapNode(value: unknown): ValidationResult {
  return runValidator(mapNodeValidator, value);
}

export function validateMapEdge(value: unknown): ValidationResult {
  return runValidator(mapEdgeValidator, value);
}

export function validateAvgResponse(value: unknown): ValidationResult {
  return runValidator(avgResponseValidator, value);
}

export function validateDocumentRef(value: unknown): ValidationResult {
  return runValidator(documentValidator, value);
}

export function isAvgClaim(value: unknown): value is AvgClaim {
  return validateClaim(value).valid;
}

export function isAvgStructuredResponse(value: unknown): value is AvgStructuredResponse {
  return validateAvgResponse(value).valid;
}

export function isAvgDocumentRef(value: unknown): value is AvgDocumentRef {
  return validateDocumentRef(value).valid;
}
