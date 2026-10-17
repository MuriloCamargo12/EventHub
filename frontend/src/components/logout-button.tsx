"use client";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/api/users";
export function LogoutButton() {
  const router = useRouter();
  async function onLogout() {
    await logoutUser();
    router.refresh();
  }
  return (
    <button type="button" onClick={onLogout} className="hover:text-stone-950">
      Sair
    </button>
  );
}