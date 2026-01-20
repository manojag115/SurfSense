export class AppError extends Error {
	status?: number;
	statusText?: string;
	constructor(message: string, status?: number, statusText?: string) {
		super(message);
		this.name = this.constructor.name; // User friendly
		this.status = status;
		this.statusText = statusText; // Dev friendly
	}
}

export class NetworkError extends AppError {}

export class ValidationError extends AppError {}

export class AuthenticationError extends AppError {}

export class AuthorizationError extends AppError {}

export class NotFoundError extends AppError {}
