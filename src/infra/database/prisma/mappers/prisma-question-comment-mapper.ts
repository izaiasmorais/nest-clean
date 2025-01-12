import { Comment as PrismaComment, Prisma } from "@prisma/client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class PrismaQuestionCommentMapper {
	static toDomain(raw: PrismaComment): QuestionComment {
		if (!raw.questionId) {
			throw new Error("Invalid comment type.");
		}

		return QuestionComment.create(
			{
				questionId: new UniqueEntityID(raw.questionId),
				authorId: new UniqueEntityID(raw.authorId),
				content: raw.content,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityID(raw.id)
		);
	}

	static toPrisma(
		questionComment: QuestionComment
	): Prisma.CommentUncheckedCreateInput {
		return {
			id: questionComment.id.toString(),
			authorId: questionComment.authorId.toString(),
			questionId: questionComment.questionId.toString(),
			content: questionComment.content,
			createdAt: questionComment.createdAt,
			updatedAt: questionComment.updatedAt,
		};
	}
}
