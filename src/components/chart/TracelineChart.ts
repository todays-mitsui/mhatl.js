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
      // display: false,
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
        // max: 1000,
        stepSize: 200
      }
    }]
  }
  // title: {
  //     display: true,
  //     text: '',
  // },
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
    this.update()
  }
}
