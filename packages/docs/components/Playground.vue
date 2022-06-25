<style scoped>
[hidden] {
  display: none !important;
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
  width: 100%;
  max-width: 1280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.playground-alt {
  display: none;
}

@media (max-width: 768px) {
  .playground {
    display: none;
  }

  .playground-alt {
    display: block;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15),
      0px 24px 30px rgba(0, 0, 0, 0.35);
    border-radius: 10px;
  }
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
  width: 100%;
  height: 100%;
  overscroll-behavior-x: none;
}
</style>

<template>
  <div class="playground">
    <div class="demo-tabs">
      <macaron-demo-tab
        slot="demo-tabs"
        v-for="(demoFile, index) in demoFiles"
        :aria-selected="currentTab === index"
        @click="onCurrentTabChange(index)"
      >
        {{ demoFile.name }}
      </macaron-demo-tab>
    </div>

    <div class="playground-floating">
      <macaron-editor
        ref="editor"
        slot="demo-editor"
        :style="{ flex: `${ratio} 0 0` }"
        :value="currentFileContent"
        @change="onFileContentChange()"
      ></macaron-editor>
      <div
        class="splitter"
        @pointerdown="onSplitterMouseDown"
        @pointermove="onSplitterMouseMove"
        @pointerup="onSplitterMouseUp"
      >
        <div class="splitter-draggable"></div>
      </div>
      <div class="result-pane" :style="{ flex: `${1 - ratio} 0 0` }">
        <div class="result-tabs">
          <macaron-output-tab
            :aria-selected="outputTab === 'jsOutput'"
            @click="outputTab = 'jsOutput'"
            >JS Output</macaron-output-tab
          >
          <macaron-output-tab
            :aria-selected="outputTab === 'html'"
            @click="outputTab = 'html'"
            >HTML</macaron-output-tab
          >
          <macaron-output-tab
            :aria-selected="outputTab === 'preview'"
            @click="outputTab = 'preview'"
            >Preview</macaron-output-tab
          >
        </div>
        <div class="result-contents">
          <div
            ref="jsOutputEditorWrap"
            :class="{ 'result-content-hidden': outputTab !== 'jsOutput' }"
          ></div>
          <div
            ref="htmlEditorWrap"
            :class="{ 'result-content-hidden': outputTab !== 'html' }"
          ></div>
          <iframe
            class="preview"
            ref="preview"
            sandbox="allow-scripts"
            :hidden="outputTab !== 'preview'"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "codemirror/lib/codemirror.css";
import { compile } from "@macaron-elements/compiler";
import { generatePreviewHTML } from "./generatePreviewHTML";
import { debounce } from "lodash";
import { demoFiles } from "./demoFiles";

export default {
  data() {
    return {
      currentTab: 0,
      demoFiles: demoFiles,
      currentFileContent: demoFiles[0].content,
      jsOutput: compile(demoFiles[0].content),
      outputTab: "preview",
      ratio: 0.667,
    };
  },

  methods: {
    onCurrentTabChange(index) {
      this.currentTab = index;
      this.currentFileContent = this.demoFiles[index].content;
      this.jsOutput = compile(this.currentFileContent);
      this.jsOutputCodeMirror.setValue(this.jsOutput);
      this.codeMirror.setValue(this.demoFiles[index].html);
      this.updatePreviewHTML();
    },
    onFileContentChange() {
      this.currentFileContent = this.$refs.editor.value;
      this.updatePreviewHTML();
    },
    updatePreviewHTML: debounce(function () {
      this.jsOutput = compile(this.currentFileContent);
      this.jsOutputCodeMirror.setValue(this.jsOutput);

      const iframe = this.$refs.preview;
      iframe.srcdoc = generatePreviewHTML(
        this.jsOutput,
        this.codeMirror.getValue()
      );
    }, 200),

    onSplitterMouseDown(event) {
      event.target.setPointerCapture(event.pointerId);
      this.splitterMouseDown = true;
    },
    onSplitterMouseMove(event) {
      if (!this.splitterMouseDown) return;

      const splitable = event.target.closest(".playground-floating");
      const splitableRect = splitable.getBoundingClientRect();

      this.ratio = (event.clientX - splitableRect.left) / splitableRect.width;
    },
    onSplitterMouseUp(event) {
      event.target.releasePointerCapture(event.pointerId);
      this.splitterMouseDown = false;
    },
  },

  async mounted() {
    import("@macaron-elements/editor/dist/webcomponent/main.js");
    import("@macaron-elements/editor/dist/webcomponent/main.css");
    const CodeMirror = (await import("codemirror")).default;
    await import("codemirror/mode/htmlmixed/htmlmixed");

    const { htmlEditorWrap, jsOutputEditorWrap } = this.$refs;

    const codeMirror = CodeMirror(
      (elt) => {
        htmlEditorWrap.append(elt);
      },
      {
        value: demoFiles[0].html,
        mode: "htmlmixed",
        lineNumbers: true,
        lineWrapping: true,
      }
    );
    this.codeMirror = codeMirror;
    codeMirror.on("change", () => {
      this.updatePreviewHTML();
    });

    this.updatePreviewHTML(demoFiles[0].content, demoFiles[0].html);

    this.jsOutputCodeMirror = CodeMirror(
      (elt) => {
        jsOutputEditorWrap.append(elt);
      },
      {
        value: compile(demoFiles[0].content),
        mode: "javascript",
        lineNumbers: true,
        lineWrapping: true,
        readOnly: true,
      }
    );
  },
};
</script>
