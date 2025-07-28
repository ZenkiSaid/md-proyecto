"use client";

import { useRouter } from "next/navigation";

export default function AuthLandingPage() {
  const router = useRouter();

  return (
    <main>
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        <p className="text-gray-600 text-sm">
          Una herramienta
          interactiva para modelar la evolución de pacientes con cáncer de piel mediante
          autómatas finitos. 
        </p>

        {/* Imagen opcional */}
        <div className="flex justify-center">
          <img
            src="/globe.svg"
            alt="Logo"
            className="w-24 h-24 object-contain"
          />
        </div>

        {/* Botones */}
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => router.push("/auth/login")}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => router.push("/auth/register")}
            className="px-4 py-2 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
          >
            Registrarse
          </button>
        </div>
      </div>
    </main>
  );
}
