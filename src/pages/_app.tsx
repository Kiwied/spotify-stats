import { type AppType } from "next/app";
import Layout from "./Layout";
import { api } from "~/utils/api";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { useRouter } from "next/router";
import "~/styles/globals.css";

const authProtectedPages = ["/tracks", "/artists", "/genres", "/recent"];

const MyApp: AppType = ({ Component, pageProps }) => {
  const { pathname } = useRouter();
  const isAuthProtectedPage = authProtectedPages.includes(pathname);

  return (
    <ClerkProvider {...pageProps}>
      {isAuthProtectedPage ? (
        <>
          <SignedIn>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
