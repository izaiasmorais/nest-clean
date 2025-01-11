import { UseCaseError } from "@/core/errors/use-case-error";

export class QuestionAlreadyExistsError extends Error implements UseCaseError {
	constructor(identifier: string) {
		super(`Question "${identifier}" already exists`);
	}
}
