<style scoped>
[hidden] {
  display: none !important;
}

demo-tab {
  cursor: pointer;
}

.playground-floating {
  width: 100%;
  height: 720px;
  border: 0.5px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15),
    0px 24px 30px rgba(0, 0, 0, 0.35);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
}

.playground-floating > :first-child {
  flex: 2 0 0;
}
.playground-floating > :last-child {
  flex: 1 0 0;
}
.playground {
  width: calc(100% - 64px);
  max-width: 1280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.usage {
  position: relative;
  background-color: white;

  display: flex;
  align-items: stretch;
}

.splitter {
  width: 4px;
  background-color: #ccc;
  position: relative;
}

.splitter-draggable {
  cursor: col-resize;
  position: absolute;
  top: 0;
  bottom: 0;
  left: -4px;
  right: -4px;
  height: 100%;
}

.preview {
  border: none;
}

.demo-tabs {
  display: flex;
}

.result-tabs {
  display: flex;
  border-bottom: 2px solid #0000000a;
}
.result-tabs > * {
  margin-bottom: -2px;
  cursor: pointer;
}

.result-pane {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 0;
}
.result-contents {
  flex: 1 0 0;
  position: relative;
}
.result-contents > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.result-content-hidden {
  opacity: 0;
  pointer-events: none;
}

:global(.CodeMirror) {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  height: 100%;
  overscroll-behavior-x: none;
}
</style>

<template>
  <div class="playground">
    <div class="demo-tabs">
      <demo-tab
        slot="demo-tabs"
        v-for="(demoFile, index) in demoFiles"
        :aria-selected="currentTab === index"
        @click="onCurrentTabChange(index)"
      >
        {{ demoFile.name }}
      </demo-tab>
    </div>

    <div class="playground-floating">
      <macaron-editor
        ref="editor"
        slot="demo-editor"
        :value="currentFileContent"
        @change="onFileContentChange()"
      ></macaron-editor>
      <div class="splitter">
        <div class="splitter-draggable"></div>
      </div>
      <div class="result-pane">
        <div class="result-tabs">
          <output-tab
            :aria-selected="outputTab === 'jsOutput'"
            @click="outputTab = 'jsOutput'"
            >JS Output</output-tab
          >
          <output-tab
            :aria-selected="outputTab === 'html'"
            @click="outputTab = 'html'"
            >HTML</output-tab
          >
          <output-tab
            :aria-selected="outputTab === 'preview'"
            @click="outputTab = 'preview'"
            >Preview</output-tab
          >
        </div>
        <div class="result-contents">
          <div
            ref="editorBody"
            class="html-editor"
            :class="{ 'result-content-hidden': outputTab !== 'html' }"
          ></div>
          <iframe
            class="preview"
            ref="preview"
            sandbox="allow-scripts"
            :class="{ 'result-content-hidden': outputTab !== 'preview' }"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dedent from "dedent";
import CodeMirror from "codemirror";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material-darker.css";
import basicMacaronFile from "./examples/basic.macaron?raw";
import interactionsMacaronFile from "./examples/interactions.macaron?raw";
import { generatePreviewHTML } from "./generatePreviewHTML";
import { debounce } from "lodash-es";

const demoFiles = [
  {
    name: "Basic",
    content: basicMacaronFile,
    html: dedent`<my-component>
                  <span slot="heading">
                    Design tool to create Web Components visually
                  </span>
                  <span slot="description">
                    Macaron is an open-source UI design tool to create and maintain Web Components.
                    Create components visually and use them with or without any framework.
                  </span>
                </my-component>`,
  },
  {
    name: "Interactions",
    content: interactionsMacaronFile,
    html: `<my-button>Button</my-button>`,
  },
  {
    name: "Responsive Design",
    content: interactionsMacaronFile, // TODO
    html: `<my-button>Button</my-button>`,
  },
];

export default {
  data() {
    return {
      currentTab: 0,
      demoFiles: demoFiles,
      currentFileContent: demoFiles[0].content,
      outputTab: "jsOutput",
    };
  },

  methods: {
    onCurrentTabChange(index) {
      this.currentTab = index;
      this.currentFileContent = this.demoFiles[index].content;
      this.codeMirror.setValue(this.demoFiles[index].html);
      this.updatePreviewHTML();
    },
    onFileContentChange() {
      this.currentFileContent = this.$refs.editor.value;
      this.updatePreviewHTML();
    },
    updatePreviewHTML: debounce(function () {
      const iframe = this.$refs.preview;
      iframe.srcdoc = generatePreviewHTML(
        this.currentFileContent,
        this.codeMirror.getValue()
      );
    }, 200),
  },

  mounted() {
    import("@macaron-app/editor/dist/webcomponent/main.js");
    import("@macaron-app/editor/dist/webcomponent/main.css");

    const editorBody = this.$refs.editorBody;

    const codeMirror = CodeMirror(
      (elt) => {
        editorBody.append(elt);
      },
      {
        value: demoFiles[0].html,
        mode: "htmlmixed",
        lineNumbers: true,
        //theme: "material-darker",
      }
    );
    this.codeMirror = codeMirror;
    codeMirror.on("change", () => {
      this.updatePreviewHTML();
    });

    this.updatePreviewHTML(demoFiles[0].content, demoFiles[0].html);
  },
};
</script>
