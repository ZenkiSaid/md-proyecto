export default function Page() {
    return(
    <div className="text-center pt-12">
      <h1 className="text-3xl capitalize font-bold mb-4">
        Acerca de esta aplicación web
      </h1>
      <p className="text-[16px]">
        Este sistema permite simular la evolución clínica de un paciente oncológico mediante un autómata simbólico. Se pueden cargar eventos clínicos y observar la trayectoria resultante de acuerdo con reglas médicas.
        </p>
    </div>
    );
}