import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { Scatter } from 'vue-chartjs'

const options = {
  animation: {
    duration: 0
  },
  scales: {
    xAxes: [{
      type: 'linear',
      position: 'bottom',
      ticks: {
        min: -5,
        max: 5,
        stepSize: 2
      }
    }],
    yAxes: [{
      type: 'linear',
      position: 'left',
      ticks: {
        min: -5,
        max: 5,
        stepSize: 2
      }
    }]
  },
  title: {
    display: true,
    text: ''
  },
  legend: {
    display: false
  },
  tooltips: {
    enabled: false
  },
  responsive: true
}

@Component
export default class ScatterChart extends Mixins(Scatter) {
  @Prop({ default: () => [] })
  datasets!: Chart.ChartDataSets[]

  @Prop({ default: () => ({ text: '', fontColor: '#999999' }) })
  title!: {
    text: string;
    fontColor: Chart.ChartColor;
  }

  update () {
    this.renderChart(
      { datasets: this.datasets },
      {
        ...options,
        ...{
          title: {
            display: true,
            text: this.title.text,
            fontColor: this.title.fontColor
          }
        }
      }
    )
  }

  mounted () {
    this.update()
  }

  @Watch('datasets')
  onChangeDatasets () {
    this.update()
  }
}
