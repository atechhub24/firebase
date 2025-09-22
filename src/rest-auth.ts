// Configuration interface for flexible setup
export interface FirebaseAuthConfig {
  authUrl: string;
  apiKey: string;
}

// Default configuration that can be overridden
const defaultConfig: FirebaseAuthConfig = {
  authUrl:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_URL ||
    process.env.FIREBASE_AUTH_URL ||
    "",
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    process.env.FIREBASE_API_KEY ||
    "",
};

// Response types
export interface SignupResponse {
  kind: "identitytoolkit#SignupNewUserResponse";
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

export interface SignInResponse {
  kind: "identitytoolkit#VerifyPasswordResponse";
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

export interface UpdateResponse {
  kind: "identitytoolkit#SetAccountInfoResponse";
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

export interface DeleteResponse {
  kind: "identitytoolkit#DeleteAccountResponse";
}

export interface AuthError {
  error: {
    code: number;
    message: string;
    errors: Array<{
      message: string;
      domain: string;
      reason: string;
    }>;
  };
}

// Custom error class for better error handling
export class FirebaseAuthError extends Error {
  constructor(
    message: string,
    public code?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = "FirebaseAuthError";
  }
}

// Input validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6; // Firebase minimum requirement
};

// Configuration management
let currentConfig: FirebaseAuthConfig = defaultConfig;

export const configureAuth = (config: Partial<FirebaseAuthConfig>): void => {
  currentConfig = { ...currentConfig, ...config };

  if (!currentConfig.authUrl || !currentConfig.apiKey) {
    throw new FirebaseAuthError(
      "Firebase Auth configuration is incomplete. Please provide authUrl and apiKey."
    );
  }
};

// Helper function to make authenticated requests
const makeAuthRequest = async <T>(
  endpoint: string,
  body: Record<string, any>
): Promise<T> => {
  if (!currentConfig.authUrl || !currentConfig.apiKey) {
    throw new FirebaseAuthError(
      "Firebase Auth not configured. Call configureAuth() first."
    );
  }

  const response = await fetch(
    `${currentConfig.authUrl}${endpoint}?key=${currentConfig.apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  if (!response.ok || data.error) {
    const error = data as AuthError;
    throw new FirebaseAuthError(
      error.error?.message || "Authentication request failed",
      error.error?.code,
      data
    );
  }

  return data as T;
};

export const createUser = async (
  email: string,
  password: string
): Promise<SignupResponse> => {
  // Input validation
  if (!validateEmail(email)) {
    throw new FirebaseAuthError("Invalid email format");
  }

  if (!validatePassword(password)) {
    throw new FirebaseAuthError("Password must be at least 6 characters long");
  }

  return makeAuthRequest<SignupResponse>(":signUp", {
    email,
    password,
    returnSecureToken: true,
  });
};

export const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<UpdateResponse> => {
  // Input validation
  if (!validateEmail(email)) {
    throw new FirebaseAuthError("Invalid email format");
  }

  if (!validatePassword(currentPassword)) {
    throw new FirebaseAuthError("Current password is invalid");
  }

  if (!validatePassword(newPassword)) {
    throw new FirebaseAuthError(
      "New password must be at least 6 characters long"
    );
  }

  // Step 1: Sign in user to get idToken
  const signInData = await makeAuthRequest<SignInResponse>(
    ":signInWithPassword",
    {
      email,
      password: currentPassword,
      returnSecureToken: true,
    }
  );

  // Step 2: Change password using the idToken
  return makeAuthRequest<UpdateResponse>(":update", {
    idToken: signInData.idToken,
    password: newPassword,
    returnSecureToken: true,
  });
};

export const deleteUser = async (
  email: string,
  password: string
): Promise<DeleteResponse> => {
  // Input validation
  if (!validateEmail(email)) {
    throw new FirebaseAuthError("Invalid email format");
  }

  if (!validatePassword(password)) {
    throw new FirebaseAuthError("Password is invalid");
  }

  // Step 1: Sign in user to get idToken
  const signInData = await makeAuthRequest<SignInResponse>(
    ":signInWithPassword",
    {
      email,
      password,
      returnSecureToken: true,
    }
  );

  // Step 2: Delete user using the idToken
  return makeAuthRequest<DeleteResponse>(":delete", {
    idToken: signInData.idToken,
  });
};
