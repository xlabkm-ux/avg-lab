import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

// ─── Entry Types ─────────────────────────────────────────────────────────────

export interface ErMapCoordinates {
  nesting_level: string;
  objectivity_mode?: string | null | undefined;
  hardness_mode?: string | null | undefined;
  access_mode?: string | null | undefined;
  world_subdomain?: string | null | undefined;
}

export interface ErMapCommonSubstitution {
  error: string;
  risk: string;
}

export interface ErMapTermEntry {
  entryType: "term";
  id: string;
  label: string;
  aliases: string[];
  definition: string;
  term_role: string;
  coordinates: ErMapCoordinates;
  allowed_language: string[];
  forbidden_language: string[];
  common_substitutions: ErMapCommonSubstitution[];
  category?: string | undefined;
}

export interface ErMapLanguagePolicy {
  allowed_modes: string[];
  forbidden_modes: string[];
  notes?: string | undefined;
}

export interface ErMapClaimPolicy {
  default_claim_status: string;
  positive_claims_allowed: boolean;
  requires_scope_boundary?: boolean | undefined;
  requires_access_mode?: boolean | undefined;
}

export interface ErMapMapSafety {
  known_risks: string[];
  anti_substitution_rule?: string | undefined;
  status?: string | undefined;
}

export interface ErMapOntologyEntry {
  entryType: "ontology";
  id: string;
  label: string;
  labelShort?: string | undefined;
  definition: string;
  definitionType?: string | undefined;
  coordinates: ErMapCoordinates;
  language_policy: ErMapLanguagePolicy;
  claim_policy: ErMapClaimPolicy;
  map_safety: ErMapMapSafety;
}

export interface ErMapMethodologyEntry {
  entryType: "methodology";
  id: string;
  label: string;
  definition: string;
  definitionType?: string | undefined;
  coordinates: ErMapCoordinates;
  language_policy: ErMapLanguagePolicy;
  claim_policy: ErMapClaimPolicy;
  map_safety: ErMapMapSafety;
  scope_requirements?: {
    local_task_required?: boolean | undefined;
    definition_area_required?: boolean | undefined;
    global_areas_required?: boolean | undefined;
    context_required?: boolean | undefined;
  } | undefined;
  does_not_claim?: string[] | undefined;
}

export interface ErMapFragmentEntry {
  entryType: "fragment";
  id: string;
  text: string;
  topic?: string | undefined;
  source_id?: string | undefined;
}

export type ErMapEntry =
  | ErMapTermEntry
  | ErMapOntologyEntry
  | ErMapMethodologyEntry
  | ErMapFragmentEntry;

// ─── Loading Functions ───────────────────────────────────────────────────────

function readJsonFile(filePath: string): unknown {
  const content = readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

function loadTermsFile(filePath: string): ErMapTermEntry[] {
  const data = readJsonFile(filePath) as {
    file_type?: string;
    category?: string;
    items?: Array<{
      id: string;
      label: string;
      aliases?: string[];
      definition: string;
      term_role?: string;
      coordinates: ErMapCoordinates;
      allowed_language?: string[];
      forbidden_language?: string[];
      common_substitutions?: ErMapCommonSubstitution[];
    }>;
  };

  if (!data.items || !Array.isArray(data.items)) {
    return [];
  }

  return data.items.map((item) => ({
    entryType: "term" as const,
    id: item.id,
    label: item.label,
    aliases: item.aliases ?? [],
    definition: item.definition,
    term_role: item.term_role ?? "distinction_node",
    coordinates: item.coordinates,
    allowed_language: item.allowed_language ?? [],
    forbidden_language: item.forbidden_language ?? [],
    common_substitutions: item.common_substitutions ?? [],
    category: data.category,
  }));
}

function loadOntologyFile(filePath: string): ErMapOntologyEntry[] {
  const data = readJsonFile(filePath) as {
    file_type?: string;
    items?: Array<{
      id: string;
      type?: string;
      label?: { ru?: string; short?: string; en?: string } | string;
      definition?: { text: string; definition_type?: string } | string;
      coordinates: ErMapCoordinates;
      language_policy?: ErMapLanguagePolicy;
      claim_policy?: ErMapClaimPolicy;
      map_safety?: ErMapMapSafety;
    }>;
  };

  if (!data.items || !Array.isArray(data.items)) {
    return [];
  }

  return data.items.map((item) => {
    const labelObj = item.label;
    const label = typeof labelObj === "string"
      ? labelObj
      : labelObj?.ru ?? labelObj?.short ?? item.id;
    const labelShort = typeof labelObj === "object" && labelObj !== null
      ? labelObj.short
      : undefined;
    const defObj = item.definition;
    const definition = typeof defObj === "string"
      ? defObj
      : defObj?.text ?? "";
    const definitionType = typeof defObj === "object" && defObj !== null
      ? defObj.definition_type
      : undefined;

    return {
      entryType: "ontology" as const,
      id: item.id,
      label,
      labelShort,
      definition,
      definitionType,
      coordinates: item.coordinates,
      language_policy: item.language_policy ?? { allowed_modes: [], forbidden_modes: [] },
      claim_policy: item.claim_policy ?? {
        default_claim_status: "working_distinction",
        positive_claims_allowed: true,
      },
      map_safety: item.map_safety ?? { known_risks: [] },
    };
  });
}

function loadMethodologyFile(filePath: string): ErMapMethodologyEntry[] {
  const data = readJsonFile(filePath) as {
    file_type?: string;
    items?: Array<{
      id: string;
      type?: string;
      label?: { ru?: string; short?: string } | string;
      definition?: { text: string; definition_type?: string } | string;
      coordinates: ErMapCoordinates;
      language_policy?: ErMapLanguagePolicy;
      claim_policy?: ErMapClaimPolicy;
      map_safety?: ErMapMapSafety;
      scope_requirements?: {
        local_task_required?: boolean;
        definition_area_required?: boolean;
        global_areas_required?: boolean;
        context_required?: boolean;
      };
      boundaries?: { does_not_claim?: string[] };
    }>;
  };

  if (!data.items || !Array.isArray(data.items)) {
    return [];
  }

  return data.items.map((item) => {
    const labelObj = item.label;
    const label = typeof labelObj === "string"
      ? labelObj
      : labelObj?.ru ?? labelObj?.short ?? item.id;
    const defObj = item.definition;
    const definition = typeof defObj === "string"
      ? defObj
      : defObj?.text ?? "";
    const definitionType = typeof defObj === "object" && defObj !== null
      ? defObj.definition_type
      : undefined;

    return {
      entryType: "methodology" as const,
      id: item.id,
      label,
      definition,
      definitionType,
      coordinates: item.coordinates,
      language_policy: item.language_policy ?? { allowed_modes: [], forbidden_modes: [] },
      claim_policy: item.claim_policy ?? {
        default_claim_status: "working_distinction",
        positive_claims_allowed: true,
      },
      map_safety: item.map_safety ?? { known_risks: [] },
      scope_requirements: item.scope_requirements,
      does_not_claim: item.boundaries?.does_not_claim,
    };
  });
}

function loadFragmentsFile(filePath: string): ErMapFragmentEntry[] {
  const data = readJsonFile(filePath) as {
    file_type?: string;
    fragments?: Array<{
      id: string;
      text: string;
      topic?: string;
      source_id?: string;
    }>;
  };

  if (!data.fragments || !Array.isArray(data.fragments)) {
    return [];
  }

  return data.fragments.map((item) => ({
    entryType: "fragment" as const,
    id: item.id,
    text: item.text,
    topic: item.topic,
    source_id: item.source_id,
  }));
}

function loadJsonFilesFromDir(dirPath: string): string[] {
  if (!existsSync(dirPath)) {
    return [];
  }
  return readdirSync(dirPath)
    .filter((name) => name.endsWith(".json"))
    .map((name) => join(dirPath, name));
}

// ─── Main Loader ─────────────────────────────────────────────────────────────

export interface LoadErMapResult {
  entries: ErMapEntry[];
  counts: {
    terms: number;
    ontology: number;
    methodology: number;
    fragments: number;
  };
}

/**
 * Loads the er-map knowledge base from disk.
 * Reads all JSON files from terms/, ontology/, methodology/, and sources/ directories.
 */
export function loadErMap(erMapRoot: string): LoadErMapResult {
  const entries: ErMapEntry[] = [];

  // Load terms
  const termFiles = loadJsonFilesFromDir(join(erMapRoot, "terms"));
  let termCount = 0;
  for (const file of termFiles) {
    // Skip index file
    if (file.endsWith("terms_index.json")) continue;
    const items = loadTermsFile(file);
    entries.push(...items);
    termCount += items.length;
  }

  // Load ontology
  const ontologyFiles = loadJsonFilesFromDir(join(erMapRoot, "ontology"));
  let ontologyCount = 0;
  for (const file of ontologyFiles) {
    const items = loadOntologyFile(file);
    entries.push(...items);
    ontologyCount += items.length;
  }

  // Load methodology
  const methodologyFiles = loadJsonFilesFromDir(join(erMapRoot, "methodology"));
  let methodologyCount = 0;
  for (const file of methodologyFiles) {
    const items = loadMethodologyFile(file);
    entries.push(...items);
    methodologyCount += items.length;
  }

  // Load fragments
  const fragmentsFile = join(erMapRoot, "sources", "source_fragments.json");
  let fragmentCount = 0;
  if (existsSync(fragmentsFile)) {
    const items = loadFragmentsFile(fragmentsFile);
    entries.push(...items);
    fragmentCount = items.length;
  }

  return {
    entries,
    counts: {
      terms: termCount,
      ontology: ontologyCount,
      methodology: methodologyCount,
      fragments: fragmentCount,
    },
  };
}
