import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { ConflictException } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";

const createAccountBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
	constructor(private prisma: PrismaService) {}

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createAccountBodySchema))
	async handle(@Body() body: CreateAccountBodySchema) {
		const { name, email, password } = body;

		const userAlreadExists = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (userAlreadExists) {
			throw new ConflictException("User with this email already exists.");
		}

		const hashedPassword = await hash(password, 8);

		await this.prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});
	}
}
