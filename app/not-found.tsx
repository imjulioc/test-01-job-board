import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="container mx-auto p-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">404</p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Página no encontrada</h1>
        <p className="mt-3 text-slate-600">No se encontró la vacante que buscas. Revisa el listado o intenta otra búsqueda.</p>
        <Link href="/jobs" className="mt-8 inline-flex rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
          Volver al listado de empleos
        </Link>
      </div>
    </main>
  );
}
