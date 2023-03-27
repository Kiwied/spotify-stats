import { type NextPage } from "next/types";
import * as Tabs from "@radix-ui/react-tabs";
import { api, type RouterOutputs } from "~/utils/api";
import { useState } from "react";
import Head from "next/head";
import LoadingPageContent from "~/components/LoadingPageContent";
import ErrorAlert from "~/components/ErrorAlert";
import NoDataAlert from "~/components/NoDataAlert";
import { getHumanReadableTimeRange, TimeRanges } from "../tracks";
import { animated, useSpring, easings } from "@react-spring/web";

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
      {data.topGenres.map((genre, index) => (
        <ProgressBar key={index} genre={genre} index={index} max={data.max} />
      ))}
    </div>
  );
}

interface ProgressBarProps {
  genre: RouterOutputs["spotify"]["getTopGenres"]["topGenres"][number];
  max: RouterOutputs["spotify"]["getTopGenres"]["max"];
  index: number;
}

function ProgressBar(props: ProgressBarProps) {
  const { genre, index, max } = props;

  const spring = useSpring({
    value: genre.value / max,
    from: { value: 0 },
    config: { duration: 1000, easing: easings.easeOutCirc },
  });

  return (
    <div className="flex flex-col gap-2">
      <span>
        {index + 1}. {capitalize(genre.name)}
      </span>
      <animated.progress
        className="progress progress-primary h-6"
        value={spring.value}
        max={1}
      />
    </div>
  );
}

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default TopGenresPage;
