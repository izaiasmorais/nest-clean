import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { StudentsRepository } from "../repositories/students-repository";
import { HashComparer } from "../cryptography/hash-comparer";
import { Encrypter } from "../cryptography/encypter";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

interface AuthenticateStudentUseCaseRequest {
	email: string;
	password: string;
}

type AuthenticateStudentUseCaseResponse = Either<
	InvalidCredentialsError,
	{
		accessToken: string;
	}
>;

@Injectable()
export class AuthenticateStudentUseCase {
	constructor(
		private studentsRepository: StudentsRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter
	) {}

	async execute({
		email,
		password,
	}: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
		const student = await this.studentsRepository.findByEmail(email);

		if (!student) {
			return left(new InvalidCredentialsError());
		}

		const isPasswordValid = await this.hashComparer.compare(
			password,
			student.password
		);

		if (!isPasswordValid) {
			return left(new InvalidCredentialsError());
		}

		const accessToken = await this.encrypter.encrypt({
			sub: student.id.toString(),
		});

		return right({ accessToken });
	}
}
