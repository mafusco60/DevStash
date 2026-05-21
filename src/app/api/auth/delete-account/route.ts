import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const deleteSchema = z.object({
  confirm: z.string(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  const normalizedConfirm = parsed.data.confirm.trim().toLowerCase();
  const normalizedEmail = session.user.email.toLowerCase();
  if (normalizedConfirm !== normalizedEmail) {
    return NextResponse.json(
      {
        success: false,
        error: "Confirmation does not match your email address",
      },
      { status: 400 }
    );
  }

  try {
    // Cascade rules on the schema handle Account, Session, Item (and its
    // ItemTag join rows), custom ItemType, Collection, Tag, and
    // UserVerificationToken in a single statement. System ItemTypes
    // (userId is null) are not touched.
    await prisma.user.delete({ where: { id: session.user.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[auth/delete-account] unexpected error", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
