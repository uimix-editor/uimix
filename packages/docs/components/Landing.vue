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

macaron-landing {
  position: relative;
}

macaron-landing:not(:defined) {
  display: none;
}

macaron-landing [slot="playground"] {
  display: contents;
}
</style>

<template>
  <div class="background-gradient"></div>
  <macaron-landing>
    <div slot="playground">
      <Playground />
    </div>
  </macaron-landing>
</template>

<script>
import "./components.macaron";
import Playground from "./Playground.vue";

export default {
  components: {
    Playground: Playground,
  },
};
</script>
