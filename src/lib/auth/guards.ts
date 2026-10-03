import { getCurrentProfile } from "@/lib/auth/current-profile";
import type { CurrentProfile, UserRole } from "@/types/domain";

export type AuthorizationErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "ACCOUNT_NOT_ACTIVE"
  | "ACCOUNT_NOT_PENDING";

export class AuthorizationError extends Error {
  readonly code: AuthorizationErrorCode;

  constructor(code: AuthorizationErrorCode, message: string) {
    super(message);
    this.name = "AuthorizationError";
    this.code = code;
  }
}

export async function requireCurrentProfile(): Promise<CurrentProfile> {
  const profile = await getCurrentProfile();

  if (!profile) {
    throw new AuthorizationError(
      "UNAUTHENTICATED",
      "You must be signed in to continue.",
    );
  }

  return profile;
}

export async function requireRole(
  ...allowedRoles: [UserRole, ...UserRole[]]
): Promise<CurrentProfile> {
  const profile = await requireCurrentProfile();

  if (!allowedRoles.includes(profile.role)) {
    throw new AuthorizationError(
      "FORBIDDEN",
      "You do not have permission to perform this action.",
    );
  }

  return profile;
}

export async function requireActiveBeneficiary(): Promise<CurrentProfile> {
  const profile = await requireRole("beneficiary");

  if (profile.accountStatus !== "active") {
    throw new AuthorizationError(
      "ACCOUNT_NOT_ACTIVE",
      "Your beneficiary account must be activated by your assigned clinic.",
    );
  }

  return profile;
}

export async function requirePendingBeneficiary(): Promise<CurrentProfile> {
  const profile = await requireRole("beneficiary");

  if (profile.accountStatus !== "pending") {
    throw new AuthorizationError(
      "ACCOUNT_NOT_PENDING",
      "This action is available only while verification is pending.",
    );
  }

  return profile;
}
