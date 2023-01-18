import { useEffect, useState } from "react";
import { useSyncedStore } from "@syncedstore/react";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";

import { yCollab, yUndoManagerKeymap } from "y-codemirror.next";
import { keymap } from "@codemirror/view";

import store from "../realtime/store";
import { setupAbly } from "../realtime/store";

import { updateDB } from "../utils/database";
import { langs, langOptions } from "../utils/language";

import { useDisclosure } from "@chakra-ui/react";
import AuthorizationModal from "./authorization";

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
  // Control the authorization modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (fetchFromDB) editorText.insert(0, editorInitialText);
    // Setup the Ably provider at first render to prevent spawning connections.
    setupAbly(id);

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
      <AuthorizationModal isOpen={isOpen} onClose={onClose} id={id} />
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
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <button
          style={{
            marginLeft: "15px",
            color: "white",
            backgroundColor: "black",
          }}
          onClick={onOpen}
        >
          set auth
        </button>
      </div>
    </>
  );
};

export default Editor;
