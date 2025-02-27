import axios from "axios";
import jwt from "jsonwebtoken";

type AuthTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
};

interface IAuthProvider {
  getAccessToken(code: string): Promise<AuthTokenResponse>;
}

export const decryptJwt = (token: string | undefined = "") => {
  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET!);
    return verifiedToken;
  } catch (error) {
    console.log("Failed to verify session", error);
  }
};

export const verifySession = (token?: string) => {
  const session = decryptJwt(token) as AuthTokenResponse;

  if (!session || session.expires_at * 1000 < Date.now()) {
    return null;
  }

  return session.access_token;
};

export const stravaAuthProvider = (): IAuthProvider => {
  return {
    getAccessToken: async (
      code: string
    ): Promise<{
      access_token: string;
      refresh_token: string;
      expires_at: number;
    }> => {
      try {
        const response = await axios.post(
          "https://www.strava.com/oauth/token",
          {
            client_id: process.env.STRAVA_CLIENT_ID!,
            client_secret: process.env.STRAVA_CLIENT_SECRET!,
            code,
            grant_type: "authorization_code",
          }
        );

        return {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          expires_at: response.data.expires_at,
        };
      } catch {
        throw new Error("Failed to authenticate with Strava");
      }
    },
  };
};

export function authService(provider: IAuthProvider) {
  return async (code: string) => {
    const token = await provider.getAccessToken(code);

    const jwtToken = jwt.sign(
      {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        expires_at: token.expires_at,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    return jwtToken;
  };
}
