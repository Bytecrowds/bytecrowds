import { useEffect, useState } from "react";
import { useSyncedStore } from "@syncedstore/react";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";

import { yCollab, yUndoManagerKeymap } from "y-codemirror.next";
import { keymap } from "@codemirror/view";

import store from "../realtime/store";
import { getAblyProvider } from "../realtime/store";

import updateDB from "../utils/updateDB";
import { langs, langOptions } from "../utils/language";

const Editor = ({
  id,
  editorInitialText,
  editorInitialLanguage,
  fetchFromDB,
}) => {
  const [editorLanguage, setEditorLanguage] = useState(
    langs[editorInitialLanguage]
  );
  const [prevText, setPrevText] = useState(editorInitialText);
  const editorText = useSyncedStore(store).bytecrowdText;

  useEffect(() => {
    if (fetchFromDB) editorText.insert(0, editorInitialText);
    // Setup the Ably provider at first render to prevent spawning connections.
    let ably = getAblyProvider(id);

    // Every x seconds, store the current text in a variable.
    const interval = setInterval(() => {
      setPrevText(editorText.toString());
    }, parseInt(process.env.NEXT_PUBLIC_UPDATE_INTERVAL));
    // Clear the interval to prevent memory leaks and duplication.
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // If the text changed, update the DB.
    updateDB({ name: id, text: editorText.toString() });
  }, [prevText]);

  return (
    <>
      <CodeMirror
        value={editorText.toString()}
        theme={oneDark}
        extensions={[
          keymap.of([...yUndoManagerKeymap]),
          editorLanguage,
          yCollab(editorText),
        ]}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          backgroundColor: "#18db87",
          width: "100%",
          height: "3%",
          marginBottom: 0,
          paddingBottom: 0,
        }}
      >
        <label htmlFor="languages" style={{ color: "black" }}>
          Language:
        </label>
        <select
          name="languages"
          defaultValue={editorInitialLanguage}
          onChange={(e) => {
            setEditorLanguage(langs[e.target.value]);
            updateDB({
              name: id,
              language: e.target.value.toString(),
            });
          }}
          style={{
            color: "white",
          }}
        >
          {langOptions.map((lang) => (
            <option value={lang}>{lang}</option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Editor;
