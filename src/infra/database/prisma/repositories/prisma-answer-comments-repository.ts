import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import type { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
	findById(id: string): Promise<AnswerComment | null> {
		throw new Error("Method not implemented.");
	}

	findManyByAnswerId(
		answerId: string,
		params: PaginationParams
	): Promise<AnswerComment[]> {
		throw new Error("Method not implemented.");
	}

	create(answerComment: AnswerComment): Promise<void> {
		throw new Error("Method not implemented.");
	}

	delete(answerComment: AnswerComment): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
