export abstract class Hasher {
	abstract hash(plain: string): Promise<string>;

}
