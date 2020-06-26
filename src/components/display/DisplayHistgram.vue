<template>
  <section class="chart-wrapper hist-chart-wrapper">
    <div class="hist">
      <HistogramChart
        :bins="bins"
        :frequencies="frequencies"
      />
    </div>
    <!-- /.inner -->
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Axis, Sample } from '../../../lib/interfaces'
import HistogramChart from '../chart/HistogramChart'

@Component({
  components: {
    HistogramChart
  }
})
export default class DisplayHistgram extends Vue {
  @Prop()
  samples!: Sample[]

  @Prop()
  axis!: Axis

  @Prop({ default: -5 })
  rangeMin!: number

  @Prop({ default: 5 })
  rangeMax!: number

  @Prop({ default: 16 })
  numBins!: number

  @Prop()
  binWidth!: number

  get bins () {
    const rangeMin = this.rangeMin
    const numBins = this.numBins

    return Array.from(
      Array(numBins),
      (_, i) => String(rangeMin + i * this.binWidth)
    )
  }

  get frequencies () {
    const rangeMin = this.rangeMin
    const rangeMax = this.rangeMax
    const numBins = this.numBins
    const binWidth = this.binWidth || (rangeMax - rangeMin) / numBins

    const ranks: Map<number, number> = new Map(Array.from(Array(numBins), (_, i) => [i, 0]))

    const samples = this.samples.filter(({ burnin }) => !burnin)
    for (const sample of samples) {
      const { next } = sample

      const value = next[this.axis]
      const rank = Math.floor((value - rangeMin) / binWidth)

      const frequency = ranks.get(rank)
      if (frequency !== undefined) {
        ranks.set(rank, frequency + 1)
      }
    }

    return Array.from(
      ranks.values(),
      frequency => frequency / samples.length
    )
  }
}
</script>
