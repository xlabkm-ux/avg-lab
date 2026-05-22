import { extractClaimsFromAvgResponse } from "@avg/validation";
import type { AvgStructuredResponse } from "@avg/schemas";
import type { ClaimExtractionReport } from "@avg/validation";
import { useMemo } from "react";

export function useClaimExtraction(
  response: AvgStructuredResponse | null | undefined,
): ClaimExtractionReport | null {
  return useMemo(() => {
    if (response === null || response === undefined) {
      return null;
    }

    try {
      return extractClaimsFromAvgResponse(response);
    } catch {
      return null;
    }
  }, [response]);
}
