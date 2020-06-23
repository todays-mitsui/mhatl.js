<template>
  <section class="scatter-chart-wrapper">
    <div class="inner chart-wrapper">
      <ScatterChart
        :title="{ text: titleText, fontColor: titleColor }"
      />
    </div>
    <!-- /.inner -->
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { helpers } from 'chart.js'
import ScatterChart from '../chart/ScatterChart'

const RED = '#ff0000'
const BLUE = '#4477dd'
const GRAY = '#999999'

@Component({
  components: {
    ScatterChart
  }
})
export default class App extends Vue {
  titleText = ''
  titleColor = GRAY

  public updateTitle (i: number, burnin: boolean, accept: boolean) {
    this.titleText = `count: ${i}, ${accept ? 'Accept' : 'Reject'}${burnin ? ' [burn-in]' : ''}`

    const fontColor = accept
      ? helpers.color(BLUE).alpha(0.6).rgbString()
      : helpers.color(RED).alpha(0.6).rgbString()
    this.titleColor = fontColor
  }
}
</script>
