import { INestApplication } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { AppModule } from "@/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Get question by slug (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test("[GET] /questions/:slug", async () => {
		const user = await prisma.user.create({
			data: {
				name: "John Doe",
				email: "johndoe@gmail.com",
				password: "123456",
			},
		});

		const accessToken = jwt.sign({ sub: user.id });

		await prisma.question.create({
			data: {
				title: "Question 01",
				slug: "question-01",
				content: "Content 1",
				authorId: user.id,
			},
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
