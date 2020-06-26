<template>
  <section class="scatter-chart-wrapper">
    <div class="inner chart-wrapper">
      <ScatterChart
        :title="{ text: titleText, fontColor: titleColor }"
        :datasets="datasets"
      />
    </div>
    <!-- /.inner -->
  </section>
</template>

<style scoped>
.inner {
  max-width: 600px;
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

  public updateTitle (i: number, burnin: boolean, accept: boolean) {
    this.titleText = `count: ${i}, ${accept ? 'Accept' : 'Reject'}${burnin ? ' [burn-in]' : ''}`

    const fontColor = accept
      ? helpers.color(BLUE).alpha(0.6).rgbString()
      : helpers.color(RED).alpha(0.6).rgbString()
    this.titleColor = fontColor
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
