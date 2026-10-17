import Link from "next/link";
import { AuthForm } from "../../components/auth-form";

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Cadastrar</h1>
      <p className="mt-2 text-stone-600">
        Criar a conta não entra na aplicação. Depois do cadastro, o próximo passo é o login.
      </p>
      <div className="mt-8">
        <AuthForm mode="register" />
      </div>
      <p className="mt-6 text-sm text-stone-600">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-stone-950 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
