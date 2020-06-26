import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { HorizontalBar } from 'vue-chartjs'

const options = {
  animation: {
    duration: 0
  },
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    yAxes: [{
      display: false
    }],
    xAxes: [{
      type: 'linear',
      ticks: {
        min: 0,
        max: 0.25
      }
    }]
  }
}

@Component
export default class HistogramChart extends Mixins(HorizontalBar) {
  @Prop()
  bins!: string[]

  @Prop({ default: () => [] })
  frequencies!: number[]

  @Prop()
  count!: number

  update () {
    this.renderChart(
      {
        labels: this.bins,
        datasets: [
          {
            barPercentage: 1,
            categoryPercentage: 1,
            backgroundColor: '#666666',
            borderColor: '#333333',
            borderWidth: 1,
            data: this.frequencies
          }
        ]
      },
      options
    )
  }

  mounted () {
    this.update()
  }

  @Watch('frequencies')
  onChangeFrequencies () {
    if (this.u) {
      this.update()
    }
  }

  get u () {
    const count = this.count

    switch (true) {
      case count < 100: return count % 4 === 0
      case count < 1000: return count % 10 === 0
      case count < 10000: return count % 25 === 0
      default: return count % 100 === 0
    }
  }
}
