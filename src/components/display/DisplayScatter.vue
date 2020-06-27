<template>
  <section class="scatter-chart-wrapper">
    <p :style="labelStyle">{{ label }}</p>
    <div class="inner chart-wrapper">
      <ScatterChart
        :title="{ text: titleText, fontColor: titleColor }"
        :datasets="datasets"
      />
    </div>
  </section>
</template>

<style scoped>
p {
  margin: 0 0 -1em;
  font-size: 16px;
  font-family: monospace;
  font-weight: 700;
  text-align: center;
}

.inner {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { helpers } from 'chart.js'
import { Sample } from '../../../lib/interfaces'
import ScatterChart from '../chart/ScatterChart'

const RED = '#ff0000'
const BLUE = '#4477dd'
const GRAY = '#999999'

@Component({
  components: {
    ScatterChart
  }
})
export default class DisplayScatter extends Vue {
  @Prop()
  samples!: Sample[]

  titleText = ''
  titleColor = GRAY

  get label () {
    if (!this.samples.length) { return '-' }

    const count = this.samples.length - 1
    const { burnin, result } = this.samples[count]

    return `count: ${count}, ${result} ${burnin ? '[burn-in]' : ''}`
  }

  get labelStyle () {
    if (!this.samples.length) { return { color: '#999999' } }

    const count = this.samples.length - 1
    const { result } = this.samples[count]

    const color = result === 'accepted' ? BLUE : RED

    return { color }
  }

  get datasets (): Chart.ChartDataSets[] {
    return this.samples.map(({ burnin, current, next, result }) => {
      const rejected = result === 'rejected'

      const pointStyle = rejected ? 'crossRot' : 'circle'
      const pointRadius = rejected ? [0, 5] : [0, 3]

      const borderWidth = rejected ? [0, 2] : [0, 1]

      const alpha = rejected ? 0.3 : (burnin ? 0.3 : 0.8)
      const baseColor = burnin ? GRAY : (rejected ? RED : BLUE)

      return {
        data: [current, next],
        fill: false,
        showLine: true,
        lineTension: 0,
        borderWidth: 1,
        borderDash: [5, 8],
        pointStyle,
        pointRadius,
        pointBorderWidth: borderWidth,
        pointBackgroundColor: helpers.color(baseColor).alpha(alpha * 0.9).rgbString(),
        pointBorderColor: helpers.color(baseColor).alpha(alpha).rgbString()
      }
    })
  }
}
</script>
