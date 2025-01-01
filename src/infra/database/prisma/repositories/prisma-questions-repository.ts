import { PrismaClient } from "@prisma/client";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
	constructor(private prisma: PrismaClient) {}

	async findById(id: string): Promise<Question | null> {
		const question = await this.prisma.question.findUnique({
			where: { id },
		});

		if (!question) {
			return null;
		}

		return PrismaQuestionMapper.toDomain(question);
	}

	async findBySlug(slug: string): Promise<Question | null> {
		return await this.prisma.question.findUnique({
			where: { slug },
		});
	}

	async findManyRecent(params: PaginationParams): Promise<Question[]> {
		const { page, pageSize } = params;
		return await this.prisma.question.findMany({
			orderBy: { createdAt: "desc" },
			skip: (page - 1) * pageSize,
			take: pageSize,
		});
	}

	async save(question: Question): Promise<void> {
		await this.prisma.question.update({
			where: { id: question.id },
			data: question,
		});
	}

	async create(question: Question): Promise<void> {
		await this.prisma.question.create({
			data: question,
		});
	}

	async delete(question: Question): Promise<void> {
		await this.prisma.question.delete({
			where: { id: question.id },
		});
	}
}
