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

export const getDashboardUser = cache(
  async (): Promise<DashboardUser> => {
    let session;

    /*
     * STEP 1
     * Real Better Auth session validation.
     */
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

    /*
     * No valid authenticated session.
     */
    if (!session?.user?.id || !session.user.email) {
      console.log(
        "[Dashboard Auth] No authenticated session"
      );

      redirect("/sign-in");
    }

    const email = session.user.email
      .trim()
      .toLowerCase();

    /*
     * STEP 2
     * Load the application user from MongoDB.
     */
    try {
      const users = db.collection("users");

      let user = await users.findOne({
        email,
      });

      /*
       * Create application user if it does not exist.
       */
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

          image:
            session.user.image || "",

          phone: "",
          address: "",

          role,

          createdAt: now,
          updatedAt: now,
        };

        const result = await users.insertOne(
          newUser
        );

        user = {
          _id: result.insertedId,
          ...newUser,
        };

        console.log(
          "[Dashboard Auth] Application user created"
        );
      }

      /*
       * Keep configured admin emails as admin.
       */
      if (
        ADMIN_EMAILS.includes(email) &&
        user.role !== "admin"
      ) {
        await users.updateOne(
          {
            _id: user._id,
          },
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

      /*
       * STEP 3
       * Return normalized application user.
       */
      return serializeUser(
        user as Record<string, unknown>
      );
    } catch (error) {
      console.error(
        "[Dashboard Auth] MongoDB user lookup failed:",
        error
      );

      throw new Error(
        "Unable to load Dashboard user."
      );
    }
  }
);

/*
 * Authentication helper.
 */
export async function requireDashboardUser(): Promise<DashboardUser> {
  return getDashboardUser();
}

/*
 * Authentication + authorization helper.
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