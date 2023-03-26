import { type NextPage } from "next/types";
import * as Tabs from "@radix-ui/react-tabs";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import Head from "next/head";
import LoadingPageContent from "~/components/LoadingPageContent";
import ErrorAlert from "~/components/ErrorAlert";
import NoDataAlert from "~/components/NoDataAlert";
import { openLinkInNewTab } from "~/utils/openLinkInNewTab";
import Image from "next/image";
import CopyrightNotice from "~/components/CopyrightNotice";

export enum TimeRanges {
  fourWeeks = "short_term",
  sixMonths = "medium_term",
  allTime = "long_term",
}

export function getHumanReadableTimeRange(timeRange: TimeRanges) {
  switch (timeRange) {
    case TimeRanges.fourWeeks:
      return "last 4 weeks";
    case TimeRanges.sixMonths:
      return "last 6 months";
    case TimeRanges.allTime:
      return "all time";
  }
}

const TopTracksPage: NextPage = () => {
  const [currentTab, setCurrentTab] = useState<TimeRanges>(
    TimeRanges.fourWeeks
  );

  return (
    <>
      <Head>
        <title>Spotify Stats - Top Tracks</title>
      </Head>

      <h1 className="pb-12 text-center text-4xl font-bold">
        Top Tracks ({getHumanReadableTimeRange(currentTab)})
      </h1>

      <Tabs.Root
        value={currentTab}
        onValueChange={(value) => setCurrentTab(value as TimeRanges)}
      >
        <Tabs.List className="tabs mb-4">
          <Tabs.Trigger
            className="tab-bordered tab tab-lg data-[state=active]:tab-active"
            value={TimeRanges.fourWeeks}
          >
            Last 4 weeks
          </Tabs.Trigger>
          <Tabs.Trigger
            className="tab-bordered tab tab-lg data-[state=active]:tab-active"
            value={TimeRanges.sixMonths}
          >
            Last 6 months
          </Tabs.Trigger>
          <Tabs.Trigger
            className="tab-bordered tab tab-lg data-[state=active]:tab-active"
            value={TimeRanges.allTime}
          >
            All time
          </Tabs.Trigger>
        </Tabs.List>

        <Table currentTab={currentTab} />
      </Tabs.Root>
    </>
  );
};

interface TableProps {
  currentTab: TimeRanges;
}
function Table(props: TableProps) {
  const { currentTab } = props;

  const { data, isLoading, isError, error, refetch } =
    api.spotify.getTopTracks.useQuery(
      { timeRange: currentTab },
      {
        staleTime: 1000 * 60 * 2, // 2 minutes
        refetchOnWindowFocus: false,
      }
    );

  if (isLoading) {
    return <LoadingPageContent />;
  }

  if (isError) {
    return <ErrorAlert refetch={refetch} message={error.message} />;
  }

  if (!data || !data.topTracks.length) {
    return <NoDataAlert />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th>Track</th>
              <th>Artist(s)</th>
            </tr>
          </thead>

          <tbody>
            {data.topTracks.map((track, index) => (
              <tr
                className="hover cursor-pointer"
                onClick={() => openLinkInNewTab(track.linkUrl)}
                key={index}
                title={`"${track.name}" by ${track.artists}`}
              >
                <td className="max-w-[30px] text-lg font-bold">{index + 1}</td>
                <th className="max-w-[48px] p-2">
                  <div className={"relative h-12 w-12"}>
                    <Image
                      src={track.image}
                      alt={`${track.name}'s cover`}
                      fill={true}
                      sizes={"48px"}
                    />
                  </div>
                </th>
                <td className="max-w-[550px] truncate">{track.name}</td>
                <td className="max-w-[450px] truncate">{track.artists}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pt-4 text-center">
        <CreatePlaylistButton
          currentTab={currentTab}
          trackUrisArray={data.trackUrisArray}
        />
      </div>
      
      <CopyrightNotice />
    </>
  );
}

interface CreatePlaylistButtonProps {
  currentTab: TimeRanges;
  trackUrisArray: string[];
}

function CreatePlaylistButton(props: CreatePlaylistButtonProps) {
  const { currentTab, trackUrisArray } = props;

  const { mutate, data, status, reset } =
    api.spotify.createTopTracksPlaylist.useMutation();

  useEffect(() => {
    reset();
  }, [currentTab, reset]);

  if (status === "error") {
    return <button className="btn-error btn-wide btn">Error</button>;
  }

  if (status === "loading") {
    return (
      <button className="btn-outline loading btn-primary btn-wide btn">
        Create playlist
      </button>
    );
  }

  if (status === "success" && data.createdPlaylistUrl) {
    return (
      <button
        className="btn-info btn-wide btn"
        onClick={() => openLinkInNewTab(data.createdPlaylistUrl)}
      >
        View playlist
      </button>
    );
  }

  return (
    <button
      className="btn-outline btn-primary btn-wide btn"
      onClick={() => {
        mutate({ timeRange: currentTab, trackUris: trackUrisArray });
      }}
    >
      Create playlist
    </button>
  );
}

export default TopTracksPage;
