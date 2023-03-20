import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { isValidPassword } from "../../../lib/validation";
import clientPromise from "../../../lib/db/db";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.email.split("@")[0],
          email: profile.email,
          image: profile.picture,
          nickname: "",
          userinfo: "",
        };
      },
      token: {
        params: {
          nickname: "",
          userinfo: "",
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.email.split("@")[0],
          email: profile.email,
          image: profile.avatar_url,
          nickname: "",
          userinfo: "",
        };
      },
      token: {
        params: {
          nickname: "",
          userinfo: "",
        },
      },
    }),
    CredentialsProvider({
      id: "email-password",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        const enteredEmail = credentials?.email;
        const password = credentials?.password;
        const client = await clientPromise;
        const database = client.db();
        const usersCollection = database.collection("users");
        const user = await usersCollection.findOne({ email: enteredEmail });

        if (!user) {
          throw new Error("Not registered");
        } else {
          const { hashedPassword, salt } = user;
          if (
            typeof password === "string" &&
            isValidPassword(password, hashedPassword, salt)
          ) {
            return user;
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 2 * 24 * 60 * 60,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.nickname = user.nickname;
        token.userinfo = user.userinfo;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.nickname = token.nickname;
        session.user.userinfo = token.userinfo;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
