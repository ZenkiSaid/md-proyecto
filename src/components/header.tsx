"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (!loggedIn) return null; // oculta el header si no hay sesión

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
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition"
        >
          Cerrar sesión
        </button>
    </div>
  );
}
