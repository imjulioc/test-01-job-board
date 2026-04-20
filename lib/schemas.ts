import { z } from "zod";

const SalarySchema = z.object({
	min: z.number(),
	max: z.number(),
	currency: z.enum(["MXN", "USD"])
});

export const JobSchema = z.object({
	id: z.string(),
	title: z.string(),
	company: z.string(),
	location: z.string(),
	modality: z.enum(["remoto", "presencial", "híbrido"]),
	salary: SalarySchema,
	description: z.string(),
	publishedAt: z.string(),
	tags: z.array(z.string())
});

export type Job = z.infer<typeof JobSchema>;

export const CandidateApplicationSchema = z.object({
	id: z.string(),
	jobId: z.string(),
	name: z.string(),
	email: z.string().email(),
	phone: z.string(),
	resumeUrl: z.url(),
	coverLetter: z.string().optional(),
	appliedAt: z.string()
});

export type CandidateApplication = z.infer<typeof CandidateApplicationSchema>;
