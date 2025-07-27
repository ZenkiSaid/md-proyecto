"use client";

import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MarkerType,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { EstadoClinico } from "../lib/automataLogic";

// eventos inversos para interacción
const eventosPorTransicion: Record<
  EstadoClinico,
  Partial<Record<EstadoClinico, string>>
> = {
  diagnostico: { tratamiento: "iniciar_tratamiento" },
  tratamiento: {
    remision: "respuesta_positiva",
    recaida: "respuesta_negativa",
  },
  remision: {
    recaida: "recaida_detectada",
    curado: "alta_medica",
  },
  recaida: {
    tratamiento: "reiniciar_tratamiento",
    paliativos: "cuidados_paliativos",
  },
  paliativos: { muerte: "fallecimiento" },
  curado: {},
  muerte: {},
};

type Props = {
  estadoActual: EstadoClinico;
  visitados: EstadoClinico[];
  onChangeEstado: (nuevoEstado: EstadoClinico, evento: string) => void;
};

export default function AutomataGraph({
  estadoActual,
  visitados,
  onChangeEstado,
}: Props) {
  const colores = {
    base: "#f1f5f9",
    activo: "#3b82f6",
    visitado: "#9ca3af", // gris medio (no usamos opacidad)
    texto: "#1e293b",
    borde: "#94a3b8",
  };

  const baseStyle = {
    borderRadius: 20,
    padding: 12,
    width: 160,
    textAlign: "center" as const,
    fontWeight: 600,
    fontSize: 14,
    boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
  };

  const crearNodo = (
    id: EstadoClinico,
    label: string,
    x: number,
    y: number
  ): Node => {
    const esActual = estadoActual === id;
    const esVisitado = visitados.includes(id);
    let fondo = colores.base;
    let colorTexto = colores.texto;
    let bordeColor = colores.borde;

    if (esActual) {
      fondo = colores.activo;
      colorTexto = "#fff";
      bordeColor = "#1d4ed8";
    } else if (esVisitado) {
      fondo = colores.visitado;
      colorTexto = "#f9fafb";
    }

    return {
      id,
      data: { label },
      position: { x, y },
      style: {
        ...baseStyle,
        background: fondo,
        color: colorTexto,
        border: `3px solid ${bordeColor}`,
      },
    };
  };

  // Reposicionamos nodos para evitar cruces
  const nodes: Node[] = useMemo(() => {
    return [
      crearNodo("diagnostico", "Diagnóstico", 0, 0),
      crearNodo("tratamiento", "Tratamiento", 260, 0),
      crearNodo("remision", "Remisión", 520, 0),
      crearNodo("recaida", "Recaída", 260, 200),
      crearNodo("paliativos", "Paliativos", 520, 200),
      crearNodo("curado", "Curado", 800, 0),
      crearNodo("muerte", "Muerte", 800, 200),
    ];
  }, [estadoActual, visitados]);

  // Creamos aristas con rutas más limpias
const edges: Edge[] = useMemo(() => {
  const baseEdges: Edge[] = [
    {
      id: "e1",
      source: "diagnostico",
      target: "tratamiento",
      label: "Iniciar Tratamiento",
      type: "smoothstep",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: "#0ea5e9", strokeWidth: 3 },
      labelStyle: { fill: "#0ea5e9", fontWeight: 600 },
    },
    {
      id: "e2",
      source: "tratamiento",
      target: "remision",
      label: "Respuesta Positiva",
      type: "smoothstep",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: "#16a34a", strokeWidth: 3 },
      labelStyle: { fill: "#16a34a", fontWeight: 600 },
    },
    {
      id: "e3",
      source: "tratamiento",
      target: "recaida",
      label: "Respuesta Negativa",
      type: "bezier",
      animated: true,
      markerStart: { type: MarkerType.ArrowClosed },
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: "#f97316", strokeWidth: 3 },
      labelStyle: { fill: "#f97316", fontWeight: 600, whiteSpace: "pre-line" },
    },
    {
      id: "e4",
      source: "remision",
      target: "recaida",
      label: "Recaída Detectada",
      type: "bezier",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: "#fa9b15", strokeWidth: 3 },
      labelStyle: { fill: "#ca8a04", fontWeight: 600 },
    },
    {
      id: "e5",
      source: "recaida",
      target: "paliativos",
      label: "Cuidados Paliativos",
      type: "smoothstep",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: "#dc2626", strokeWidth: 3 },
      labelStyle: { fill: "#dc2626", fontWeight: 600 },
    },
    {
      id: "e6",
      source: "remision",
      target: "curado",
      label: "Alta Médica",
      type: "smoothstep",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: "#22c55e", strokeWidth: 3 },
      labelStyle: { fill: "#22c55e", fontWeight: 600 },
    },
    {
      id: "e7",
      source: "paliativos",
      target: "muerte",
      label: "Fallecimiento",
      type: "smoothstep",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: "#ef4444", strokeWidth: 3 },
      labelStyle: { fill: "#ef4444", fontWeight: 600 },
    },
  ];

  // Solo agregar e8 si estamos en "recaida"
  if (estadoActual === "recaida") {
    baseEdges.push({
      id: "e8",
      source: "recaida",
      target: "tratamiento",
      label: "Reiniciar Tratamiento",
      type: "bezier",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: "#06b6d4", strokeWidth: 3 },
      labelStyle: { fill: "#06b6d4", fontWeight: 600 },
    });
  }

  return baseEdges;
}, [estadoActual]);


  const handleNodeClick = (_: any, node: any) => {
    const destino = node.id as EstadoClinico;
    if (destino === estadoActual) return;
    const posibleEvento = eventosPorTransicion[estadoActual]?.[destino];
    if (posibleEvento) {
      onChangeEstado(destino, posibleEvento);
    } else {
      alert(`No hay transición directa de "${estadoActual}" a "${destino}".`);
    }
  };

  return (
    <div
      style={{ width: "100%", height: 500 }}
      className="border-2 border-slate-300 rounded-2xl shadow-md my-8"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodeClick={handleNodeClick}
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background gap={16} color="#e2e8f0" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
