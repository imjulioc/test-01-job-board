import {
	type CandidateApplicationRepository,
	IterableCandidateApplicationRepository
} from "./candidateApplicationRepository";

export const candidateApplicationRepository: CandidateApplicationRepository =
	new IterableCandidateApplicationRepository([]);
