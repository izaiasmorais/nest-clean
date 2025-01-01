import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/app.module";
import { Test } from "@nestjs/testing";
import { PrismaService } from "@/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
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

	test("[POST] /questions", async () => {
		const user = await prisma.user.create({
			data: {
				name: "John Doe",
				email: "johndoe@gmail.com",
				password: "123456",
			},
		});

		const accessToken = jwt.sign({ sub: user.id });

		const response = await request(app.getHttpServer())
			.post("/questions")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				title: "Pergunta 1",
				content: "Conteudo da pergunta",
			});

		expect(response.statusCode).toBe(201);

		const question = await prisma.question.findFirst({
			where: {
				title: "Pergunta 1",
			},
		})

		expect(question).toBeTruthy();
	});
});
