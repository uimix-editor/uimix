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

macaron-top-page {
  position: relative;
}

macaron-top-page [slot="playground"] {
  display: contents;
}
</style>

<template>
  <div class="background-gradient"></div>
  <macaron-top-page>
    <div slot="playground">
      <Playground />
    </div>
  </macaron-top-page>
</template>

<script>
import Playground from "./Playground.vue";

export default {
  mounted() {
    import("./components.macaron");
  },

  components: {
    Playground: Playground,
  },
};
</script>
