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

.playground-alt {
  display: block;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15),
    0px 24px 30px rgba(0, 0, 0, 0.35);
  border-radius: 10px;
  width: 100%;
  max-width: 1198px;
}

.playground ~ .playground-alt {
  display: none;
}

@media (max-width: 1023px) {
  .playground {
    display: none;
  }

  .playground ~ .playground-alt {
    display: block;
  }
}
</style>

<template>
  <div class="background-gradient"></div>
  <macaron-landing>
    <div slot="playground">
      <Playground class="playground" v-if="playgroundEnabled" />
      <img class="playground-alt" alt="Screenshot" src="/screenshot.webp" />
    </div>
  </macaron-landing>
</template>

<script>
import "./components.macaron";
import Playground from "./Playground.vue";
import UAParser from "ua-parser-js";

const uaParser = new UAParser();
const isBlink = uaParser.getEngine().name === "Blink";

export default {
  data() {
    return {
      playgroundEnabled: isBlink,
    };
  },

  components: {
    Playground: Playground,
  },
};
</script>
