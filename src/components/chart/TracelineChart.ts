import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { Line } from 'vue-chartjs'

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
      type: 'linear',
      position: 'left',
      ticks: {
        min: -5,
        max: 5,
        stepSize: 2
      }
    }],
    xAxes: [{
      display: false,
      type: 'linear',
      position: 'center',
      ticks: {
        min: 0,
        stepSize: 200
      }
    }]
  }
}

@Component
export default class TracelineChart extends Mixins(Line) {
  @Prop({ default: () => [] })
  burninValues!: Chart.ChartPoint[]

  @Prop({ default: () => [] })
  practicalValues!: Chart.ChartPoint[]

  update () {
    this.renderChart(
      {
        datasets: [
          {
            fill: false,
            showLine: true,
            lineTension: 0,
            borderWidth: 1,
            borderColor: '#333333',
            pointRadius: 0,
            data: this.practicalValues
          },
          {
            fill: false,
            showLine: true,
            lineTension: 0,
            borderWidth: 1,
            borderColor: '#cccccc',
            pointRadius: 0,
            data: this.burninValues
          }
        ]
      },
      options
    )
  }

  mounted () {
    this.update()
  }

  @Watch('burninValues')
  onChangeBurninValues () {
    this.update()
  }

  @Watch('practicalValues')
  onChangePracticalValues () {
    if (this.tick) { this.update() }
  }

  /**
   * トレースラインを更新するべきタイミングかどうか判定する
   */
  get tick () {
    const count = this.burninValues.length + this.practicalValues.length

    switch (true) {
      case count < 100: return count % 4 === 0
      case count < 1000: return count % 10 === 0
      case count < 10000: return count % 25 === 0
      default: return count % 100 === 0
    }
  }
}
