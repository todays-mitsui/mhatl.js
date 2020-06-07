<template>
  <div id="app">
    <h1>Metropolis–Hastings Algorithm Time-Lapse</h1>
    <nav class="ui">
      <button
        class="btn-control"
        @click="onClick"
      >{{ pause ? '実行する' : '停止する' }}</button>
      <VueSlider
        v-model="speed"
        :min="1"
        :max="20"
        :tooltip-formatter="speed => `Speed: ${speed}`"
      />
    </nav>
    <div>{{ value }}</div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

export default {
  name: 'App',

  components: {
    VueSlider,
  },

  data() {
    return {
      pause: true,
      speed: 10,
      value: 0,
    }
  },

  methods: {
    loop() {
      this.value = this.value + 1
      if (!this.pause) { setTimeout(this.loop, 1000 / this.speed) }
    },

    onClick() {
      this.pause = !this.pause
      if (!this.pause) { this.loop() }
    },
  },
}
</script>

<style>
#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 0;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.ui {
  display: flex;
  align-items: center;
}
.vue-slider {
  flex-grow: 1;
  margin-left: 16px;
}
</style>
