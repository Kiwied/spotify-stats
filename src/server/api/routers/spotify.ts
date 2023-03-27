/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getHumanReadableTimeRange, TimeRanges } from "~/pages/tracks";
import getSpotifyAccessToken from "~/server/utils/getSpotifyAccessToken";

export const spotifyRouter = createTRPCRouter({
  getRecentlyPlayed: protectedProcedure
    .output(
      z.object({
        recentTracks: z.array(
          z.object({
            playedAt: z.string().datetime(),
            artists: z.string(),
            name: z.string(),
            linkUrl: z.string().url(),
            image: z.string().url(),
          })
        ),
      })
    )
    .query(async ({ ctx }) => {
      const accessToken = await getSpotifyAccessToken(ctx.auth.userId);

      const recentTracks = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played?limit=50",
        {
          headers: {
            method: "GET",
            Authorization: `Bearer ${accessToken.token}`,
          },
        }
      )
        .then((data) => data.json())
        .then((data) =>
          data.items.map((track: any) => {
            const artists = track.track.artists
              .map((artist: any) => artist.name)
              .join(", ");

            return {
              playedAt: track.played_at,
              artists,
              name: track.track.name,
              linkUrl: track.track.external_urls.spotify,
              image: track.track.album.images[0].url,
            };
          })
        );

      return {
        recentTracks,
      };
    }),

  getTopTracks: protectedProcedure
    .input(z.object({ timeRange: z.nativeEnum(TimeRanges) }))
    .output(
      z.object({
        topTracks: z.array(
          z.object({
            artists: z.string(),
            name: z.string(),
            linkUrl: z.string().url(),
            image: z.string().url(),
          })
        ),
        trackUrisArray: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const accessToken = await getSpotifyAccessToken(ctx.auth.userId);

      const trackUrisArray: string[] = [];
      const topTracks = await fetch(
        `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${input.timeRange}`,
        {
          headers: {
            method: "GET",
            Authorization: `Bearer ${accessToken.token}`,
          },
        }
      )
        .then((data) => data.json())
        .then((data) =>
          data.items.map((track: any) => {
            trackUrisArray.push(track.uri);

            const artists = track.artists
              .map((artist: any) => artist.name)
              .join(", ");

            return {
              artists,
              name: track.name,
              linkUrl: track.external_urls.spotify,
              image: track.album.images[0].url,
            };
          })
        );

      return {
        topTracks,
        trackUrisArray,
      };
    }),

  createTopTracksPlaylist: protectedProcedure
    .input(
      z.object({
        timeRange: z.nativeEnum(TimeRanges),
        trackUris: z.array(z.string()),
      })
    )
    .output(z.object({ createdPlaylistUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const accessToken = await getSpotifyAccessToken(ctx.auth.userId);
      const spotifyUserId = await fetch(`https://api.spotify.com/v1/me`, {
        headers: {
          method: "GET",
          Authorization: `Bearer ${accessToken.token}`,
        },
      })
        .then((data) => data.json())
        .then((data) => data.id);

      const humanReadableTimeRange = getHumanReadableTimeRange(input.timeRange);
      const date = new Date().toLocaleDateString();
      const createdPlaylist = await fetch(
        `https://api.spotify.com/v1/users/${spotifyUserId}/playlists`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.token}`,
          },
          body: JSON.stringify({
            collaborative: false,
            description: `Your favorite tracks ${humanReadableTimeRange} as of ${date}`,
            name: `Top Tracks ${date} (${humanReadableTimeRange})`,
            public: false,
          }),
        }
      )
        .then((data) => data.json())
        .then((data) => ({ id: data.id, linkUrl: data.external_urls.spotify }));

      await fetch(
        `https://api.spotify.com/v1/users/${spotifyUserId}/playlists/${createdPlaylist.id}/tracks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.token}`,
          },
          body: JSON.stringify({
            uris: input.trackUris,
          }),
        }
      );

      return { createdPlaylistUrl: createdPlaylist.linkUrl };
    }),

  getTopArtists: protectedProcedure
    .input(z.object({ timeRange: z.nativeEnum(TimeRanges) }))
    .output(
      z.object({
        topArtists: z.array(
          z.object({
            name: z.string(),
            linkUrl: z.string().url(),
            image: z.string().url(),
          })
        ),
      })
    )
    .query(async ({ ctx, input }) => {
      const accessToken = await getSpotifyAccessToken(ctx.auth.userId);

      const topArtists = await fetch(
        `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${input.timeRange}`,
        {
          headers: {
            method: "GET",
            Authorization: `Bearer ${accessToken.token}`,
          },
        }
      )
        .then((data) => data.json())
        .then((data) =>
          data.items.map((artist: any) => {
            return {
              name: artist.name,
              linkUrl: artist.external_urls.spotify,
              image: artist.images[0].url,
            };
          })
        );

      return {
        topArtists,
      };
    }),

  getTopGenres: protectedProcedure
    .input(z.object({ timeRange: z.nativeEnum(TimeRanges) }))
    .output(
      z.object({
        topGenres: z.array(z.object({ name: z.string(), value: z.number() })),
        max: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const accessToken = await getSpotifyAccessToken(ctx.auth.userId);

      const topGenres = await fetch(
        `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${input.timeRange}`,
        {
          headers: {
            method: "GET",
            Authorization: `Bearer ${accessToken.token}`,
          },
        }
      )
        .then((data) => data.json())
        .then((data) => {
          const allEncounteredGenreNames = data.items.flatMap(
            (artist: any) => artist.genres
          );

          const rawTopGenres: Record<string, number> = {};
          allEncounteredGenreNames.forEach((genreName: string) => {
            rawTopGenres[genreName] = (rawTopGenres[genreName] || 0) + 1;
          });

          const processedTopGenresArray = Object.entries(rawTopGenres)
            .filter((genre) => genre[1] >= 3)
            .sort((a, b) => b[1] - a[1]);

          const topGenres = processedTopGenresArray.map((genre) => ({
            name: genre[0],
            value: genre[1],
          }));

          return {
            topGenres,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            max: processedTopGenresArray[0]![1],
          };
        });

      return {
        ...topGenres,
      };
    }),
});
