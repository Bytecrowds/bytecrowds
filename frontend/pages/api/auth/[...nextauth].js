import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import redis from "../../../database/redis";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";

export const authOptions = {
  adapter: UpstashRedisAdapter(redis),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
