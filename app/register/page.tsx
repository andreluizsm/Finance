import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Finance</h1>
          <p className="text-gray-600">Crie sua conta</p>
        </div>
        <RegisterForm />
        <div className="text-center mt-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Já tem uma conta? Faça login
          </Link>
        </div>
      </div>
    </div>
  )
}
