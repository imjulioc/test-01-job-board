import { ResourceNotFoundError } from "./errors";
import type { Job } from "./types";

export interface JobRepository {
	get(id: string): Job;

	find(id: string): Job | undefined;

	filter(
		title?: string,
		company?: string,
		modality?: Job["modality"],
		location?: string,
		limit?: number,
		offset?: number
	): Job[];

	count(): number;

	filterCompanies(name?: string): string[];

	filterModalities(): Job["modality"][];

	filterLocations(name?: string): string[];
}

export class IterableJobRepository implements JobRepository {
	private jobs: Job[];
	private companies: string[];
	private modalities: Job["modality"][];
	private locations: string[];

	constructor(jobs: Job[]) {
		this.jobs = jobs;
		this.companies = Array.from(new Set(jobs.map(job => job.company)));
		this.modalities = Array.from(new Set(jobs.map(job => job.modality)));
		this.locations = Array.from(new Set(jobs.map(job => job.location)));
	}

	get(id: string): Job {
		const job = this.find(id);

		if (!job) {
			throw new ResourceNotFoundError("Job", id);
		}

		return job;
	}

	find(id: string): Job | undefined {
		return this.jobs.find(job => job.id === id);
	}

	filter(
		title?: string,
		company?: string,
		modality?: Job["modality"],
		location?: string,
		limit?: number,
		offset?: number
	): Job[] {
		let filtered = this.jobs;

		if (title) {
			filtered = filtered.filter(job =>
				job.title.toLowerCase().includes(title.toLowerCase())
			);
		}

		if (company) {
			filtered = filtered.filter(job =>
				job.company.toLowerCase().includes(company.toLowerCase())
			);
		}

		if (modality) {
			filtered = filtered.filter(job => job.modality === modality);
		}

		if (location) {
			filtered = filtered.filter(job =>
				job.location.toLowerCase().includes(location.toLowerCase())
			);
		}

		if (offset) {
			filtered = filtered.slice(offset);
		}

		if (limit) {
			filtered = filtered.slice(0, limit);
		}

		return filtered;
	}

	count(): number {
		return this.jobs.length;
	}

	filterCompanies(name?: string): string[] {
		if (!name) {
			return this.companies;
		}

		return this.companies.filter(company =>
			company.toLowerCase().includes(name.toLowerCase())
		);
	}

	filterModalities(): Job["modality"][] {
		return this.modalities;
	}

	filterLocations(name?: string): string[] {
		if (!name) {
			return this.locations;
		}

		return this.locations.filter(location =>
			location.toLowerCase().includes(name.toLowerCase())
		);
	}
}
