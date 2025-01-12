import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { EnvService } from "../env/env.service";
import { EnvModule } from "../env/env.module";

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			inject: [EnvService],
			imports: [EnvModule],
			global: true,
			useFactory(env: EnvService) {
				const privateKey = env.get("JWT_PRIVATE_KEY");
				const publicKey = env.get("JWT_PUBLIC_KEY");

				return {
					signOptions: { algorithm: "RS256" },
					privateKey: Buffer.from(privateKey, "base64"),
					publicKey: Buffer.from(publicKey, "base64"),
				};
			},
		}),
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		EnvService,
		JwtStrategy,
	],
})
export class AuthModule {}
