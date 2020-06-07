import * as Chart from 'chart.js'
import { ChartPoint } from 'chart.js'

export default class TraceLine {
    readonly context: CanvasRenderingContext2D
    readonly chart: Chart

    private totalValues: number

    public constructor(selector: string, rangeMin: number = -5, rangeMax: number = 5, numBins: number = 16) {
        this.totalValues = 0

        this.context = this.getContext(selector)

        this.chart = new Chart(this.context, {
            type: 'line',
            data: {
                datasets: [
                    {
                        fill: false,
                        showLine: true,
                        lineTension: 0,
                        borderWidth: 1,
                        borderColor: '#333333',
                        pointRadius: 0,
                        data: [],
                    },
                    {
                        fill: false,
                        showLine: true,
                        lineTension: 0,
                        borderWidth: 1,
                        borderColor: '#cccccc',
                        pointRadius: 0,
                        data: [],
                    },
                ],
            },
            options: this.options(),
        })
    }

    private getContext(selector: string) {
        const canvas = <HTMLCanvasElement> document.querySelector(selector)
        return canvas.getContext('2d')
    }

    private options() {
        return {
            animation: {
                duration: 0,
            },
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            scales: {
                yAxes: [{
                    // display: false,
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        min: -5,
                        max: 5,
                        stepSize: 2,
                    },
                }],
                xAxes: [{
                    display: false,
                    type: 'linear',
                    position: 'center',
                    ticks: {
                        min: 0,
                        // max: 1000,
                        stepSize: 200,
                    },
                }]
            },
            // title: {
            //     display: true,
            //     text: '',
            // },
        }
    }

    public addValue(value: number, burnin: boolean, update = true) {
        this.totalValues = this.totalValues + 1

        if (burnin) {
            const data = this.chart.data.datasets[1].data as ChartPoint[]
            data.push({
                x: this.totalValues,
                y: value,
            })
        } else {
            const data = this.chart.data.datasets[0].data as ChartPoint[]
            data.push({
                x: this.totalValues,
                y: value,
            })
        }

        if (update) {
            this.chart.update()
        }

        return this
    }
}
