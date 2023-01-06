import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth";
import isAuthorized from "../utils/authorization";
import { authOptions } from "./api/auth/[...nextauth]";
import redis from "../database/redis";

import dynamic from "next/dynamic";
import AuthorizationError from "../components/error/authorization";
// Import the Editor client-side only to avoid initializing providers multiple times.
const Editor = dynamic(() => import("../components/editor"), {
  ssr: false,
});

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  // Check if the user is logged in.
  if (session) {
    const { id } = context.query;
    const bytecrowd = await redis.hgetall("bytecrowd:" + id);

    let _res = await fetch(
      "https://rest.ably.io/channels/" + id + "/presence",
      {
        headers: {
          Authorization:
            "Basic " + Buffer.from(process.env.ABLY_API_KEY).toString("base64"),
        },
      }
    );
    /*
    If there are no other connected peers, the document will be fetched from the DB.
    Otherwise, fetch the document from peers.
   */
    const fetchFromDB = (await _res.json()).length === 0;

    //  If the bytecrowd doesn't exist, return the default values.
    if (!bytecrowd)
      return {
        props: {
          editorInitialText: "",
          editorInitialLanguage: "javascript",
          fetchFromDB: fetchFromDB,
          login: "successful",
        },
      };

    // Checked if the user is authorized.
    if (!isAuthorized(bytecrowd.authorizedEmails, session))
      return {
        props: {
          login: "failed",
        },
      };

    return {
      props: {
        editorInitialText: bytecrowd.text,
        editorInitialLanguage: bytecrowd.language,
        fetchFromDB: fetchFromDB,
        login: "successful",
      },
    };
  }

  return {
    props: {
      login: "failed",
    },
  };
}

const Bytecrowd = ({
  editorInitialText,
  editorInitialLanguage,
  fetchFromDB,
  login,
}) => {
  const { id } = useRouter().query;

  if (login === "failed") return <AuthorizationError />;
  else if (login === "successful")
    return (
      <>
        <Editor
          id={id}
          editorInitialText={editorInitialText}
          editorInitialLanguage={editorInitialLanguage}
          fetchFromDB={fetchFromDB}
        ></Editor>
      </>
    );
};

export default Bytecrowd;
