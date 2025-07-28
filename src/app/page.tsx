"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AutomataGraph from "@/components/AutomataGraph";
import { EstadoClinico, EventoClinico } from "@/lib/automataLogic";
import { datosClinicos } from "@/lib/datosClinicos";

type HistorialItem = {
  evento: EventoClinico;
  nuevoEstado: EstadoClinico;
  explicacion: string;
  fecha: string;
};

export default function HomePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [estado, setEstado] = useState<EstadoClinico>("diagnostico");
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [visitados, setVisitados] = useState<Set<EstadoClinico>>(new Set());

  // Cargar sesión al iniciar
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        // No hay sesión, redirigimos a login
        router.push("/auth");
        return;
      }
      setUserId(data.user.id);

      // Cargar datos del paciente
      const { data: paciente, error } = await supabase
        .from("pacientes")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      if (error) {
        console.error("Error cargando paciente:", error.message);
        return;
      }

      if (paciente) {
        setEstado(paciente.estado_actual);
        setHistorial(paciente.historial || []);
        const visitadosSet = new Set<EstadoClinico>(
          (paciente.historial || []).map((h: any) => h.nuevoEstado)
        );
        visitadosSet.add(paciente.estado_actual);
        setVisitados(visitadosSet);
      }
    });
  }, [router]);

  // Función para actualizar estado en Supabase
  const manejarEvento = async (evento: EventoClinico, nuevoEstado: EstadoClinico) => {
    const nuevaEntrada: HistorialItem = {
      evento,
      nuevoEstado,
      explicacion: `Desde ${estado} con evento ${evento} → ${nuevoEstado}`,
      fecha: new Date().toISOString(),
    };

    const nuevoHistorial = [...historial, nuevaEntrada];
    const nuevosVisitados = new Set(visitados);
    nuevosVisitados.add(nuevoEstado);

    setEstado(nuevoEstado);
    setHistorial(nuevoHistorial);
    setVisitados(nuevosVisitados);

    if (userId) {
      const { error } = await supabase
        .from("pacientes")
        .update({
          estado_actual: nuevoEstado,
          historial: nuevoHistorial,
        })
        .eq("user_id", userId);

      if (error) {
        console.error("Error actualizando paciente:", error.message);
      }
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

  // Eventos posibles desde el estado actual
  const eventos = Object.entries({
    iniciar_tratamiento: "tratamiento",
    respuesta_positiva: "remision",
    respuesta_negativa: "recaida",
    recaida_detectada: "recaida",
    reiniciar_tratamiento: "tratamiento",
    cuidados_paliativos: "paliativos",
    alta_medica: "curado",
    fallecimiento: "muerte",
  }).filter(([evento, destino]) => {
    // Mostrar solo los válidos desde este estado
    // puedes cruzarlo con automataLogic si quieres
    return true;
  });

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
          onChangeEstado={(nuevoEstado, evento) =>
            manejarEvento(evento as EventoClinico, nuevoEstado)
          }
        />

        {/* Botones de eventos */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Eventos clínicos</h2>
          <div className="flex flex-wrap gap-3">
            {eventos.map(([evento, destino]) => (
              <button
                key={evento}
                onClick={() =>
                  manejarEvento(evento as EventoClinico, destino as EstadoClinico)
                }
                className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow transition"
              >
                {evento}
              </button>
            ))}
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
                    <span className="font-bold">Evento:</span> {h.evento}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Nuevo estado:</span> {h.nuevoEstado}
                  </p>
                  <p className="text-xs text-gray-500">{h.fecha}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Panel lateral */}
      <aside className="p-4 rounded-2xl shadow bg-white h-fit space-y-4 sticky top-6 self-start">
        <h2 className="text-xl font-semibold mb-3">Datos clínicos</h2>
        <h3 className="text-lg font-bold">{datosClinicos[estado].titulo}</h3>
        <p className="text-sm text-gray-700 mb-4">{datosClinicos[estado].descripcion}</p>

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
      </aside>
    </main>
  );
}
