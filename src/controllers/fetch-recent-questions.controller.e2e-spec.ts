import { INestApplication } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { AppModule } from "@/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Create question (E2E)", () => {
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

	test("[GET] /questions", async () => {
		const user = await prisma.user.create({
			data: {
				name: "John Doe",
				email: "johndoe@gmail.com",
				password: "123456",
			},
		});

		const accessToken = jwt.sign({ sub: user.id });

		await prisma.question.createMany({
			data: [
				{
					title: "Question 1",
					slug: "question-1",
					content: "Content 1",
					authorId: user.id,
				},
			],
		});

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
					content: "Content 1",
					cretedAt: expect.any(String),
					updatedAt: expect.any(String),
					authorId: user.id,
				},
			],
		});
	});
});
