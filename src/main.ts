import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(process.env.PORT ?? 3000);
	console.log(`Http server is running at port ${process.env.PORT ?? 3000}`);
}
bootstrap();
