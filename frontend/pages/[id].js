import { useRouter } from "next/router";

import { getBytecrowd } from "../utils/db";

import dynamic from "next/dynamic";
// Import the Editor client-side only to avoid initializing providers multiple times.
const Editor = dynamic(() => import("../components/editor"), {
  ssr: false,
});

export async function getServerSideProps(context) {
  const { id } = context.query;

  const bytecrowd = await getBytecrowd(
    id,
    {
      authMethod: "IP",
    },
    context.req.headers["x-forwarded-for"]
  );

  // If the bytecrowd doesn't exist, use the default values.
  let editorInitialText = bytecrowd.text || "";
  let editorInitialLanguage = bytecrowd.language || "javascript";

  let requiresAuth = false;
  if (bytecrowd.authFailed) requiresAuth = true;

  let fetchFromDB = false;
  let _res = await fetch("https://rest.ably.io/channels/" + id + "/presence", {
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(process.env.NEXT_PUBLIC_ABLY_API_KEY).toString("base64"),
    },
  });
  /*
    If there are no other connected peers, the document will be fetched from the DB.
    Otherwise, fetch the document from peers.
   */
  if ((await _res.json()).length == 0) fetchFromDB = true;

  return {
    props: {
      editorInitialText,
      editorInitialLanguage,
      fetchFromDB,
      requiresAuth,
    },
  };
}

const Bytecrowd = ({
  editorInitialText,
  editorInitialLanguage,
  fetchFromDB,
  requiresAuth,
}) => {
  const { id } = useRouter().query;

  return (
    <>
      <Editor
        id={id}
        editorInitialText={editorInitialText}
        editorInitialLanguage={editorInitialLanguage}
        fetchFromDB={fetchFromDB}
        requiresAuth={requiresAuth}
      ></Editor>
    </>
  );
};

export default Bytecrowd;
