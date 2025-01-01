import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/app.module";
import { Test } from "@nestjs/testing";
import { PrismaService } from "@/prisma/prisma.service";
import request from "supertest";

describe("Authenticate (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);

		await app.init();
	});

	test("[POST] /sessions", async () => {
		await request(app.getHttpServer()).post("/accounts").send({
			name: "John Doe",
			email: "johndoe@gmail.com",
			password: "123456",
		});

		const response = await request(app.getHttpServer()).post("/sessions").send({
			email: "johndoe@gmail.com",
			password: "123456",
		});

		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty("access_token");
	});
});
