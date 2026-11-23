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
  let session;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Dashboard session lookup failed:", error);
    return null;
  }

  if (!session?.user?.email) {
    return null;
  }

  const email = session.user.email.toLowerCase();

  try {
    const users = db.collection("users");

    let user = await users.findOne({ email });

    if (!user) {
      const now = new Date();

      const role: UserRole = ADMIN_EMAILS.includes(email)
        ? "admin"
        : "customer";

      const document = {
        name: session.user.name?.trim() || email.split("@")[0],
        email,
        image: session.user.image || "",
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
      _id: String(session.user.id ?? ""),
      name: session.user.name || "User",
      email,
      image: session.user.image || "",
      phone: "",
      address: "",
      role: ADMIN_EMAILS.includes(email) ? "admin" : "customer",
    };
  }
}

export async function requireDashboardUser() {
  const user = await getDashboardUser();

  if (!user) {
    redirect("/sign-in");
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
