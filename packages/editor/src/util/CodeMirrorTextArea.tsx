import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";
import React, { useEffect } from "react";

export const CodeMirrorTextArea: React.FC<{
  className?: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange, ...props }) => {
  const textareaRef = React.createRef<HTMLTextAreaElement>();
  const ref = React.useRef<CodeMirror.EditorFromTextArea>();

  useEffect(() => {
    if (!textareaRef.current) {
      return;
    }

    const editor = CodeMirror.fromTextArea(textareaRef.current, {
      lineNumbers: true,
      // theme: "material-darker",
      mode: "html",
    });
    ref.current = editor;
    editor.setValue(value);
    editor.execCommand("selectAll");

    setTimeout(() => {
      editor.focus();
    }, 0);

    return () => {
      editor.toTextArea();
    };
  }, []);

  // useEffect(() => {
  //   ref.current?.setValue(value);
  // }, [value]);

  useEffect(() => {
    ref.current?.on("change", (editor) => {
      console.log("change");
      onChange(editor.getValue());
    });
  }, [onChange]);

  return <textarea {...props} ref={textareaRef} />;
};
