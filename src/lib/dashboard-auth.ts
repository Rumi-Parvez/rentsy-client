import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

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

export const getDashboardUser = cache(async (): Promise<DashboardUser> => {
  // --------------------------------------------------
  // 1. Get the REAL Better Auth session
  // --------------------------------------------------
  let session;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Better Auth session lookup failed:", error);
    throw error;
  }

  // --------------------------------------------------
  // 2. No valid session
  // --------------------------------------------------
  if (!session?.user?.id || !session.user.email) {
    throw new Error("Dashboard request has no authenticated Better Auth session.");
  }

  const email = session.user.email.trim().toLowerCase();

  // --------------------------------------------------
  // 3. Find/create the application user in MongoDB
  // --------------------------------------------------
  try {
    const users = db.collection("users");

    let user = await users.findOne({ email });

    // ------------------------------------------------
    // 4. User does not exist -> create user
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
    }

    // ------------------------------------------------
    // 5. Keep ADMIN_EMAILS synced with admin role
    // ------------------------------------------------
    else if (
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
    }

    // ------------------------------------------------
    // 6. Return the application user
    // ------------------------------------------------
    return serializeUser(
      user as Record<string, unknown>
    );
  } catch (error) {
    console.error("Dashboard user lookup failed:", error);

    // IMPORTANT:
    // If MongoDB fails, do NOT give admin/owner privileges.
    // The Better Auth session is valid, but application
    // user/role data could not be verified safely.

    return {
      _id: String(session.user.id),
      name: session.user.name || "User",
      email,

      image: session.user.image || "",

      phone: "",

      address: "",

      role: "customer",

      createdAt: undefined,
      updatedAt: undefined,
    };
  }
});

export async function requireRole(
  roles: UserRole[]
) {
  const user = await getDashboardUser();

  if (!roles.includes(user.role)) {
    redirect("/dashboard?denied=1");
  }

  return user;
}
