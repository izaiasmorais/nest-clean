import { Answer as PrismaAnswer, Prisma } from "@prisma/client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class PrismaAnswerMapper {
	static toDomain(raw: PrismaAnswer): Answer {
		return Answer.create(
			{
				questionId: new UniqueEntityID(raw.questionId),
				content: raw.content,
				authorId: new UniqueEntityID(raw.authorId),
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityID(raw.id)
		);
	}

	static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
		return {
			id: answer.id.toString(),
			authorId: answer.authorId.toString(),
			questionId: answer.questionId.toString(),
			content: answer.content,
			createdAt: answer.createdAt,
			updatedAt: answer.updatedAt,
		};
	}
}
