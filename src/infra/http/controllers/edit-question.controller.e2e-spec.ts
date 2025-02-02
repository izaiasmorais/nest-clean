import { INestApplication } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-question";
import { DatabaseModule } from "@/infra/database/database.module";
import { AppModule } from "@/infra/app.module";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Edit question (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let questionFactory: QuestionFactory;
	let studentFactory: StudentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test("[PUT] /questions/:id", async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const questionId = question.id.toString();

		const response = await request(app.getHttpServer())
			.put(`/questions/${questionId}`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				title: "New title",
				content: "New content",
			});

		const updatedQuestion = await prisma.question.findFirst({
			where: {
				title: "New title",
				content: "New content",
			},
		});

		expect(response.statusCode).toBe(204);
		expect(updatedQuestion).toBeTruthy();
	});
});
