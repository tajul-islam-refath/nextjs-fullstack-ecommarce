import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";

export async function getGuestSessionToken() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  return (
    cookieStore.get("guest_session")?.value ||
    headerStore.get("x-guest-session")
  );
}

export async function trackGuestSession() {
  const token = await getGuestSessionToken();
  if (!token) return;

  try {
    // Upsert the session to ensure it exists and update expiry
    await prisma.guestSession.upsert({
      where: { sessionToken: token },
      update: {
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      create: {
        sessionToken: token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  } catch (error) {
    console.error("Failed to track guest session:", error);
  }
}
