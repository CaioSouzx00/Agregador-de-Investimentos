// Backend REST API Data Transfer Objects (DTOs)

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthSessionUser {
  userId: string;
  username: string;
  email?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  username?: string;
  password?: string;
}

export interface UserResponse {
  userId: string;
  username: string;
  email: string;
}

export interface AccountResponse {
  accountId: string;
  description: string;
}

export interface CreateAccountRequest {
  description: string;
  street: string;
  number: number;
}

export interface AccountStockResponse {
  stockId: string;
  quantity: number;
  currentPrice: number;
  total: number;
}

export interface AssociateAccountStockRequest {
  stockId: string;
  quantity: number;
}

export interface AccountValuationResponse {
  accountId: string;
  description: string;
  totalPortfolioValue: number;
  positions: AccountStockResponse[];
  evaluatedAt: string;
}

export interface UserValuationResponse {
  userId: string;
  username: string;
  totalNetWorth: number;
  accounts: AccountValuationResponse[];
  evaluatedAt: string;
}

export interface StockResponse {
  stockId: string;
  description: string;
}

export interface CreateStockRequest {
  stockId: string;
  description: string;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
  rejectedValue?: unknown;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: ValidationErrorDetail[];
}
