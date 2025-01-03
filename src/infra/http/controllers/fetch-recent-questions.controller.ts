import { Controller, Get, Query, UseGuards, HttpCode } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
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
export class FetchRecentQuestionsController {
	constructor(private prisma: PrismaService) {}

	@Get()
	@HttpCode(200)
	async handle(@Query("page", queryValidatonPipe) page: PageQueryParamSchema) {
		const perPage = 1;

		const questions = await this.prisma.question.findMany({
			take: 1,
			skip: (page - 1) * perPage,
			orderBy: {
				createdAt: "desc",
			},
		});

		return { questions };
	}
}
