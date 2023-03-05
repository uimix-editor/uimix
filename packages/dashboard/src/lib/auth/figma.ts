import { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface FigmaProfile {
  id: string;
  handle: string;
  email: string;
  img_url: string;
}

export default function FigmaProvider(
  options: OAuthUserConfig<FigmaProfile>
): OAuthConfig<FigmaProfile> {
  return {
    id: "figma",
    name: "Figma",
    type: "oauth",
    authorization: {
      url: "https://www.figma.com/oauth",
      params: {
        scope: "file_read",
        response_type: "code",
      },
    },
    token: {
      url: "https://www.figma.com/api/oauth/token",
      async request(context) {
        const provider = context.provider;
        const res = await fetch(
          `https://www.figma.com/api/oauth/token?client_id=${provider.clientId}&client_secret=${provider.clientSecret}&redirect_uri=${provider.callbackUrl}&code=${context.params.code}&grant_type=authorization_code`,
          { method: "POST" }
        );
        const json = await res.json();
        return {
          tokens: {
            access_token: json.access_token,
            refresh_token: json.refresh_token,
            expires_at: json.expires_in,
          },
        };
      },
    },
    userinfo: "https://api.figma.com/v1/me",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.handle,
        email: profile.email,
        image: profile.img_url,
      };
    },
    ...options,
  };
}
