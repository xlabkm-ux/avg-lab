import { validateClaimContract } from "@avg/validation";

export function validateClaimRequest(body: unknown) {
  return validateClaimContract(body);
}
