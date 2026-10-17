import Link from "next/link";
import { AuthForm } from "../../components/auth-form";

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Entrar</h1>
      <p className="mt-2 text-stone-600">Use o e-mail e a senha da sua conta.</p>
      <div className="mt-8">
        <AuthForm mode="login" />
      </div>
      <p className="mt-6 text-sm text-stone-600">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-stone-950 hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
