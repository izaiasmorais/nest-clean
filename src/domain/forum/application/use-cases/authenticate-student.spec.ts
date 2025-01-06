import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { AuthenticateStudentUseCase } from "./authenticate-student";
import { HashComparer } from "../cryptography/hash-comparer";
import { Encrypter } from "../cryptography/encypter";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let hashComparer: HashComparer;
let encrypter: Encrypter;
let fakeHasher: FakeHasher;
let sut: AuthenticateStudentUseCase;

describe("Authenticate Student", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		fakeHasher = new FakeHasher();
		hashComparer = new FakeHasher();
		encrypter = new FakeEncrypter();
		sut = new AuthenticateStudentUseCase(
			inMemoryStudentsRepository,
			hashComparer,
			encrypter
		);
	});

	it("should be able to authenticate a student", async () => {
		const student = makeStudent({
			email: "johndoe@example.com",
			password: await fakeHasher.hash("123456"),
		});

		inMemoryStudentsRepository.items.push(student);

		const result = await sut.execute({
			email: "johndoe@example.com",
			password: "123456",
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			accessToken: expect.any(String),
		});
	});
});
