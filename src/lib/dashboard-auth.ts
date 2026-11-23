import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/lib/auth";
import type { DashboardUser, UserRole } from "@/types/dashboard";

const VERIFIED_USER_HEADER = "x-rentsy-verified-user";

type VerifiedSessionUser = {
  id: string;
  email: string;
  name: string;
  image: string;
};

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

function serializeUser(user: Record<string, unknown>): DashboardUser {
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

export async function getDashboardUser(): Promise<DashboardUser | null> {
  const encodedUser = (await headers()).get(VERIFIED_USER_HEADER);

  if (!encodedUser) {
    return null;
  }

  let sessionUser: VerifiedSessionUser;

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(encodedUser));

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("id" in parsed) ||
      typeof parsed.id !== "string" ||
      !("email" in parsed) ||
      typeof parsed.email !== "string"
    ) {
      return null;
    }

    sessionUser = {
      id: parsed.id,
      email: parsed.email,
      name:
        "name" in parsed && typeof parsed.name === "string"
          ? parsed.name
          : "",
      image:
        "image" in parsed && typeof parsed.image === "string"
          ? parsed.image
          : "",
    };
  } catch (error) {
    console.error("Verified dashboard session header is invalid:", error);
    return null;
  }

  const email = sessionUser.email.toLowerCase();

  try {
    const users = db.collection("users");

    let user = await users.findOne({ email });

    if (!user) {
      const now = new Date();

      const role: UserRole = ADMIN_EMAILS.includes(email)
        ? "admin"
        : "customer";

      const document = {
        name: sessionUser.name.trim() || email.split("@")[0],
        email,
        image: sessionUser.image,
        phone: "",
        address: "",
        role,
        createdAt: now,
        updatedAt: now,
      };

      const result = await users.insertOne(document);

      user = { _id: result.insertedId, ...document };
    } else if (
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

      user = { ...user, role: "admin" };
    }

    return serializeUser(user as Record<string, unknown>);
  } catch (error) {
    console.error("Dashboard user lookup failed:", error);

    // Never elevate access when the database cannot be read.
    // The session identity is still trusted for name/email only.
    return {
      _id: sessionUser.id,
      name: sessionUser.name || "User",
      email,
      image: sessionUser.image,
      phone: "",
      address: "",
      role: ADMIN_EMAILS.includes(email) ? "admin" : "customer",
    };
  }
}

export async function requireDashboardUser() {
  const user = await getDashboardUser();

  if (!user) {
    throw new Error("Dashboard request is missing a verified proxy session.");
  }

  return user;
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireDashboardUser();

  if (!roles.includes(user.role)) {
    redirect("/dashboard?denied=1");
  }

  return user;
}
