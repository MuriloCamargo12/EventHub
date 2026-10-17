import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl">
      <p className="text-sm font-medium uppercase tracking-wide text-stone-500">404</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-950">
        Página não encontrada
      </h1>
      <p className="mt-3 text-stone-600">
        Esse endereço não existe, ou o evento já saiu da lista.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-stone-900 px-4 py-2 text-sm text-stone-50 hover:bg-stone-700"
      >
        Voltar para os eventos
      </Link>
    </div>
  );
}
