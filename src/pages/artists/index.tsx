import { type NextPage } from "next/types";
import * as Tabs from "@radix-ui/react-tabs";
import { api } from "~/utils/api";
import { useState } from "react";
import Head from "next/head";
import LoadingPageContent from "~/components/LoadingPageContent";
import ErrorAlert from "~/components/ErrorAlert";
import NoDataAlert from "~/components/NoDataAlert";
import { openLinkInNewTab } from "~/utils/openLinkInNewTab";
import Image from "next/image";
import { getHumanReadableTimeRange, TimeRanges } from "../tracks";
import CopyrightNotice from "~/components/CopyrightNotice";

const TopArtistsPage: NextPage = () => {
  const [currentTab, setCurrentTab] = useState<TimeRanges>(
    TimeRanges.fourWeeks
  );

  return (
    <>
      <Head>
        <title>Top Artists - Spotify Stats</title>
      </Head>

      <h1 className="pb-12 text-center text-4xl font-bold">
        Top Artists ({getHumanReadableTimeRange(currentTab)})
      </h1>

      <Tabs.Root
        value={currentTab}
        onValueChange={(value) => setCurrentTab(value as TimeRanges)}
      >
        <Tabs.List className="tabs mb-4 ">
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

        <Grid currentTab={currentTab} />
      </Tabs.Root>
    </>
  );
};

interface GridProps {
  currentTab: TimeRanges;
}
function Grid(props: GridProps) {
  const { currentTab } = props;

  const { data, isLoading, isError, error, refetch } =
    api.spotify.getTopArtists.useQuery(
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

  if (!data || !data.topArtists.length) {
    return <NoDataAlert />;
  }

  return (
    <>
      <div className="flex flex-wrap gap-12">
        {data.topArtists.map((artist, index) => {
          return (
            <div
              className="flex flex-col items-center justify-center gap-2"
              key={index}
            >
              <div
                className="relative h-80 w-80 cursor-pointer"
                onClick={() => openLinkInNewTab(artist.linkUrl)}
              >
                <Image
                  src={artist.image}
                  fill={true}
                  sizes={"320px"}
                  alt={artist.name}
                />
              </div>
              <span className="font-semibold">
                {index + 1}. {artist.name}
              </span>
            </div>
          );
        })}
      </div>

      <CopyrightNotice />
    </>
  );
}

export default TopArtistsPage;
