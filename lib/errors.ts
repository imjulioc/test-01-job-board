export class ResourceNotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found.`);

    this.name = 'ResourceNotFoundError';
  }
}
