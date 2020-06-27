<template>
  <div id="app">
    <h1>Metropolis–Hastings Algorithm Time-Lapse</h1>
    <ControlPanel
      class="ui"
      :x0.sync="x0"
      :y0.sync="y0"
      :disabled="!!samples.length"
      :speed.sync="speed"
      :pause.sync="pause"
      @update:pause="onUpdatePause"
      @reset="onReset"
    />
    <div class="display">
      <DisplayScatter
        class="scatter"
        :p0="{ x: x0, y: y0 }"
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

import ControlPanel from './components/ControlPanel.vue'
import DisplayScatter from './components/display/DisplayScatter.vue'
import DisplayHistgram from './components/display/DisplayHistgram.vue'
import DisplayTraceline from './components/display/DisplayTraceline.vue'

import { Point, Sample } from '../lib/interfaces'
import rnorm from '../lib/util/rnorm'
import uniform from '../lib/util/uniform'

const SIGMA = 1.0 // 提案分布の標準偏差
const RHO = 0.5 // 目標分布(二変量正規分布)の相関係数
const BURN_IN_PERIOD = 50 // バーンイン期間の長さ

@Component({
  components: {
    ControlPanel,
    DisplayScatter,
    DisplayHistgram,
    DisplayTraceline
  }
})
export default class App extends Vue {
  private x0 = 3.0
  private y0 = 3.0
  private pause = true
  private speed = 10

  private count = 0
  private current?: Point
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
    const current = this.current || { x: this.x0, y: this.y0 }
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

  get p0 (): Point {
    return {
      x: this.x0,
      y: this.y0
    }
  }

  onUpdatePause () {
    if (!this.pause) { this.loop() }
  }

  onReset () {
    this.pause = true
    setTimeout(() => {
      this.count = 0
      this.current = undefined
      this.samples = []
    }, 1000 / this.speed)
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
  padding: 1px 0;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
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
