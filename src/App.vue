<template>
  <div id="app">
    <h1>Metropolis–Hastings Algorithm Time-Lapse</h1>
    <nav class="ui">
      <button
        class="btn-control"
        @click="pause = !pause"
      >{{ pause ? '実行する' : '停止する' }}</button>
      <VueSlider
        v-model="value"
        :min="1"
        :max="20"
        :tooltip-formatter="val => `Speed: ${val}`"
      />
    </nav>
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
      pause: false,
      value: 10,
    }
  }
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
}
.vue-slider {
  flex-grow: 1;
  margin-left: 16px;;
}
</style>
