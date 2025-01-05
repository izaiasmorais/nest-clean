import type { Encrypter } from "@/domain/forum/application/cryptography/encypter";

export class FakeEncrypter implements Encrypter {
	async encrypt(payload: Record<string, unknown>): Promise<string> {
		return JSON.stringify(payload);
	}
}
