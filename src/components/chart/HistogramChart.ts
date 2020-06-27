import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { HorizontalBar } from 'vue-chartjs'

const options = {
  animation: {
    duration: 0
  },
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
  },
  tooltips: {
    enabled: false
  },
  responsive: true,
  maintainAspectRatio: false
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
    if (this.tick) { this.update() }
  }

  /**
   * ヒストグラムを更新するべきタイミングかどうか判定する
   */
  get tick () {
    const count = this.count

    switch (true) {
      case count < 100: return count % 4 === 0
      case count < 1000: return count % 10 === 0
      case count < 10000: return count % 25 === 0
      default: return count % 100 === 0
    }
  }
}
