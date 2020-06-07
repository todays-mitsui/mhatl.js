import * as Chart from 'chart.js'

export default class Histogram {
    readonly context: CanvasRenderingContext2D
    readonly chart: Chart

    readonly rangeMin: number
    readonly rangeMax: number

    readonly numBins: number
    readonly binWidth: number
    readonly bins: number[]

    private totalValues: number
    readonly ranks: Map<number, number>

    public constructor(selector: string, rangeMin: number = -5, rangeMax: number = 5, numBins: number = 16) {
        this.rangeMin = rangeMin
        this.rangeMax = rangeMax
        this.numBins = numBins
        this.binWidth = (rangeMax - rangeMin) / numBins
        // this.ranks = Array.from(Array(numBins), (_, i) => i)
        this.bins = Array.from(Array(numBins), (_, i) => rangeMin + i * this.binWidth)
        this.totalValues = 0
        this.ranks = new Map(Array.from(Array(numBins), (_, i) => [i, 0]))

        this.context = this.getContext(selector)

        this.chart = new Chart(this.context, {
            type: 'horizontalBar',
            data: {
                labels: this.bins.map(i => '' + i),
                datasets: [
                    {
                        barPercentage: 1,
                        categoryPercentage: 1,
                        backgroundColor: '#666666',
                        borderColor: '#333333',
                        borderWidth: 1,
                        data: Array.from(this.ranks.values()),
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
            // animation: {
            //     duration: 0,
            // },
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            scales: {
                yAxes: [{
                    display: false,
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
                        max: 0.25,
                        // stepSize: 0.05,
                    },
                }]
            },
            // title: {
            //     display: true,
            //     text: '',
            // },
            // legend: {
            //     display: false
            // },
        }
    }

    public addValue(value: number, update = true) {
        this.totalValues = this.totalValues + 1

        const rank = Math.floor((value - this.rangeMin) / this.binWidth)

        if (this.ranks.has(rank)) {
            const frequency = this.ranks.get(rank)
            this.ranks.set(rank, frequency + 1)
        }

        this.chart.data.datasets[0].data = Array.from(
            this.ranks.values(),
            frequency => frequency / this.totalValues
        )

        if (update) {
            this.chart.update()
        }

        return this
    }
}
