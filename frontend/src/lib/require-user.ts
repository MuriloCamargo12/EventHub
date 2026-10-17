import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError } from "./api/client";
import { getMe } from "./api/users";

export async function requireUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/cadastro");
  }

  try {
    const user = await getMe(session);
    return { user, session };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/cadastro");
    }
    throw error;
  }
}
