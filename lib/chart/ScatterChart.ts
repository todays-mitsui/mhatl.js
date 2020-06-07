import * as Chart from 'chart.js'
import { helpers } from 'chart.js'
import Point from '../interface/Point'

const color = helpers.color
const RED = '#ff0000'
const BLUE = '#4477dd'
const GRAY = '#999999'

export default class ScatterChart {
    readonly context: CanvasRenderingContext2D
    readonly chart: Chart

    public constructor(selector: string) {
        this.context = this.getContext(selector)

        this.chart = new Chart(this.context, {
            type: 'scatter',
            data: {
                datasets: []
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
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                        min: -5,
                        max: 5,
                        stepSize: 2,
                    },
                }],
                yAxes: [{
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        min: -5,
                        max: 5,
                        stepSize: 2,
                    },
                }]
            },
            title: {
                display: true,
                text: '',
            },
            legend: {
                display: false
            },
        }
    }

    public updateTitle(i: number, burnin: boolean, accept: boolean, update = true) {
        this.chart.options.title.text = `count: ${i}, ${accept ? 'Accept' : 'Reject'}${burnin ? ' [burn-in]' : ''}`

        const fontColor = accept
            ? color(BLUE).alpha(0.6).rgbString()
            : color(RED).alpha(0.6).rgbString()
        this.chart.options.title.fontColor = fontColor

        if (update) { this.chart.update() }
    }

    public addAccept(current: Point, next: Point, burnin = false, update = true) {
        const alpha = burnin ? 0.3 : 0.7
        const baseColor = burnin ? GRAY : BLUE

        this.chart.data.datasets.push({
            data: [current, next],
            fill: false,
            showLine: true,
            lineTension: 0,
            borderWidth: 1,
            borderDash: [5, 8],
            pointStyle: 'circle',
            pointRadius: [0, 3],
            pointBackgroundColor: color(baseColor).alpha(alpha * 0.9).rgbString(),
            pointBorderColor: color(baseColor).alpha(alpha).rgbString(),
        })

        if (update) { this.chart.update() }

        return this
    }

    public addReject(current: Point, next: Point, burnin = false, update = true) {
        const alpha = 0.2
        const baseColor = burnin ? GRAY : RED

        this.chart.data.datasets.push({
            data: [current, next],
            fill: false,
            showLine: true,
            lineTension: 0,
            borderWidth: 1,
            borderDash: [5, 8],
            pointStyle: 'crossRot',
            pointRadius: [0, 5],
            pointBorderWidth: [0, 2],
            pointBorderColor: color(baseColor).alpha(alpha).rgbString(),
        })

        if (update) { this.chart.update() }

        return this
    }
}
