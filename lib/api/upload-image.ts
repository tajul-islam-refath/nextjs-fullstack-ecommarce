"use server";

import { cookies } from "next/headers";
import { getBaseUrl } from "../config";

export async function uploadImage(formData: FormData) {
  const cookieStore = await cookies();
  const response = await fetch(`${getBaseUrl()}/api/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Upload failed");
  }

  return data;
}
