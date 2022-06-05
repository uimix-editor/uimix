<style scoped>
demo-tab {
  cursor: pointer;
}

.playground-floating {
  width: 100%;
  height: 640px;
  border: 0.5px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15),
    0px 24px 30px rgba(0, 0, 0, 0.35);
  border-radius: 10px;
  overflow: hidden;
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

.html-editor {
  flex: 1 0 0;
}
.html-editor :global(.CodeMirror) {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  height: 100%;
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
  flex: 1 0 0;
}

.demo-tabs {
  display: flex;
}
</style>

<template>
  <div class="playground">
    <div class="demo-tabs">
      <demo-tab
        slot="demo-tabs"
        v-for="(demoFile, index) in demoFiles"
        :aria-selected="currentTab === index"
        @click="currentTab = index"
      >
        {{ demoFile.name }}
      </demo-tab>
    </div>
    <macaron-editor
      class="playground-floating"
      slot="demo-editor"
      :value="currentDemoFile.content"
    ></macaron-editor>
    <div class="playground-floating usage">
      <div ref="editorBody" class="html-editor"></div>
      <div class="splitter">
        <div class="splitter-draggable"></div>
      </div>
      <iframe class="preview" ref="preview"></iframe>
    </div>
  </div>
</template>

<script>
import CodeMirror from "codemirror";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material-darker.css";
import basicMacaronFile from "./examples/basic.macaron?raw";
import interactionsMacaronFile from "./examples/interactions.macaron?raw";
import { generatePreviewHTML } from "./generatePreviewHTML";

const demoFiles = [
  {
    name: "Basic",
    content: basicMacaronFile,
  },
  {
    name: "Interactions",
    content: interactionsMacaronFile,
  },
  {
    name: "Responsive Design",
    content: interactionsMacaronFile, // TODO
  },
];

export default {
  data() {
    return {
      currentTab: 0,
      demoFiles: demoFiles,
    };
  },

  computed: {
    currentDemoFile() {
      return this.demoFiles[this.currentTab];
    },
  },

  mounted() {
    import("@macaron-app/editor/dist/webcomponent/main.js");
    import("@macaron-app/editor/dist/webcomponent/main.css");

    const editorBody = this.$refs.editorBody;
    const iframe = this.$refs.preview;

    const codeMirror = CodeMirror(
      (elt) => {
        editorBody.append(elt);
      },
      {
        value: "<div>Hello</div>",
        mode: "htmlmixed",
        lineNumbers: true,
        theme: "material-darker",
      }
    );

    iframe.srcdoc = generatePreviewHTML(
      basicMacaronFile,
      `<my-component></my-component>`
    );
  },
};
</script>
