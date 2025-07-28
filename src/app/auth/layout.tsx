// src/app/auth/layout.tsx
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold text-blue-700">SEC Project</h1>
        <p className="text-gray-600 text-sm">
          Bienvenido al <strong>Sistema de Evolución Clínica</strong>.
        </p>

        {/* Aquí se renderizarán las páginas específicas */}
        {children}

        <p className="text-xs text-gray-400">
          © 2025 SEC Project. Todos los derechos reservados.
        </p>
      </div>
    </main>
  );
}
