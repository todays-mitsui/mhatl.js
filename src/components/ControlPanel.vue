<template>
  <nav>
    <div class="row">
      <p>サンプリング初期値</p>
      <div class="content content-start">
        <div class="unit">
          <label for="x0">x軸</label>
          <input
            id="x0"
            type="number"
            :value="x0"
            :disabled="disabled"
            @keyup="onChangeX0"
            @change="onChangeX0"
            step="0.1"
          >
        </div>
        <div class="unit">
          <label for="y0">y軸</label>
          <input
            id="y0"
            type="number"
            :value="y0"
            :disabled="disabled"
            @keyup="onChangeY0"
            @change="onChangeY0"
            step="0.1"
          >
        </div>
      </div>
    </div>
    <div class="row">
      <p>スピード</p>
      <VueSlider
        :value="speed"
        :min="1"
        :max="20"
        :tooltip-formatter="speed => `Speed: ${speed}`"
        @change="onChangeSpeed"
      />
    </div>

    <div class="row row-btns">
      <button
        class="btn-control"
        @click="onChangePause"
      >{{ pause ? 'サンプリングを開始する' : 'サンプリングを停止する' }}</button>
      <button
        class="btn-reset"
        @click="onReset"
      >リセットする</button>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

interface HTMLElementEvent<T extends HTMLElement> extends Event {
  target: T;
}

@Component({
  components: {
    VueSlider
  }
})
export default class ControlPanel extends Vue {
  @Prop()
  x0!: number

  @Prop()
  y0!: number

  @Prop({ default: false })
  disabled!: boolean

  @Prop()
  speed!: number

  @Prop({ default: true })
  pause!: boolean

  onChangeX0 (event: HTMLElementEvent<HTMLInputElement>) {
    const value = parseFloat(event.target.value) || 0
    this.$emit('update:x0', value)
  }

  onChangeY0 (event: HTMLElementEvent<HTMLInputElement>) {
    const value = parseFloat(event.target.value) || 0
    this.$emit('update:y0', value)
  }

  onChangeSpeed (value: number) {
    this.$emit('update:speed', value)
  }

  onChangePause () {
    this.$emit('update:pause', !this.pause)
  }

  onReset () {
    this.$emit('reset')
  }
}
</script>

<style scoped>
.row {
  display: flex;
  align-items: center;
}
.row > p {
  flex-basis: 25%;
  min-width: 180px;
  padding-right: 24px;
  text-align: right;
}
.row > p::after {
  content: ":";
  font-weight: 700;
}

.vue-slider {
  flex-grow: 1;
}

.content-start {
  display: flex;
}
.content-start .unit:not(:first-child) {
  margin-left: .5em;
}
.content-start .unit:not(:first-child)::before {
  content: "/";
  margin-right: .5em;
}
.content-start input[type=number] {
  width: 4em;
  margin-left: .5em;
}

.row-btns {
  justify-content: center;
}
button {
  -webkit-appearance: none;
  appearance: none;

  padding: .2em .6em;

  border: none;
  border: 1px solid #999;
  border-radius: 4px;

  background: none;
  background-color: #ddd;
}
button:not(:first-child) {
  margin-left: 1em;
}
button.btn-control {
  border-color: #4477dd;
  background: #98b9fd;
}
</style>
