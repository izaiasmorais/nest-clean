import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { PrismaService } from "@/prisma/prisma.service";
import { z } from "zod";

const pageQueryParamSchema = z
	.string()
	.optional()
	.default("1")
	.transform(Number)
	.pipe(z.number().min(1));

const queryValidatonPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/questions")
@UseGuards(AuthGuard("jwt"))
export class FetchRecentsQuestionsController {
	constructor(private prisma: PrismaService) {}

	@Get()
	async handle(@Query("page", queryValidatonPipe) page: PageQueryParamSchema) {
		const perPage = 1;

		const questions = await this.prisma.question.findMany({
			take: 1,
			skip: (page - 1) * perPage,
			orderBy: {
				cretedAt: "desc",
			},
		});

		return { questions };
	}
}
