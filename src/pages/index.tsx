import { type NextPage } from "next";
import Link from "next/link";
import NumberedListIcon from "~/components/icons/NumberedListIcon";
import ArrowsIcon from "~/components/icons/ArrowsIcon";
import SaveIcon from "~/components/icons/SaveIcon";
import RepeatIcon from "~/components/icons/RepeatIcon";

const Home: NextPage = () => {
  return (
    <>
      <div className="hero mb-8 w-full rounded-xl bg-base-200">
        <div className="hero-content py-16 px-8 text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Spotify Stats</h1>
            <p className="py-6">Choose what you want to see:</p>
            <div className="flex flex-col gap-2">
              <Link href={"/tracks"}>
                <button className="btn-primary btn-wide btn">Top Tracks</button>
              </Link>
              <Link href={"/artists"}>
                <button className="btn-primary btn-wide btn">
                  Top Artists
                </button>
              </Link>
              <Link href={"/genres"}>
                <button className="btn-primary btn-wide btn">Top Genres</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[650px] flex-col gap-4">
        <div className="card card-side bg-base-100 shadow-xl">
          <NumberedListIcon
            className="ml-8 h-[120px] min-w-[120px] self-center"
            width={120}
            height={120}
          />
          <div className="card-body">
            <h2 className="card-title">Your own charts</h2>
            <p>
              View your most listened tracks, artists and genres and switch
              between 3 different time periods. Your data is updated
              approximately every day.
            </p>
          </div>
        </div>

        <div className="card card-side bg-base-100 shadow-xl">
          <ArrowsIcon
            className="ml-8 h-[120px] min-w-[120px] self-center"
            width={120}
            height={120}
          />
          <div className="card-body">
            <h2 className="card-title">Compare to last visit (WIP)</h2>
            <p>
              See how your personal ranking changes over time, indicated by
              arrows compared to your last visit
            </p>
          </div>
        </div>

        <div className="card card-side bg-base-100 shadow-xl">
          <SaveIcon
            className="ml-8 h-[120px] min-w-[120px] self-center"
            width={120}
            height={120}
          />
          <div className="card-body">
            <h2 className="card-title">Create playlist</h2>
            <p>
              Create a playlist from your personal charts and listen to them
              directly in your spotify app
            </p>
          </div>
        </div>

        <div className="card card-side bg-base-100 py-3 shadow-xl">
          <RepeatIcon
            className="ml-8 h-[120px] min-w-[120px] self-center"
            width={120}
            height={120}
          />
          <div className="card-body">
            <h2 className="card-title">Recently played tracks</h2>
            <p>Check out your recently played tracks with timestamps</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
