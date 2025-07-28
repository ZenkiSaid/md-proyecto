import { EstadoClinico } from "./automataLogic";

export const datosClinicos: Record<
  EstadoClinico,
  {
    titulo: string;
    descripcion: string;
    tratamientos?: string[];
    pruebas?: string[];
    indicadores?: { label: string; valor: string }[];
    notas?: string;
  }
> = {
  diagnostico: {
    titulo: "Diagnóstico",
    descripcion:
      "Etapa inicial de evaluación clínica. Se realizan biopsias y estudios para confirmar el diagnóstico.",
    pruebas: ["Biopsia de piel", "Examen dermatológico", "Análisis histopatológico"],
    indicadores: [
      { label: "Nivel de dolor esperado", valor: "Bajo" },
      { label: "Probabilidad de curación", valor: "Indefinida" },
    ],
    notas: "Es importante confirmar el tipo de lesión antes de planificar tratamiento."
  },
  tratamiento: {
    titulo: "Tratamiento",
    descripcion:
      "Aplicación de terapias específicas para reducir o eliminar el cáncer.",
    tratamientos: ["Cirugía", "Radioterapia", "Inmunoterapia", "Quimioterapia tópica"],
    pruebas: ["Control hematológico", "Resonancia de seguimiento"],
    indicadores: [
      { label: "Nivel de dolor esperado", valor: "Moderado" },
      { label: "Probabilidad de curación", valor: "Alta" },
    ],
    notas: "Monitorizar efectos secundarios y ajustar dosis según tolerancia."
  },
  remision: {
    titulo: "Remisión",
    descripcion:
      "El cáncer muestra signos de reducción significativa o desaparición.",
    tratamientos: ["Terapia de mantenimiento", "Seguimiento periódico"],
    pruebas: ["Biopsia de control", "Análisis de marcadores tumorales"],
    indicadores: [
      { label: "Nivel de dolor esperado", valor: "Bajo" },
      { label: "Probabilidad de curación", valor: "Alta" },
    ],
    notas: "Mantener vigilancia estrecha para detectar recaídas tempranas."
  },
  recaida: {
    titulo: "Recaída",
    descripcion:
      "El cáncer reaparece tras un periodo de remisión, se evalúan nuevas estrategias.",
    tratamientos: ["Reiniciar protocolo terapéutico", "Terapias alternativas"],
    pruebas: ["TAC", "PET-Scan", "Examen de extensión"],
    indicadores: [
      { label: "Nivel de dolor esperado", valor: "Variable" },
      { label: "Probabilidad de curación", valor: "Media" },
    ],
    notas: "Reevaluar factores de riesgo y pronóstico actualizado."
  },
  paliativos: {
    titulo: "Cuidados Paliativos",
    descripcion:
      "Atención centrada en el control de síntomas y calidad de vida.",
    tratamientos: ["Analgesia", "Cuidados domiciliarios", "Apoyo psicológico"],
    pruebas: ["Control de signos vitales", "Evaluación de dolor"],
    indicadores: [
      { label: "Nivel de dolor esperado", valor: "Alto" },
      { label: "Probabilidad de curación", valor: "No aplicable" },
    ],
    notas: "Coordinar con equipo multidisciplinario y familiares."
  },
  curado: {
    titulo: "Curado",
    descripcion:
      "El paciente no presenta signos de enfermedad, se mantiene seguimiento.",
    pruebas: ["Controles dermatológicos anuales"],
    indicadores: [
      { label: "Nivel de dolor esperado", valor: "Nulo" },
      { label: "Probabilidad de curación", valor: "Confirmada" },
    ],
    notas: "Reforzar medidas preventivas para evitar recurrencias."
  },
  muerte: {
    titulo: "Muerte",
    descripcion:
      "El proceso clínico finalizó con el fallecimiento del paciente.",
    indicadores: [
      { label: "Nivel de dolor esperado", valor: "N/A" },
      { label: "Probabilidad de curación", valor: "N/A" },
    ],
    notas: "Registrar el caso y comunicar al equipo médico y familiar."
  },
};
