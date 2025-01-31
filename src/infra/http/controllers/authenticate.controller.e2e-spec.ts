import { INestApplication } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { AppModule } from "@/infra/app.module";
import { StudentFactory } from "test/factories/make-student";
import { DatabaseModule } from "@/infra/database/database.module";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";

describe("Authenticate (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		prisma = moduleRef.get(PrismaService);

		await app.init();
	});

	test("[POST] /sessions", async () => {
		await studentFactory.makePrismaStudent({
			email: "johndoe@gmail.com",
			password: await hash("123456", 8),
		});

		const response = await request(app.getHttpServer()).post("/sessions").send({
			email: "johndoe@gmail.com",
			password: "123456",
		});

		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			access_token: expect.any(String),
		});
	});
});
