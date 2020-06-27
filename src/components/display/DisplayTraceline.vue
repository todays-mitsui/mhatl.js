<template>
  <section class="chart-wrapper traceline-chart-wrapper">
    <h3>{{ axis }}軸 トレースライン</h3>
    <div class="inner">
      <TracelineChart
        :burninValues="burninValues"
        :practicalValues="practicalValues"
      />
    </div>
  </section>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
  padding-bottom: 24px;;
}

.inner > * {
  position: relative;
  height: 126px;
}

h3 {
  position: absolute;
  left: 8px;
  bottom: 100%;
  z-index: 1000;

  margin: 0;
  font-size: 14px;
  line-height: 1.2;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Axis, Sample } from '../../../lib/interfaces'
import TracelineChart from '../chart/TracelineChart'

@Component({
  components: {
    TracelineChart
  }
})
export default class DisplayTraceline extends Vue {
  @Prop()
  samples!: Sample[]

  @Prop()
  axis!: Axis

  get acceptedSamples (): Sample[] {
    return this.samples.filter(({ result }) => result === 'accepted')
  }

  get burninSamples (): Sample[] {
    return this.acceptedSamples.filter(({ burnin }) => burnin)
  }

  get burninValues (): Chart.ChartPoint[] {
    return this.burninSamples
      .map(({ next }, index) => {
        return {
          x: index,
          y: next[this.axis]
        }
      })
  }

  get practicalSamples (): Sample[] {
    return this.acceptedSamples.filter(({ burnin }) => !burnin)
  }

  get practicalValues (): Chart.ChartPoint[] {
    return this.practicalSamples
      .map(({ next }, index) => {
        return {
          x: this.burninSamples.length + index,
          y: next[this.axis]
        }
      })
  }
}
</script>
