"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react"; // Usa lucide-react para el icono si lo tienes instalado

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

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

      {/* Navegación */}
      <div className="flex items-center gap-4">
        <ul className="flex items-center gap-4">
          <li>
            <Link href="/">
              Home
            </Link>
          </li>
          <li>
            <Link href="/posts">
              About
            </Link>
          </li>
        </ul>

        {/* Botón del menú hamburguesa */}
        <button onClick={toggleMenu} className="text-blue-600 hover:text-blue-800">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Menú desplegable */}
      {menuOpen && (
        <div className="absolute right-5 top-[65px] bg-white shadow-md border rounded-md py-2 px-4 z-50">
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link href="/simulador" className="hover:underline" onClick={() => setMenuOpen(false)}>
                Simulador
              </Link>
            </li>
            <li>
              <Link href="/reglas" className="hover:underline" onClick={() => setMenuOpen(false)}>
                Reglas
              </Link>
            </li>
            <li>
              <Link href="/casos" className="hover:underline" onClick={() => setMenuOpen(false)}>
                Casos
              </Link>
            </li>
            <li>
              <Link href="/documentacion" className="hover:underline" onClick={() => setMenuOpen(false)}>
                Documentación
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
