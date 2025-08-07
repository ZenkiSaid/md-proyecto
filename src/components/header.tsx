"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [nombre, setNombre] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionAndUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setLoggedIn(!!session);

      if (session?.user) {
        const { data: paciente, error } = await supabase
          .from("pacientes")
          .select("nombre")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (paciente && !error) {
          setNombre(paciente.nombre);
        }
      }
    };

    fetchSessionAndUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
      if (session?.user) {
        supabase
          .from("pacientes")
          .select("nombre")
          .eq("user_id", session.user.id)
          .maybeSingle()
          .then(({ data, error }) => {
            if (data && !error) {
              setNombre(data.nombre);
            }
          });
      } else {
        setNombre(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (!loggedIn) return null;

  return (
    <div className="border-b border-black/10 px-5 py-3 flex items-center justify-between relative">
      {/* Título y subtítulo */}
      <div>
        <h1 className="text-xl font-semibold">
          Simulador de evolución clínica para pacientes con cáncer de piel
        </h1>
        <p className="text-sm text-gray-600">
          Modelo simbólico basado en autómatas finitos para apoyar decisiones terapéuticas
        </p>
      </div>

      {/* Usuario + botón */}
      <div className="flex items-center gap-4">
        {nombre && (
          <span className="text-sm text-gray-800 font-medium truncate max-w-[150px]">
            👤 {nombre}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
