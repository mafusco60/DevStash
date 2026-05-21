"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";

export type AuthActionState =
  | { error: string; code?: string; email?: string }
  | undefined;

export async function authenticate(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";
  const email = (formData.get("email") as string) || "";

  try {
    await signIn("credentials", {
      email,
      password: formData.get("password"),
      redirectTo: callbackUrl,
    });
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      const code = "code" in error ? (error.code as string | undefined) : undefined;
      if (code === "EmailNotVerified") {
        return {
          error: "Please verify your email before signing in.",
          code,
          email,
        };
      }
      if (error.type === "CredentialsSignin") {
        return { error: "Invalid email or password." };
      }
      return { error: "Something went wrong. Please try again." };
    }
    throw error;
  }
}

export async function signInWithGithub(formData: FormData) {
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";
  await signIn("github", { redirectTo: callbackUrl });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/sign-in" });
}
