import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import Spinner from "~/components/icons/Spinner";
import StatsIcon from "~/components/icons/StatsIcon";
import { useRouter } from "next/router";

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!headerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([e]) => e?.target.classList.toggle("shadow-sm", e.intersectionRatio < 1),
      { threshold: [1] }
    );

    observer.observe(headerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <header
      className="sticky -top-[1px] z-30 bg-base-100/75 backdrop-blur"
      ref={headerRef}
    >
      <div className="navbar mx-auto max-w-[1100px]">
        <div className="navbar-start">
          <Link href={"/"}>
            <button className="btn-ghost btn flex gap-2 text-lg font-medium text-primary">
              <StatsIcon width={20} height={20} className={"h-6 w-6"} /> Spotify
              stats
            </button>
          </Link>
        </div>

        <div className="navbar-center">
          <ul className="flex">
            <li>
              <Link href={"/tracks"}>
                <button className="btn-ghost btn">Top Tracks</button>
              </Link>
            </li>
            <li>
              <Link href={"/artists"}>
                <button className="btn-ghost btn">Top Artists</button>
              </Link>
            </li>
            <li>
              <Link href={"/genres"}>
                <button className="btn-ghost btn">Top Genres</button>
              </Link>
            </li>
            <li>
              <Link href={"/recent"}>
                <button className="btn-ghost btn">Recently played</button>
              </Link>
            </li>
          </ul>
        </div>

        <AccountButton />
      </div>
    </header>
  );
}

function AccountButton() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = useCallback(() => {
    void signOut();
    router.push("/");
  }, []);

  if (!isLoaded) {
    return (
      <div className="navbar-end">
        <Spinner />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="navbar-end">
        <SignInButton mode="modal" redirectUrl={window.location.href}>
          <button className="btn normal-case">Login</button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="navbar-end">
      <div className="dropdown-end dropdown dropdown-hover">
        <label
          tabIndex={0}
          className="btn-ghost btn flex gap-2 text-base font-bold normal-case"
        >
          {user.profileImageUrl && (
            <div className="avatar">
              <div className="w-8 rounded-xl">
                <Image
                  src={user.profileImageUrl}
                  alt={"Profile picture"}
                  width={24}
                  height={24}
                />
              </div>
            </div>
          )}

          {user.firstName}
          <svg
            width="12px"
            height="12px"
            className="fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048"
          >
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
          </svg>
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box menu-compact w-44 bg-base-100 p-2 shadow"
        >
          <li onClick={handleLogout}>
            <a>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
