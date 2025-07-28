"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario.trim()) {
      setMensaje("Ingresa tu nombre de usuario.");
      return;
    }

    const pseudoEmail = `${usuario}@example.com`;

    setMensaje("Iniciando sesión...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: pseudoEmail,
      password,
    });

    if (error) {
      setMensaje("Error: " + error.message);
      return;
    }

    if (data.user) {
      setMensaje("Login exitoso. Redirigiendo...");
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 text-left">
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Iniciar sesión
      </button>

      {mensaje && <p className="mt-4 text-sm text-gray-700">{mensaje}</p>}
    </form>
  );
}
