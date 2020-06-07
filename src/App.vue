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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

import Point from '../lib/interface/Point'
import rnorm from '../lib/util/rnorm'

@Component({
  components: {
    VueSlider
  }
})
export default class App extends Vue {
  private pause = true
  private speed = 10
  private value = 0

  loop () {
    this.value = this.value + 1
    if (!this.pause) { setTimeout(this.loop, 1000 / this.speed) }
  }

  onClick () {
    this.pause = !this.pause
    if (!this.pause) { this.loop() }
  }

  // ======================================================================== //

  /**
   * 提案分布
   */
  q ({ x, y }: Point, delta: number): Point {
    return {
      x: x + rnorm(0, delta),
      y: y + rnorm(0, delta)
    }
  }

  /**
   * 目標分布のカーネル
   *
   * @param point
   * @param b     相関係数 -1 < b < 1
   */
  p ({ x, y }: Point, b: number): number {
    if (Math.abs(b) >= 1) { throw new Error() }

    return Math.exp(-0.5 * (x * x - 2 * b * x * y + y * y))
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
  align-items: center;
}
.vue-slider {
  flex-grow: 1;
  margin-left: 16px;
}
</style>
