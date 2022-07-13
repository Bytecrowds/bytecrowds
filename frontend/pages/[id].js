import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../components/editor"), {
  ssr: false,
});

export async function getServerSideProps(context) {
  const { id } = context.query;

  let _raw = await fetch(
    process.env.NEXT_PUBLIC_BACKEND + "/bytecrowd/" + id
  );
  let bytecrowd = await _raw.json();

  let requiresUpdate = false;
  let _res = await fetch("https://rest.ably.io/channels/" + id + "/presence", {
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(process.env.NEXT_PUBLIC_ABLY_API_KEY).toString("base64"),
    },
  });
  if ((await _res.json()).length == 0) requiresUpdate = true;

  let editorInitialText = bytecrowd.text || "";
  let editorInitialLanguage = bytecrowd.language || "javascript()";

  return {
    props: {
      editorInitialText,
      editorInitialLanguage,
      requiresUpdate,
    },
  };
}

const Bytecrowd = ({
  editorInitialText,
  editorInitialLanguage,
  requiresUpdate,
}) => {
  const { id } = useRouter().query;

  return (
    <>
      <Editor
        id={id}
        editorInitialText={editorInitialText}
        editorInitialLanguage={editorInitialLanguage}
        requiresUpdate={requiresUpdate}
      ></Editor>
    </>
  );
};

export default Bytecrowd;
