<template>
  <section class="chart-wrapper traceline-chart-wrapper">
    <div class="traceline">
      <TracelineChart
        :burninValues="burninValues"
        :practicalValues="practicalValues"
      />
    </div>
    <!-- /.inner -->
  </section>
</template>

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
