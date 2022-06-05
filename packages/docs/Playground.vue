<style scoped>
demo-tab {
  cursor: pointer;
}

.playground-floating {
  width: 100%;
  height: 480px;
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
  border: none;
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
        @click="onCurrentTabChange(index)"
      >
        {{ demoFile.name }}
      </demo-tab>
    </div>
    <macaron-editor
      class="playground-floating"
      ref="editor"
      slot="demo-editor"
      :value="currentFileContent"
      @change="onFileContentChange()"
    ></macaron-editor>
    <div class="playground-floating usage">
      <div ref="editorBody" class="html-editor"></div>
      <div class="splitter">
        <div class="splitter-draggable"></div>
      </div>
      <iframe class="preview" ref="preview" sandbox="allow-scripts"></iframe>
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
import { debounce } from "lodash-es";

const demoFiles = [
  {
    name: "Basic",
    content: basicMacaronFile,
    html: `<my-component></my-component>`,
  },
  {
    name: "Interactions",
    content: interactionsMacaronFile,
    html: `<my-button>Button</my-button>`,
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
      currentFileContent: demoFiles[0].content,
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
    }, 500),
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
        value: "<my-component></my-component>",
        mode: "htmlmixed",
        lineNumbers: true,
        theme: "material-darker",
      }
    );
    this.codeMirror = codeMirror;
    codeMirror.on("change", () => {
      this.updatePreviewHTML();
    });

    this.updatePreviewHTML(basicMacaronFile, `<my-component></my-component>`);
  },
};
</script>
