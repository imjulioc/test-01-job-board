import Link from "next/link";
import { FilterSelect } from "@/components/FilterSelect";
import { TitleSearch } from "@/components/TitleSearch";
import { jobRepository } from "@/lib/jobs";
import type { Job } from "@/lib/types";

const DEFAULT_LIMIT = 6;

interface JobsSearchParams {
	title?: string;
	company?: string;
	modality?: string;
	location?: string;
	limit?: string;
	offset?: string;
}

function parseNumber(
	value: string | string[] | undefined,
	fallback: number
): number {
	const raw = Array.isArray(value) ? value[0] : value;

	const parsed = Number(raw);

	return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function buildJobsUrl(params: {
	title?: string;
	company?: string;
	modality?: string;
	location?: string;
	limit: number;
	offset: number;
}) {
	const searchParams = new URLSearchParams();

	if (params.title) {
		searchParams.set("title", params.title);
	}

	if (params.company) {
		searchParams.set("company", params.company);
	}

	if (params.modality) {
		searchParams.set("modality", params.modality);
	}

	if (params.location) {
		searchParams.set("location", params.location);
	}

	searchParams.set("limit", params.limit.toString());
	searchParams.set("offset", params.offset.toString());

	return `/jobs?${searchParams.toString()}`;
}

export default async function JobsPage({
	searchParams
}: {
	searchParams: Promise<JobsSearchParams>;
}) {
	const resolvedSearchParams = await searchParams;
	const title = resolvedSearchParams.title?.trim();
	const company = resolvedSearchParams.company?.trim();
	const modality = resolvedSearchParams.modality as Job["modality"] | undefined;
	const location = resolvedSearchParams.location?.trim();
	const limit = parseNumber(resolvedSearchParams.limit, DEFAULT_LIMIT);
	const offset = parseNumber(resolvedSearchParams.offset, 0);

	const filteredJobs = jobRepository.filter(
		title || undefined,
		company || undefined,
		modality,
		location || undefined
	);
	const jobs = filteredJobs.slice(offset, offset + limit);
	const totalJobs = filteredJobs.length;

	const page = Math.floor(offset / limit) + 1;
	const lastPage = Math.max(1, Math.ceil(totalJobs / limit));
	const previousOffset = Math.max(0, offset - limit);
	const nextOffset = Math.min((lastPage - 1) * limit, offset + limit);

	const companies = jobRepository.filterCompanies();
	const modalities = jobRepository.filterModalities();
	const locations = jobRepository.filterLocations();

	return (
		<main className="container mx-auto p-4">
			<div className="mb-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
				<div className="space-y-4">
					<div>
						<Link
							href="/jobs"
							className="text-2xl font-bold text-slate-900 hover:text-slate-700"
						>
							Listado de empleos
						</Link>
						<p className="mt-2 text-sm text-slate-600">
							Mostrando {jobs.length} de {totalJobs} vacantes.
						</p>
					</div>
					<TitleSearch currentTitle={title ?? ""} />
				</div>

				<div className="grid gap-4">
					<FilterSelect
						label="Empresa"
						paramKey="company"
						options={companies}
						value={company}
						placeholder="Buscar empresa"
					/>
					<FilterSelect
						label="Modalidad"
						paramKey="modality"
						options={modalities}
						value={modality}
						placeholder="Buscar modalidad"
					/>
					<FilterSelect
						label="Ubicación"
						paramKey="location"
						options={locations}
						value={location}
						placeholder="Buscar ubicación"
					/>
				</div>
			</div>

			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<span className="text-sm text-slate-500">
					Página {page} / {lastPage}
				</span>
				<div className="flex items-center gap-2 text-sm">
					<Link
						href={buildJobsUrl({
							title: title ?? "",
							company: company ?? "",
							modality: modality ?? "",
							location: location ?? "",
							limit,
							offset: previousOffset
						})}
						className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-50"
					>
						Anterior
					</Link>
					<Link
						href={buildJobsUrl({
							title: title ?? "",
							company: company ?? "",
							modality: modality ?? "",
							location: location ?? "",
							limit,
							offset: nextOffset
						})}
						className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-50"
					>
						Siguiente
					</Link>
				</div>
			</div>

			<ul className="grid gap-4 sm:grid-cols-2">
				{jobs.map(job => (
					<li
						key={job.id}
						className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
					>
						<Link href={`/jobs/${job.id}`} className="block">
							<div className="flex flex-col gap-2">
								<div className="flex items-start justify-between gap-3">
									<div>
										<h2 className="text-lg font-semibold text-slate-900">
											{job.title}
										</h2>
										<p className="text-sm text-slate-500">{job.company}</p>
									</div>
									<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
										{job.modality}
									</span>
								</div>
								<p className="text-sm text-slate-600">{job.location}</p>
								<p className="text-sm text-slate-700">
									{job.salary.min.toLocaleString()} -{" "}
									{job.salary.max.toLocaleString()} {job.salary.currency}
								</p>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</main>
	);
}
