<style scoped>
.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 400px;

  background: linear-gradient(
    180deg,
    rgba(24, 158, 255, 0.1) 0%,
    rgba(196, 196, 196, 0) 100%
  );
}

top-page {
  position: relative;
}

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
  height: 100%;
}

.splitter {
  width: 2px;
  background-color: #ccc;
}

.preview {
  flex: 1 0 0;
}

.demo-tabs {
  display: flex;
}
</style>

<template>
  <div class="background-gradient"></div>
  <top-page>
    <div slot="playground" class="playground">
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
        <div class="splitter"></div>
        <div class="preview"></div>
      </div>
    </div>
  </top-page>
</template>

<script>
import CodeMirror from "codemirror";
import "codemirror/mode/xml/xml";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material-darker.css";
import basicMacaronFile from "./examples/basic.macaron?raw";
import interactionsMacaronFile from "./examples/interactions.macaron?raw";

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
    import("./components.macaron");
    import("@macaron-app/editor/dist/webcomponent/main.js");
    import("@macaron-app/editor/dist/webcomponent/main.css");

    const editorBody = this.$refs.editorBody;

    const codeMirror = CodeMirror(
      (elt) => {
        editorBody.append(elt);
      },
      {
        value: "<div>Hello</div>",
        mode: "xml",
        lineNumbers: true,
        theme: "material-darker",
      }
    );
  },
};
</script>
