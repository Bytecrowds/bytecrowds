import { useRouter } from "next/router";
import dynamic from "next/dynamic";
// Import the Editor client-side only to avoid initializing providers multiple times.
const Editor = dynamic(() => import("../components/editor"), {
  ssr: false,
});

export async function getServerSideProps(context) {
  const { id } = context.query;

  let _raw = await fetch(process.env.NEXT_PUBLIC_BACKEND + "/bytecrowd/" + id);
  let bytecrowd = await _raw.json();

  // If the bytecrowd doesn't exist, use default values.
  let editorInitialText = bytecrowd.text || "";
  let editorInitialLanguage = bytecrowd.language || "javascript";

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
    },
  };
}

const Bytecrowd = ({
  editorInitialText,
  editorInitialLanguage,
  fetchFromDB,
}) => {
  const { id } = useRouter().query;

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
