import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { getMe } from "@/lib/api/users";
import { LogoutButton } from "./logout-button";
import { Skeleton } from "./skeletons";

const links = [
  { href: "/", label: "Eventos" },
  { href: "/reservations", label: "Minhas reservas" },
  { href: "/events/new", label: "Criar evento" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-stone-50">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-stone-900">
          EventHub
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone-700">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-stone-950">
              {link.label}
            </Link>
          ))}
          <Suspense fallback={<Skeleton className="h-8 w-24 rounded-full" />}>
            <HeaderSession />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}

async function HeaderSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  let user = null;

  if (session) {
    try {
      user = await getMe(session);
    } catch {
      user = null;
    }
  }

  if (user) {
    return (
      <>
        <span className="text-stone-950">{user.name}</span>
        <LogoutButton />
      </>
    );
  }

  return (
    <>
      <Link href="/login" className="hover:text-stone-950">
        Entrar
      </Link>
      <Link
        href="/cadastro"
        className="rounded-full bg-stone-900 px-3 py-1.5 text-stone-50 hover:bg-stone-700"
      >
        Cadastrar
      </Link>
    </>
  );
}