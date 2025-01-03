import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";

@Module({
	providers: [
		PrismaService,
		{
			provide: QuestionsRepository,
			useClass: PrismaQuestionsRepository,
		},
		PrismaAnswerAttachmentsRepository,
		PrismaAnswerCommentsRepository,
		PrismaQuestionAttachmentsRepository,
		PrismaAnswersRepository,
		PrismaQuestionCommentsRepository,
	],
	exports: [
		PrismaService,
		QuestionsRepository,
		PrismaAnswerAttachmentsRepository,
		PrismaAnswerCommentsRepository,
		PrismaQuestionAttachmentsRepository,
		PrismaAnswersRepository,
		PrismaQuestionCommentsRepository,
	],
})
export class DatabaseModule {}
