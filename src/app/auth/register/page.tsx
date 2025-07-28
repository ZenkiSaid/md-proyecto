"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar edad
    const edadNum = parseInt(edad, 10);
    if (isNaN(edadNum) || edadNum < 0 || edadNum > 99) {
      setMensaje("Por favor ingresa una edad válida (0–99).");
      return;
    }

    if (!usuario.trim()) {
      setMensaje("Por favor ingresa un nombre de usuario.");
      return;
    }

    setMensaje("Creando cuenta...");

    // Usaremos "usuario" como email ficticio para auth
    const pseudoEmail = `${usuario}@example.com`;

    const { data, error } = await supabase.auth.signUp({
      email: pseudoEmail,
      password,
    });

    if (error) {
      setMensaje("Error: " + error.message);
      return;
    }

    if (data.user) {
      // Insertar datos en la tabla pacientes
      const { error: insertError } = await supabase.from("pacientes").insert([
        {
          user_id: data.user.id,
          nombre,
          edad: edadNum,
          estado_actual: "diagnostico",
          historial: [],
        },
      ]);

      if (insertError) {
        setMensaje("Error al guardar paciente: " + insertError.message);
        return;
      }

      setMensaje("Registro exitoso. Ya puedes iniciar sesión.");
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 text-left">
      <input
        type="text"
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Edad (0–99)"
        value={edad}
        onChange={(e) => setEdad(e.target.value)}
        className="w-full p-2 border rounded"
        maxLength={2}
        pattern="[0-9]*"
        required
      />

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
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        Registrar
      </button>

      {mensaje && <p className="mt-4 text-sm text-gray-700">{mensaje}</p>}
    </form>
  );
}
