<template>
  <section 
    class="progress-track"
    :style="style"
    :class="className"
    ref="progress"
    v-show="isLoadding"
  >
    <p class="progress-line" :style="{left: `${this.progress}%`}"></p>
  </section>
</template>
<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Watch,
  Inject,
  Provide
} from "vue-property-decorator";
/**
 * @desc 移动端进度条
 * @param { number } percent 进度条百分比
 * @param { boolean } isAuto 是否模拟进度，当需要手动空值进度条更新是，不需要设置该值，默认为false
 * @param { object } style 样式对象
 * @param { string | array } className 需要绑定的class类名，字符串或者数组
 * @param { boolean } loadding 控制是否显示进度条
 */

@Component({
  name: 'a-progress'
})

export default class AProcess extends Vue {
  @Prop(Number) readonly percent!: number;
  @Prop({ default: true }) isAuto!: boolean;
  @Prop(Object) style!:object;
  @Prop() className!: any;
  @Prop(Boolean) readonly loadding!: boolean;

  progress = 0;
  timer : any = 0;
  isLoadding:boolean = false;

  mounted() {
    // 自动增加进度条
    if (this.isAuto) {
      this.autoAdd()
    }
  }
  // 接收父组件传递过啦的进度
  @Watch('percent')
  percentChange(val, old){
    this.progress = val;
  }

  @Watch('loadding')
  loaddingChange(val) {
    this.setIsLoadding(val)
  }
  /**
   * @desc 设置是否展示进度条
   */
  setIsLoadding(val) {
    if (val) {
      return this.isLoadding = true;
    }
    this.closeProgress();
  }
  /**
   * @desc 进度条更新
   */
  progressStep (step) {
    this.progress = this.progress + step;
  }
  /**
   * @desc 自动更新进度条
   */
  autoAdd (step = 10) {
    clearTimeout(this.timer);
    this.progressStep(step)
    if (this.progress < 90) {
      return this.timer = setTimeout(this.autoAdd, 300);
    }
    this.closeProgress()
  }
  /**
   * @desc 关闭进度条
   */
  closeProgress() {
    clearTimeout(this.timer);
    this.progress = 100;
    setTimeout(() => {
      this.isLoadding = false;
    }, 800)
  }
}
</script>
<style lang="less">
.progress-track {
  & {
    height: 0.06rem;
    background: #e7f3fe;
    // width: 100vh;
    width: 100%;
    position: relative;
  }
  .progress-line{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 100%;
    background: #2970FF;
    transform: translateX(-100%);
    transition: left .3s;
  }
  
}
</style>