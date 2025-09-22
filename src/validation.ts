export const isString = (value: unknown): value is string =>
  typeof value === "string";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const assertEmailPassword = (email: unknown, password: unknown) => {
  if (!isString(email) || !isString(password)) {
    throw new Error("Email and password must be strings");
  }
  if (!validateEmail(email)) {
    throw new Error("Invalid email format");
  }
  if (!validatePassword(password)) {
    throw new Error("Password must be at least 6 characters long");
  }
};
