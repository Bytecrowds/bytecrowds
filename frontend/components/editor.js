import { useEffect, useState } from "react";
import { useSyncedStore } from "@syncedstore/react";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { rust } from "@codemirror/lang-rust";
import { xml } from "@codemirror/lang-xml";
import { java } from "@codemirror/lang-java";
import { wast } from "@codemirror/lang-wast";
import { php } from "@codemirror/lang-php";
import { lezer } from "@codemirror/lang-lezer";
import { python } from "@codemirror/lang-python";

import { yCollab, yUndoManagerKeymap } from "y-codemirror.next";
import { keymap } from "@codemirror/view";

import store from "../realtime/store";
import { getAblyProvider } from "../realtime/store";

import updateDB from "../utils/updateDB";

const Editor = ({
  id,
  editorInitialText,
  editorInitialLanguage,
  requiresUpdate,
}) => {
  const [editorLanguage, setEditorLanguage] = useState(javascript());
  const [prevText, setPrevText] = useState(editorInitialText);
  const editorText = useSyncedStore(store).bytecrowdText;

  useEffect(() => {
    if (requiresUpdate) editorText.insert(0, editorInitialText);
    let ably = getAblyProvider(id);
    window.javascript = javascript;
    window.cpp = cpp;
    window.html = html;
    window.css = css;
    window.json = json;
    window.markdown = markdown;
    window.rust = rust;
    window.xml = xml;
    window.java = java;
    window.wast = wast;
    window.php = php;
    window.lezer = lezer;
    window.python = python;
    setEditorLanguage(Function("return " + editorInitialLanguage.toString())());

    const interval = setInterval(() => {
      setPrevText(editorText.toString());
    }, parseInt(process.env.NEXT_PUBLIC_UPDATE_INTERVAL));
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
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
            setEditorLanguage(
              Function("return " + e.target.value.toString())()
            );
            updateDB({
              name: id,
              language: e.target.value.toString(),
            });
          }}
          style={{
            color: "white",
          }}
        >
          <option value="javascript()">Javascript</option>
          <option value="cpp()">C++</option>
          <option value="html()">HTML</option>
          <option value="css()">CSS</option>
          <option value="json()">JSON</option>
          <option value="markdown()">Markdown</option>
          <option value="rust()">Rust</option>
          <option value="xml()">XML</option>
          <option value="java()">Java</option>
          <option value="wast()">Wast</option>
          <option value="lezer()">Lezer</option>
          <option value="python()">Python</option>
          <option value="php()">PHP</option>
        </select>
      </div>
    </>
  );
};

export default Editor;
