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
      @update:pause="onChangePause"
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

/** 提案分布の標準偏差 */
const SIGMA = 1.0

/** 目標分布(二変量正規分布)の共分散 */
const b = 0.5

/** Burn-in 期間の長さ */
const BURN_IN_PERIOD = 50

@Component({
  components: {
    ControlPanel,
    DisplayScatter,
    DisplayHistgram,
    DisplayTraceline
  }
})
export default class App extends Vue {
  /** サンプリングの初期値 x軸の値 */
  private x0 = 3.0

  /** サンプリングの初期値 y軸の値 */
  private y0 = 3.0

  /** 生成したサンプル数 (Burn-in 期間や棄却されたものを含む) */
  private count = 0

  /** 生成したサンプル列 (Burn-in 期間や棄却されたものを含む) */
  private samples: Sample[] = []

  // ======================================================================== //

  /** 目標分布のカーネル */
  p ({ x, y }: Point): number {
    return Math.exp(-0.5 * (x * x - 2 * b * x * y + y * y))
  }

  /** 提案分布 - 正規分布からの実現値の組 */
  q ({ x, y }: Point): Point {
    return {
      x: x + rnorm(0, SIGMA),
      y: y + rnorm(0, SIGMA)
    }
  }

  /** サンプル取得処理 */
  sample (): Sample {
    // 点 current 、初回は current === undefined なので { x0, y0 } を使う
    const current = this.current || { x: this.x0, y: this.y0 }
    const next = this.q(current)      // 提案分布を使って点 next を選ぶ

    const pCurrent = this.p(current)  // 点 current における目標分布の確率密度
    const pNext = this.p(next)        // 点 next における目標分布の確率密度

    const r = pNext / pCurrent        // 受容確率

    // r が 1 以上ならそのまま受容する (accepted === true になる)
    // r が 1 より小さいなら、確率 r で受容する
    const accepted = r >= 1 || r > uniform(0, 1)

    console.table({
      current: `(${current.x.toFixed(2)}, ${current.y.toFixed(2)})`,
      next: `(${next.x.toFixed(2)}, ${next.y.toFixed(2)})`,
      pCurrent: pCurrent.toFixed(2),
      pNext: pNext.toFixed(2),
      r: r.toFixed(2),
      result: accepted ? 'accepted' : 'rejected'
    })

    return {
      count: this.count,
      burnin: this.count < BURN_IN_PERIOD,
      current,
      next,
      result: accepted ? 'accepted' : 'rejected'
    }
  }

  /** サンプル取得を繰り返す実行するためのループ */
  loop () {
    // サンプル取得
    const sample = this.sample()

    // 取得した sample が受容されていた場合は、次に備えて点 current を点 next で置き換える
    if (sample.result === 'accepted') { this.current = sample.next }

    this.samples.push(sample)
    this.count += 1

    // 1000 / speed ミリ秒だけ待ってから loop() を再び呼び出す
    if (!this.pause) { setTimeout(this.loop, 1000 / this.speed) }
  }

  // ======================================================================== //

  private pause = true
  private speed = 8
  private current?: Point

  get p0 (): Point {
    return {
      x: this.x0,
      y: this.y0
    }
  }

  onChangePause () {
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
