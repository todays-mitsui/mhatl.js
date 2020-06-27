<template>
  <div id="app">
    <h1>Metropolis–Hastings Algorithm Time-Lapse</h1>
    <nav class="ui">
      <button
        class="btn-control"
        @click="onClick"
      >{{ pause ? 'サンプリングを開始する' : 'サンプリングを停止する' }}</button>
      <VueSlider
        v-model="speed"
        :min="1"
        :max="20"
        :tooltip-formatter="speed => `Speed: ${speed}`"
      />
    </nav>
    <div class="display">
      <DisplayScatter
        class="scatter"
        :samples="samples"
      />

      <DisplayTraceline
        class="x-trace"
        :samples="samples"
        axis="x"
      />
      <DisplayHistgram
        class="x-hist"
        :samples="samples"
        axis="x"
      />

      <DisplayTraceline
        class="y-trace"
        :samples="samples"
        axis="y"
      />
      <DisplayHistgram
        class="y-hist"
        :samples="samples"
        axis="y"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

import DisplayScatter from './components/display/DisplayScatter.vue'
import DisplayHistgram from './components/display/DisplayHistgram.vue'
import DisplayTraceline from './components/display/DisplayTraceline.vue'

import { Point, Sample } from '../lib/interfaces'
import rnorm from '../lib/util/rnorm'
import uniform from '../lib/util/uniform'

const SIGMA = 1.0 // 提案分布の標準偏差
const RHO = 0.5 // 目標分布(二変量正規分布)の相関係数
const BURN_IN_PERIOD = 50 // バーンイン期間の長さ
const FIRST_POINT = { x: 3, y: 3 } // サンプルの初期値

@Component({
  components: {
    VueSlider,
    DisplayScatter,
    DisplayHistgram,
    DisplayTraceline
  }
})
export default class App extends Vue {
  private pause = true
  private speed = 10

  private count = 0
  private current: Point = FIRST_POINT
  private samples: Sample[] = []

  loop () {
    const sample = this.sample(this.count)
    this.samples.push(sample)
    this.count += 1

    if (!this.pause) { setTimeout(this.loop, 1000 / this.speed) }
  }

  // ======================================================================== //

  /**
   * 提案分布
   */
  q ({ x, y }: Point): Point {
    return {
      x: x + rnorm(0, SIGMA),
      y: y + rnorm(0, SIGMA)
    }
  }

  /**
   * 目標分布のカーネル
   */
  p ({ x, y }: Point): number {
    return Math.exp(-0.5 * (x * x - 2 * RHO * x * y + y * y))
  }

  sample (count: number): Sample {
    const current = this.current
    const next = this.q(current)

    const pCurrent = this.p(current)
    const pNext = this.p(next)

    const r = pNext / pCurrent // 受容確率
    const accepted = r > 1 || r > uniform(0, 1)
    const result = accepted ? 'accepted' : 'rejected'

    console.info({
      pCurrent: pCurrent.toFixed(2),
      pNext: pNext.toFixed(2),
      r: r.toFixed(2),
      result
    })

    if (accepted) {
      this.current = { ...next }
    }

    return {
      count,
      burnin: count < BURN_IN_PERIOD,
      current,
      next,
      result
    }
  }

  // ======================================================================== //

  onClick () {
    this.pause = !this.pause
    if (!this.pause) { this.loop() }
  }
}
</script>

<style>
*, *::before, *::after {
  box-sizing: border-box;
}

#app {
  max-width: 800px;
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

.display {
  display: grid;
  grid-template-columns: 75% 25%;
  grid-row-gap: 32px;

  margin-top: 24px;
}
.display > * {
  flex-grow: 1;
  flex-shrink: 1;
}
.scatter-chart-wrapper {
  grid-column: 1 / 3
}
</style>
