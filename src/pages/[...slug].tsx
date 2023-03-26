import { useRouter } from "next/router";
import { type NextPage } from "next/types";
import { useEffect } from "react";

const NotFoundPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    void router.push("/");
  }, [router]);

  return null;
};

export default NotFoundPage;
