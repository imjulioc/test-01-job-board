import Link from 'next/link';
import { notFound } from 'next/navigation';
import { jobRepository } from '@/lib/jobs';
import { ResourceNotFoundError } from '@/lib/errors';
import type { Job } from '@/lib/types';

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let job: Job;

  try {
    job = jobRepository.get(id);
  }
	catch (error: unknown) {
    if (error instanceof ResourceNotFoundError) {
      notFound();
    }

    throw error;
  }

  return (
    <main className="container mx-auto p-4">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
          <p className="mt-2 text-base text-slate-600">{job.company} · {job.location} · {job.modality}</p>
        </div>
        <Link href="/jobs" className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          Volver al listado
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>{job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{new Date(job.publishedAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">Descripción</h2>
            <p className="text-slate-700 leading-7">{job.description}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">Etiquetas</h3>
            <div className="flex flex-wrap gap-2">
              {job.tags.map(tag => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{tag}</span>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Detalles</h3>
            <dl className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-slate-600">Empresa</dt>
                <dd>{job.company}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-slate-600">Ubicación</dt>
                <dd>{job.location}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-slate-600">Modalidad</dt>
                <dd>{job.modality}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-slate-600">Salario</dt>
                <dd>{job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}</dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <form className="space-y-3">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-900">
                  Nombre completo
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-900">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-900">
                  Teléfono
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  placeholder="+34 612 345 678"
                />
              </div>

              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-slate-900">
                  CV / Portafolio
                </label>
                <input
                  id="resume"
                  type="url"
                  name="resume"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-slate-900">
                  Carta de presentación
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows={4}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  placeholder="Cuéntanos por qué te interesa esta posición..."
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                Enviar candidatura
              </button>
            </form>
          </div>
        </aside>
      </div>
    </main>
  );
}
