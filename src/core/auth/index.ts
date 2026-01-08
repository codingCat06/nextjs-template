import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";
import { db } from "@/server/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  socialProviders: {
    // Google OAuth
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
    // GitHub OAuth
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },
  plugins: [
    // Naver OAuth (custom provider via generic OAuth)
    ...(process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET
      ? [
          genericOAuth({
            config: [
              {
                providerId: "naver",
                clientId: process.env.NAVER_CLIENT_ID,
                clientSecret: process.env.NAVER_CLIENT_SECRET,
                authorizationUrl: "https://nid.naver.com/oauth2.0/authorize",
                tokenUrl: "https://nid.naver.com/oauth2.0/token",
                userInfoUrl: "https://openapi.naver.com/v1/nid/me",
                scopes: ["profile", "email"],
                getUserInfo: async (token) => {
                  const response = await fetch(
                    "https://openapi.naver.com/v1/nid/me",
                    {
                      headers: {
                        Authorization: `Bearer ${token.accessToken}`,
                      },
                    }
                  );
                  const data = await response.json();
                  const profile = data.response;
                  return {
                    id: profile.id,
                    email: profile.email,
                    name: profile.name || profile.nickname,
                    image: profile.profile_image,
                    emailVerified: true,
                  };
                },
              },
            ],
          }),
        ]
      : []),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github", "naver"],
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
      isActive: {
        type: "boolean",
        defaultValue: true,
        input: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
