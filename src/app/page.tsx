"use client";

import { useState } from "react";
import {
  estadoInicial,
  obtenerSiguienteEstado,
  EstadoClinico,
  EventoClinico,
  transiciones,
} from "../lib/automataLogic";
import AutomataGraph from "../components/AutomataGraph";

export default function HomePage() {
  // Estado actual del paciente
  const [estado, setEstado] = useState<EstadoClinico>(estadoInicial);

  // Historial de transiciones con explicación
  const [historial, setHistorial] = useState<
    { evento: EventoClinico; nuevoEstado: EstadoClinico; explicacion: string }[]
  >([]);

  // Lista de eventos posibles
  const eventos = Object.keys(transiciones[estado] || {}) as EventoClinico[];

  // Manejar evento desde botones
  const manejarEvento = (evento: EventoClinico) => {
    const resultado = obtenerSiguienteEstado(estado, evento);
    setEstado(resultado.nuevoEstado);
    setHistorial((prev) => [
      ...prev,
      {
        evento,
        nuevoEstado: resultado.nuevoEstado,
        explicacion: resultado.explicacion,
      },
    ]);
  };

  // Derivar estados visitados (incluye el inicial y todos los nuevos)
  const estadosVisitados = new Set<EstadoClinico>([estadoInicial]);
  historial.forEach((h) => estadosVisitados.add(h.nuevoEstado));

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        Evolución clínica con autómatas finitos
      </h1>

      {/* Grafo del autómata */}
      <AutomataGraph
        estadoActual={estado}
        visitados={Array.from(estadosVisitados)}
        onChangeEstado={(nuevoEstado, evento) => {
          const explicacion = `Desde el estado "${estado}", al ocurrir el evento "${evento}", el nuevo estado es "${nuevoEstado}".`;
          setEstado(nuevoEstado);
          setHistorial((prev) => [
            ...prev,
            { evento: evento as EventoClinico, nuevoEstado, explicacion },
          ]);
        }}
      />

      {/* Estado actual */}
      <div className="mb-6 p-4 rounded-2xl shadow bg-blue-50">
        <h2 className="text-xl font-semibold mb-2">Estado actual</h2>
        <p className="text-lg uppercase">
          <span className="font-bold">{estado}</span>
        </p>
      </div>

      {/* Botones de eventos */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Eventos clínicos</h2>
        <div className="flex flex-wrap gap-3">
          {eventos.map((evento) => (
            <button
              key={evento}
              onClick={() => manejarEvento(evento)}
              className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow transition"
            >
              {evento}
            </button>
          ))}
        </div>
      </div>

      {/* Historial */}
      <div className="mb-6 p-4 rounded-2xl shadow bg-gray-50">
        <h2 className="text-xl font-semibold mb-3">Historial de transiciones</h2>
        {historial.length === 0 ? (
          <p className="text-gray-500">No hay transiciones registradas aún.</p>
        ) : (
          <ul className="space-y-2">
            {historial.map((item, index) => (
              <li
                key={index}
                className="p-3 border rounded-lg bg-white shadow-sm"
              >
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Evento:</span> {item.evento}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Nuevo estado:</span>{" "}
                  {item.nuevoEstado}
                </p>
                <p className="text-sm text-gray-500 italic">
                  {item.explicacion}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Información */}
      <div className="mt-8 p-4 rounded-2xl bg-yellow-50 shadow">
        <h2 className="text-xl font-semibold mb-2">Información</h2>
        <p className="text-sm text-gray-700">
          Este sistema simula la evolución clínica de un paciente con cáncer de
          piel usando un autómata finito simbólico. Selecciona eventos para ver
          cómo cambia el estado.
        </p>
      </div>
    </main>
  );
}
