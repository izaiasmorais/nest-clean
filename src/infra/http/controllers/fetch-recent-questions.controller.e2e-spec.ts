import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AppModule } from "@/infra/app.module";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-question";
import { DatabaseModule } from "@/infra/database/database.module";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Fetch recent questions (E2E)", () => {
	let app: INestApplication;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);

		await app.init();
	});

	test("[GET] /questions", async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		await Promise.all([
			questionFactory.makePrismaQuestion({
				authorId: user.id,
				title: "Question 1",
			}),
		]);

		const response = await request(app.getHttpServer())
			.get("/questions")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(200);

		expect(response.body).toEqual({
			questions: [
				{
					id: expect.any(String),
					title: "Question 1",
					slug: "question-1",
					createdAt: expect.any(String),
					updatedAt: expect.any(String),
				},
			],
		});
	});
});
