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
      // type: 'linear',
      // position: 'bottom',
      // ticks: {
      //     min: -5,
      //     max: 5,
      //     stepSize: 2,
      // },
    }],
    xAxes: [{
      // display: false,
      type: 'linear',
      // position: 'left',
      ticks: {
        min: 0,
        max: 0.25
        // stepSize: 0.05,
      }
    }]
  }
  // title: {
  //     display: true,
  //     text: '',
  // },
  // legend: {
  //     display: false
  // },
}

@Component
export default class HistogramChart extends Mixins(HorizontalBar) {
  @Prop()
  bins!: string[]

  @Prop({ default: () => [] })
  frequencies!: number[]

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
    this.update()
  }
}
