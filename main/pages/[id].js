import { unstable_getServerSession } from "next-auth";
import isAuthorized from "../utils/authorization";
import { authOptions } from "./api/auth/[...nextauth]";
import redis from "../database/redis";

import dynamic from "next/dynamic";
// Import the Editor client-side only to avoid initializing providers multiple times.
const Editor = dynamic(() => import("../components/editor"), {
  ssr: false,
});

export async function getServerSideProps(context) {
  const { req, res, query } = context;
  const session = await unstable_getServerSession(req, res, authOptions);
  const { id } = query;

  const bytecrowd = await redis.hgetall("bytecrowd:" + id);
  const presenceResponse = await fetch(
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
  const fetchFromDB = (await presenceResponse.json()).length === 0;

  // If the bytecrowd doesn't exist, return the default values.
  if (!bytecrowd)
    return {
      props: {
        editorInitialText: "",
        editorInitialLanguage: "javascript",
        fetchFromDB: fetchFromDB,
        login: "successful",
        id: id,
      },
    };

  // Checked if the user is authorized.
  if (!isAuthorized(bytecrowd.authorizedEmails, session))
    return {
      redirect: {
        destination: "/error/authorization?page=" + id,
        permanent: false,
      },
    };

  return {
    props: {
      editorInitialText: bytecrowd.text,
      editorInitialLanguage: bytecrowd.language,
      fetchFromDB: fetchFromDB,
      id: id,
    },
  };
}

const Bytecrowd = ({
  editorInitialText,
  editorInitialLanguage,
  fetchFromDB,
  id,
}) => {
  return (
    <Editor
      id={id}
      editorInitialText={editorInitialText}
      editorInitialLanguage={editorInitialLanguage}
      fetchFromDB={fetchFromDB}
    />
  );
};

export default Bytecrowd;
