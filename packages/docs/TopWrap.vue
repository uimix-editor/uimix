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
</style>

<template>
  <div class="background-gradient"></div>
  <top-page>
    <demo-tab slot="demo-tabs" aria-selected="true">This Web Site</demo-tab>
    <demo-tab slot="demo-tabs">Interactions</demo-tab>
    <demo-tab slot="demo-tabs">Responsive Design</demo-tab>
    <macaron-editor slot="demo-editor"></macaron-editor>
  </top-page>
</template>

<script>
export default {
  mounted() {
    import("./components.macaron");
    import("@macaron-app/editor/dist/webcomponent/main.js");
    import("@macaron-app/editor/dist/webcomponent/main.css");
  },
};
</script>
