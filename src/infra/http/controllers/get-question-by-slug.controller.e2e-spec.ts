import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Get question by slug (E2E)", () => {
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

		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test("[GET] /questions/:slug", async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		await questionFactory.makePrismaQuestion({
			authorId: user.id,
			title: "Question 01",
			slug: Slug.create("question-01"),
		});

		const response = await request(app.getHttpServer())
			.get("/questions/question-01")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(200);

		expect(response.body).toEqual({
			question: {
				id: expect.any(String),
				title: "Question 01",
				slug: "question-01",
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
		});
	});
});
