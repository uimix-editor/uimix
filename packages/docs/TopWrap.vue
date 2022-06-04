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

macaron-editor {
  width: calc(100% - 64px);
  max-width: 1280px;
  height: 640px;

  border: 0.5px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15),
    0px 24px 30px rgba(0, 0, 0, 0.35);
  border-radius: 10px;
  overflow: hidden;
}

demo-tab {
  cursor: pointer;
}
</style>

<template>
  <div class="background-gradient"></div>
  <top-page>
    <demo-tab
      slot="demo-tabs"
      :aria-selected="currentTab === 0"
      @click="currentTab = 0"
    >
      This Web Site
    </demo-tab>
    <demo-tab
      slot="demo-tabs"
      :aria-selected="currentTab === 1"
      @click="currentTab = 1"
    >
      Interactions
    </demo-tab>
    <demo-tab
      slot="demo-tabs"
      :aria-selected="currentTab === 2"
      @click="currentTab = 2"
    >
      Responsive Design
    </demo-tab>
    <macaron-editor slot="demo-editor" :value="macaronFile"></macaron-editor>
  </top-page>
</template>

<script>
import thisPageMacaronFile from "./components.macaron?raw";

export default {
  data() {
    return {
      currentTab: 0,
      macaronFile: thisPageMacaronFile,
    };
  },

  mounted() {
    import("./components.macaron");
    import("@macaron-app/editor/dist/webcomponent/main.js");
    import("@macaron-app/editor/dist/webcomponent/main.css");
    console.log(thisPageMacaronFile);
  },
};
</script>
