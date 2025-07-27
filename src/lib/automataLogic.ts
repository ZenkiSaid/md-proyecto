// Definimos los estados posibles
export type EstadoClinico =
  | "diagnostico"
  | "tratamiento"
  | "remision"
  | "recaida"
  | "paliativos"
  | "curado"
  | "muerte"; 

// Definimos los eventos que pueden ocurrir
export type EventoClinico =
  | "iniciar_tratamiento"
  | "respuesta_positiva"
  | "respuesta_negativa"
  | "recaida_detectada"
  | "reiniciar_tratamiento"
  | "cuidados_paliativos"
  | "alta_medica"
  | "fallecimiento";

// Estado inicial
export const estadoInicial: EstadoClinico = "diagnostico";

// Tabla de transiciones
// Cada estado tiene un subconjunto de eventos válidos que lo llevan a un nuevo estado
export const transiciones: Record<
  EstadoClinico,
  Partial<Record<EventoClinico, EstadoClinico>>
> = {
  diagnostico: {
    iniciar_tratamiento: "tratamiento",
  },
  tratamiento: {
    respuesta_positiva: "remision",
    respuesta_negativa: "recaida",
  },
  remision: {
    recaida_detectada: "recaida",
    alta_medica: "curado",
  },
  recaida: {
    reiniciar_tratamiento: "tratamiento",
    cuidados_paliativos: "paliativos",
  },
  paliativos: {
    fallecimiento: "muerte",
  },
  curado: {
    // Estado final, sin transiciones
  },
  muerte: {
    // Estado final, sin transiciones
  },
};

// Función para obtener el siguiente estado
export function obtenerSiguienteEstado(
  estadoActual: EstadoClinico,
  evento: EventoClinico
): { nuevoEstado: EstadoClinico; explicacion: string } {
  const posiblesEventos = transiciones[estadoActual];
  const nuevoEstado = posiblesEventos[evento];

  if (nuevoEstado) {
    const explicacion = `Desde el estado "${estadoActual}", al ocurrir el evento "${evento}", se transita al estado "${nuevoEstado}".`;
    return { nuevoEstado, explicacion };
  } else {
    const explicacion = `No hay una transición válida desde el estado "${estadoActual}" con el evento "${evento}".`;
    return { nuevoEstado: estadoActual, explicacion };
  }
}
