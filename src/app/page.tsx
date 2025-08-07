"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AutomataGraph from "@/components/AutomataGraph";
import { EstadoClinico, EventoClinico, transiciones, obtenerSiguienteEstado } from "@/lib/automataLogic";
import { datosClinicos } from "@/lib/datosClinicos";

type HistorialItem = {
  estado: EstadoClinico;
  descripcion: string;
  eventoProximo: EventoClinico | null;
  explicacion: string;
  fecha: string;
};

export default function HomePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [estado, setEstado] = useState<EstadoClinico>("diagnostico");
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [visitados, setVisitados] = useState<Set<EstadoClinico>>(new Set());
  const [notasPorEstado, setNotasPorEstado] = useState<Partial<Record<EstadoClinico, string>>>({});

  // Cargar sesión al iniciar
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/auth");
        return;
      }
      setUserId(data.user.id);

      const { data: paciente, error } = await supabase
        .from("pacientes")
        .select("*")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error cargando paciente:", error.message);
        return;
      }

      if (paciente) {
        setEstado(paciente.estado_actual);
        setHistorial(paciente.historial || []);
        const visitadosSet = new Set<EstadoClinico>(
          (paciente.historial || []).map((h: any) => h.estado)
        );
        visitadosSet.add(paciente.estado_actual);
        setVisitados(visitadosSet);
      }
    });
  }, [router]);

  // Manejar transición de estado (sin actualizar historial todavía)
  const [eventoPrevio, setEventoPrevio] = useState<EventoClinico | null>(null);
  const manejarEvento = (evento: EventoClinico, nuevoEstado: EstadoClinico) => {
    const nuevosVisitados = new Set(visitados);
    nuevosVisitados.add(nuevoEstado);
    setEstado(nuevoEstado);
    setVisitados(nuevosVisitados);
    setEventoPrevio(evento);
  };

  const deshacerUltimo = () => {
    if (historial.length === 0) return;

    const nuevoHistorial = [...historial];
    nuevoHistorial.pop();
    const ultimoEstado = nuevoHistorial.at(-1)?.estado || "diagnostico";
    setEstado(ultimoEstado);
    setHistorial(nuevoHistorial);

    const nuevosVisitados = new Set(nuevoHistorial.map((h) => h.estado));
    nuevosVisitados.add(ultimoEstado);
    setVisitados(nuevosVisitados);
  };

  const guardarHistorial = async () => {
    if (!userId) return;

    const estadoAnterior = historial[historial.length - 1]?.estado || "diagnostico";
    const evento = eventoPrevio || "iniciar_tratamiento";

    const { explicacion } = obtenerSiguienteEstado(estadoAnterior, evento);
    
    const nuevaEntrada: HistorialItem = {
      estado,
      descripcion: notasPorEstado[estado] || "",
      eventoProximo: evento,
      explicacion,
      fecha: new Date().toISOString(),
    };

    let nuevoHistorial: HistorialItem[] = [];

    const ultimo = historial[historial.length - 1];

    if (ultimo && ultimo.estado === estado) {
      // Actualizar la última entrada
      nuevoHistorial = [...historial];
      nuevoHistorial[nuevoHistorial.length - 1] = nuevaEntrada;
    } else {
      // Agregar nueva entrada
      nuevoHistorial = [...historial, nuevaEntrada];
    }

    setHistorial(nuevoHistorial);

    const { error } = await supabase
      .from("pacientes")
      .update({
        estado_actual: estado,
        historial: nuevoHistorial,
      })
      .eq("user_id", userId);

    if (error) {
      alert("Error al guardar en la base de datos.");
      console.error(error.message);
    }
  };

  if (!userId) {
    return (
      <main className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Cargando sesión...</h1>
        <p className="text-gray-600">Redirigiendo a login si no estás autenticado.</p>
      </main>
    );
  }

  const eventos = Object.entries(transiciones[estado] || {});

  return (
    <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Columna principal */}
      <div className="md:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Evolución Clínica</h1>
        </div>

        {/* Estado actual */}
        <div className="mb-6 p-4 rounded-2xl shadow bg-blue-50">
          <h2 className="text-xl font-semibold mb-2">Estado actual</h2>
          <p className="text-lg uppercase font-bold">{estado}</p>
        </div>

        {/* Grafo */}
        <AutomataGraph
          estadoActual={estado}
          visitados={Array.from(visitados)}
          onChangeEstado={(nuevoEstado, evento) => manejarEvento(evento as EventoClinico, nuevoEstado)}
        />

        {/* Eventos */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Eventos clínicos</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {eventos.map(([evento, destino]) => (
              <button
                key={evento}
                onClick={() => manejarEvento(evento as EventoClinico, destino as EstadoClinico)}
                className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow transition"
              >
                {evento}
              </button>
            ))}
          </div>

          {/* Controles adicionales */}
          <div className="flex gap-3">
            <button
              onClick={deshacerUltimo}
              className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 shadow transition"
            >
              ⬅️ Deshacer
            </button>

            <button
              onClick={guardarHistorial}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow transition"
            >
              💾 Guardar
            </button>
          </div>
        </div>

        {/* Historial */}
        <div className="mb-6 p-4 rounded-2xl shadow bg-gray-50">
          <h2 className="text-xl font-semibold mb-3">Historial</h2>
          {historial.length === 0 ? (
            <p className="text-gray-500">Sin transiciones aún.</p>
          ) : (
            <ul className="space-y-2">
              {historial.map((h, i) => (
                <li key={i} className="p-3 border rounded-lg bg-white shadow-sm">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Estado:</span> {h.estado}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Descripción:</span> {h.descripcion || "—"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Explicación:</span> {h.explicacion}
                  </p>
                  <p className="text-xs text-gray-500">{h.fecha}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Aside derecho */}
      <aside className="p-4 rounded-2xl shadow bg-white h-fit space-y-4 sticky top-6 self-start">
        <h2 className="text-xl font-semibold mb-3">Datos clínicos</h2>
        <h3 className="text-lg font-bold">{datosClinicos[estado].titulo}</h3>
        <p className="text-sm text-gray-700 mb-4">{datosClinicos[estado].descripcion}</p>

        {/* Extra paneles */}
        {datosClinicos[estado].tratamientos && (
          <>
            <h4 className="font-semibold text-sm mb-1">Tratamientos recomendados:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {datosClinicos[estado].tratamientos!.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </>
        )}

        {datosClinicos[estado].pruebas && (
          <>
            <h4 className="font-semibold text-sm mb-1">Pruebas a realizar:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {datosClinicos[estado].pruebas!.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </>
        )}

        {datosClinicos[estado].indicadores && (
          <>
            <h4 className="font-semibold text-sm mb-1">Indicadores clave:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {datosClinicos[estado].indicadores!.map((ind) => (
                <li key={ind.label}>
                  <span className="font-medium">{ind.label}: </span>
                  {ind.valor}
                </li>
              ))}
            </ul>
          </>
        )}

        {datosClinicos[estado].notas && (
          <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-xs rounded">
            <strong>Nota:</strong> {datosClinicos[estado].notas}
          </div>
        )}

        {/* Descripción personalizada */}
        <div className="mt-4">
          <h3 className="font-semibold text-sm mb-1">Descripción específica del procedimiento actual</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring focus:border-blue-300 resize-none"
            placeholder="Agregar detalles específicos sobre las acciones aplicadas al tratamiento clínico del paciente..."
            value={notasPorEstado[estado] || ""}
            onChange={(e) =>
              setNotasPorEstado((prev) => ({
                ...prev,
                [estado]: e.target.value,
              }))
            }
            rows={4}
          />
        </div>
      </aside>
    </main>
  );
}
