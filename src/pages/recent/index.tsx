import { type NextPage } from "next/types";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Head from "next/head";
import Image from "next/image";
import LoadingPageContent from "~/components/LoadingPageContent";
import ErrorAlert from "~/components/ErrorAlert";
import NoDataAlert from "~/components/NoDataAlert";
import { openLinkInNewTab } from "~/utils/openLinkInNewTab";
import CopyrightNotice from "~/components/CopyrightNotice";

dayjs.extend(relativeTime);

const RecentlyPlayedPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Spotify Stats - Recently played Tracks</title>
      </Head>

      <h1 className="pb-12 text-center text-4xl font-bold">
        Recently played Tracks
      </h1>

      <Table />
    </>
  );
};

function Table() {
  const { data, isLoading, isError, error, refetch } =
    api.spotify.getRecentlyPlayed.useQuery(undefined, {
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: false,
    });

  if (isLoading) {
    return <LoadingPageContent />;
  }

  if (isError) {
    return <ErrorAlert refetch={refetch} message={error.message} />;
  }

  if (!data || !data.recentTracks.length) {
    return <NoDataAlert />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Track</th>
              <th>Artist(s)</th>
              <th>Played at</th>
            </tr>
          </thead>

          <tbody>
            {data.recentTracks.map((track, index) => (
              <tr
                className="hover cursor-pointer"
                onClick={() => openLinkInNewTab(track.linkUrl)}
                key={index}
                title={`"${track.name}" by ${track.artists}`}
              >
                <th className="p-2">
                  <div className={"relative h-12 w-12"}>
                    <Image
                      src={track.image}
                      alt={`${track.name}'s cover`}
                      fill={true}
                      sizes={"48px"}
                    />
                  </div>
                </th>
                <td className="max-w-[450px] truncate">{track.name}</td>
                <td className="max-w-[400px] truncate">{track.artists}</td>
                <td
                  className="max-w-[165px] truncate"
                  title={dayjs(track.playedAt).format("DD.MM.YYYY, HH:mm")}
                >
                  {dayjs(track.playedAt).fromNow()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="alert alert-info mx-auto mt-8 max-w-3xl shadow-lg">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6 flex-shrink-0 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>
            NOTE: A track must be played for more than 30 seconds to be included
            in play history and any tracks listened to while in &quot;Private
            Session&quot; will not be shown here.
          </span>
        </div>
      </div>

      <CopyrightNotice />
    </>
  );
}

export default RecentlyPlayedPage;
