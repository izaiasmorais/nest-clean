import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserPayload } from "./jwt.strategy.guard";

export const CurrentUser = createParamDecorator(
	(_: never, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();

		return request.user as UserPayload;
	}
);
