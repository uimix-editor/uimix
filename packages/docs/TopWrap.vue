<style scoped>
macaron-editor {
  width: 100%;
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
  <top-page>
    <macaron-editor></macaron-editor>
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
