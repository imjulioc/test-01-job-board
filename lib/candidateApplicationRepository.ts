import type { CandidateApplication } from './types';

export interface CandidateApplicationRepository {
	create(value: CandidateApplication): void;
}

export class IterableCandidateApplicationRepository implements CandidateApplicationRepository {
  private candidateApplications: CandidateApplication[];

  constructor(candidateApplications: CandidateApplication[]) {
    this.candidateApplications = candidateApplications;
  }

	create(value: CandidateApplication): void {
		this.candidateApplications.push(value);
	}
}
