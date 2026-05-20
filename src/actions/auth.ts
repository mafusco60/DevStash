"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";

export type AuthActionState =
  | { error: string }
  | undefined;

export async function authenticate(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: callbackUrl,
    });
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
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
