import NextAuth, { DefaultSession } from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function refreshAccessToken(token: any) {
  try {
    const url = `${process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token if not returned
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    idToken: string;
    accessToken: string;
    refreshToken: string;
    user: {
      /** The user's postal address. */
      address: string;
      role: string;
      groups: string[];
      firstName: string;
      lastName: string;
      username: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID as string,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
      issuer: process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, profile, account }) {
      if (profile) {
        token.groups = profile.groups;
        token.firstName = profile.given_name;
        token.lastName = profile.family_name;
        token.username = profile.preferred_username;
      }
      if (account) {
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;

        console.log("account", account);
      }
      if (Date.now() < token.expiresAt!) {
        return token;
      }

      // Token expired, refresh it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token?.groups) {
        session.user.groups = token.groups;
      }
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.username = token.username;
      session.idToken = token.idToken;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  events: {
    // Important : keycloak a expréssement besoin de l'idToken pour la déconnexion
    // Sans cette implémentation, la déconnexion fonctionne uniquement côté client, mais la session persiste côté serveur
    async signOut({ token }) {
      const logoutUrl = `${process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/logout`;
      const idToken = token.idToken; // Récupérer le token d'ID pour la déconnexion
      const postLogoutRedirectUri =
        process.env.POST_LOGOUT_REDIRECT_URI || "http://localhost:3000";

      await fetch(
        `${logoutUrl}?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirectUri}`
      );

      localStorage.clear();
      sessionStorage.clear();
    },
  },
});
