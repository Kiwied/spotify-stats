import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

async function getSpotifyAccessToken(userId: string) {
  const [accessToken] = await clerkClient.users.getUserOauthAccessToken(
    userId,
    "oauth_spotify"
  );

  if (!accessToken) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Could not retrieve Spotify access token",
    });
  }

  return accessToken;
}

export default getSpotifyAccessToken;
