import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { useEffect } from "react";

const NotFoundPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, []);

  return null;
};

export default NotFoundPage;
