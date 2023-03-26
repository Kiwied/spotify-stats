import { NextPage } from "next/types";
import * as Tabs from "@radix-ui/react-tabs";
import { api } from "~/utils/api";
import { useState } from "react";
import Head from "next/head";
import LoadingPageContent from "~/components/LoadingPageContent";
import ErrorAlert from "~/components/ErrorAlert";
import NoDataAlert from "~/components/NoDataAlert";
import { getHumanReadableTimeRange, TimeRanges } from "../tracks";

const TopGenresPage: NextPage = () => {
  const [currentTab, setCurrentTab] = useState<TimeRanges>(
    TimeRanges.fourWeeks
  );

  return (
    <>
      <Head>
        <title>Spotify Stats - Top Genres</title>
      </Head>

      <h1 className="pb-12 text-center text-4xl font-bold">
        Top Genres ({getHumanReadableTimeRange(currentTab)})
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

        <GenreList currentTab={currentTab} />
      </Tabs.Root>
    </>
  );
};

interface GenreListProps {
  currentTab: TimeRanges;
}
function GenreList(props: GenreListProps) {
  const { currentTab } = props;

  const { data, isLoading, isError, error, refetch } =
    api.spotify.getTopGenres.useQuery(
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

  if (!data) {
    return <NoDataAlert />;
  }

  return (
    <div className="flex flex-col gap-4 text-lg">
      {data.topGenres.map(({ name, value }, index) => (
        <div className="flex flex-col gap-2">
          {index + 1}. {capitalize(name)}
          <progress
            className="progress progress-primary h-6"
            value={value}
            max={data.max}
          />
        </div>
      ))}
    </div>
  );
}

function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default TopGenresPage;
