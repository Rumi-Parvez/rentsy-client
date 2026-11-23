import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth, db } from "@/lib/auth";
import type { DashboardUser, UserRole } from "@/types/dashboard";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

function toRole(value: unknown): UserRole {
  if (
    value === "admin" ||
    value === "owner" ||
    value === "customer"
  ) {
    return value;
  }

  return "customer";
}

function serializeUser(
  user: Record<string, unknown>
): DashboardUser {
  return {
    _id: String(user._id ?? ""),
    name: String(user.name ?? "User"),
    email: String(user.email ?? ""),
    image: user.image ? String(user.image) : "",
    phone: user.phone ? String(user.phone) : "",
    address: user.address ? String(user.address) : "",
    role: toRole(user.role),

    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt
          ? String(user.createdAt)
          : undefined,

    updatedAt:
      user.updatedAt instanceof Date
        ? user.updatedAt.toISOString()
        : user.updatedAt
          ? String(user.updatedAt)
          : undefined,
  };
}

/**
 * Get the authenticated Dashboard user.
 *
 * If there is no valid Better Auth session,
 * redirect to the sign-in page.
 */
export const getDashboardUser = cache(
  async (): Promise<DashboardUser> => {
    // --------------------------------------------------
    // 1. Get Better Auth session
    // --------------------------------------------------

    let session;

    try {
      session = await auth.api.getSession({
        headers: await headers(),
      });

      console.log(
        "[Dashboard Auth] Session:",
        session ? "FOUND" : "NULL"
      );
    } catch (error) {
      console.error(
        "[Dashboard Auth] Better Auth session lookup failed:",
        error
      );

      redirect("/sign-in");
    }

    // --------------------------------------------------
    // 2. No valid session
    // --------------------------------------------------

    if (!session?.user?.id || !session.user.email) {
      console.log(
        "[Dashboard Auth] No authenticated session"
      );

      redirect("/sign-in");
    }

    const email = session.user.email
      .trim()
      .toLowerCase();

    // --------------------------------------------------
    // 3. Find/create application user
    // --------------------------------------------------

    try {
      const users = db.collection("users");

      let user = await users.findOne({ email });

      // ------------------------------------------------
      // 4. Create application user
      // ------------------------------------------------

      if (!user) {
        const now = new Date();

        const role: UserRole = ADMIN_EMAILS.includes(email)
          ? "admin"
          : "customer";

        const newUser = {
          name:
            session.user.name?.trim() ||
            email.split("@")[0],

          email,

          image: session.user.image || "",

          phone: "",

          address: "",

          role,

          createdAt: now,

          updatedAt: now,
        };

        const result = await users.insertOne(newUser);

        user = {
          _id: result.insertedId,
          ...newUser,
        };

        console.log(
          "[Dashboard Auth] Application user created"
        );
      }

      // ------------------------------------------------
      // 5. Sync admin role
      // ------------------------------------------------

      if (
        ADMIN_EMAILS.includes(email) &&
        user.role !== "admin"
      ) {
        await users.updateOne(
          { _id: user._id },
          {
            $set: {
              role: "admin",
              updatedAt: new Date(),
            },
          }
        );

        user = {
          ...user,
          role: "admin",
        };

        console.log(
          "[Dashboard Auth] Admin role synchronized"
        );
      }

      // ------------------------------------------------
      // 6. Return Dashboard user
      // ------------------------------------------------

      return serializeUser(
        user as Record<string, unknown>
      );
    } catch (error) {
      console.error(
        "[Dashboard Auth] MongoDB user lookup failed:",
        error
      );

      /*
       * Do NOT create a fake customer user when
       * MongoDB fails.
       *
       * The session is valid, but the application user
       * could not be verified safely.
       */
      throw new Error(
        "Unable to load Dashboard user."
      );
    }
  }
);

/**
 * Require an authenticated Dashboard user.
 *
 * This is kept as a separate helper for role-based
 * protected pages.
 */
export async function requireDashboardUser(): Promise<DashboardUser> {
  return getDashboardUser();
}

/**
 * Require one of the specified application roles.
 *
 * Example:
 *
 * await requireRole(["admin"]);
 *
 * await requireRole(["owner", "admin"]);
 */
export async function requireRole(
  roles: UserRole[]
): Promise<DashboardUser> {
  const user = await getDashboardUser();

  if (!roles.includes(user.role)) {
    redirect("/dashboard?denied=1");
  }

  return user;
}
