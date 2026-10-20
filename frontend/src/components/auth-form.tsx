"use client";

import { loginUser, registerUser } from "@/lib/api/users";
import { useNotice } from "@/lib/use-notice";

const inputClass = "rounded-xl border border-stone-300 px-3 py-2 text-stone-950";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { notice, showNotice, showError, clearNotice } = useNotice();
  const isRegister = mode === "register";

  async function onSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    clearNotice();
    const formData = new FormData(formEvent.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      if (isRegister) {
        const name = formData.get("name") as string;
        const user = await registerUser({ name, email, password });
        showNotice(`Conta criada, ${user.name}. Entre para continuar.`);
        return;
      }
      await loginUser({ email, password });
      window.location.assign("/");
    } catch {
      showError(isRegister ? "Não foi possível cadastrar." : "E-mail ou senha inválidos");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-sm gap-4">
      {isRegister ? (
        <label className="grid gap-1 text-sm text-stone-700">
          Nome
          <input name="name" required minLength={1} className={inputClass} />
        </label>
      ) : null}
      <label className="grid gap-1 text-sm text-stone-700">
        E-mail
        <input name="email" type="email" required className={inputClass} />
      </label>
      <label className="grid gap-1 text-sm text-stone-700">
        Senha
        <input name="password" type="password" required minLength={6} className={inputClass} />
      </label>
      <button
        type="submit"
        className="w-fit rounded-full bg-stone-900 px-4 py-2 text-sm text-stone-50 hover:bg-stone-700"
      >
        {isRegister ? "Cadastrar" : "Entrar"}
      </button>
      {notice ? <p className="text-sm text-stone-600">{notice}</p> : null}
    </form>
  );
}
