import { Controller, Get, Query, UseGuards, HttpCode } from "@nestjs/common";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { AuthGuard } from "@nestjs/passport";
import { z } from "zod";
import { QuestionPresenter } from "../presenters/question-presenter";

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
	constructor(private fetechRecentQuestions: FetchRecentQuestionsUseCase) {}

	@Get()
	@HttpCode(200)
	async handle(@Query("page", queryValidatonPipe) page: PageQueryParamSchema) {
		const result = await this.fetechRecentQuestions.execute({
			page,
		});

		if (result.isLeft()) {
			throw new Error("Unexpected error");
		}

		return { questions: result.value.questions.map(QuestionPresenter.toHTTP) };
	}
}
