"use client";

import { useState } from "react";

export default function Home() {
  const [estado, setEstado] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    tipoCancer: "",
    estadio: "",
    evento: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const simular = () => {
    // Lógica simulada muy simple solo para mostrar comportamiento
    if (formData.evento.toLowerCase() === "inicio") {
      setEstado("Tratamiento");
    } else if (formData.evento.toLowerCase() === "respuesta completa") {
      setEstado("Remisión");
    } else if (formData.evento.toLowerCase() === "recaída") {
      setEstado("Recaída");
    } else {
      setEstado("Estado no reconocido");
    }
  };

  return (
    <div className="max-w-xl mx-auto pt-12 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center">Bienvenido</h1>
      <p className="text-center text-base mb-6">
        Ingrese los datos clínicos del paciente para iniciar la simulación
      </p>

      <div className="space-y-4 bg-white p-6 rounded-xl shadow border border-gray-200">
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de cáncer</label>
          <input
            type="text"
            name="tipoCancer"
            value={formData.tipoCancer}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Estadio</label>
          <input
            type="text"
            name="estadio"
            value={formData.estadio}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Evento clínico</label>
          <input
            type="text"
            name="evento"
            value={formData.evento}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <button
          onClick={simular}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
        >
          Iniciar simulación
        </button>

        {estado && (
          <div className="mt-4 text-center text-lg">
            <strong>Estado actual:</strong> {estado}
          </div>
        )}
      </div>
    </div>
  );
}
