/**
 * Environment variable validation for JoyFit MVP
 * Validates required environment variables at build time
 */

interface EnvSchema {
  DATABASE_URL: string;
  NODE_ENV: "development" | "production" | "test";
  DEV_LOGIN_CODE?: string;
}

function validateEnv(): EnvSchema {
  const env = process.env;

  // Required variables
  if (!env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not defined. Please set it in your .env file."
    );
  }

  // Validate DATABASE_URL format (basic check for PostgreSQL)
  if (!env.DATABASE_URL.startsWith("postgresql://")) {
    throw new Error(
      "DATABASE_URL must be a valid PostgreSQL connection string starting with 'postgresql://'"
    );
  }

  // Optional: Validate NODE_ENV
  const nodeEnv = env.NODE_ENV || "development";
  if (!["development", "production", "test"].includes(nodeEnv)) {
    throw new Error(
      "NODE_ENV must be one of: development, production, test"
    );
  }

  return {
    DATABASE_URL: env.DATABASE_URL,
    NODE_ENV: nodeEnv as "development" | "production" | "test",
    DEV_LOGIN_CODE: env.DEV_LOGIN_CODE,
  };
}

// Validate on module load
export const env = validateEnv();

// Export individual variables for convenience
export const { DATABASE_URL, NODE_ENV, DEV_LOGIN_CODE } = env;
