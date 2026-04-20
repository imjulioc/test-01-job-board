import { promises as fs } from "fs";
import path from "path";
import { IterableJobRepository, type JobRepository } from "./jobRepository";
import { type Job, JobSchema } from "./schemas";

async function loadJobs(): Promise<Job[]> {
	const jobsFile = process.env.JOB_BOARD_JOBS_FILE || "lib/jobs.json";

	const filePath = path.join(process.cwd(), jobsFile);

	const fileContents = await fs.readFile(filePath, "utf8");

	const rawData = JSON.parse(fileContents);

	return JobSchema.array().parse(rawData);
}

const jobs = await loadJobs();

export const jobRepository: JobRepository = new IterableJobRepository(jobs);
