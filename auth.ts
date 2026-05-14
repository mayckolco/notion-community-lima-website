import NextAuth from "next-auth";
import LinkedIn from "next-auth/providers/linkedin";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: { scope: "openid profile email" },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.picture = (profile as Record<string, unknown>).picture as string ?? token.picture;
        token.headline = (profile as Record<string, unknown>).headline as string ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.image = token.picture as string ?? session.user.image;
      (session.user as unknown as Record<string, unknown>).headline = token.headline ?? null;
      return session;
    },
  },
  pages: {
    signIn: "/postular",
  },
});
