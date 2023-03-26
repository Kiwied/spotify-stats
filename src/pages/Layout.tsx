import Head from "next/head";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Spotify Stats</title>
        <meta
          name="description"
          content="Get insights into your spotify listening habits! View your spotify track, 
          artist and genre ranking and compare them to your last visit."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="base-100 flex min-h-screen flex-col justify-between">
        <Navbar />
        <main className="mx-auto mb-auto w-full max-w-[1100px] py-8">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
