<template>
  <div :id="`${wrapId}`" class="mescroll">
    <slot></slot>
  </div>
</template>

<script lang="ts">

// import * as MeScroll from 'mescroll.js'



import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

@Component({
    name : 'h3-scroll',
    components: {
  }
})
export default class H3Scroll extends Vue {
  @Prop({
    default: false
  }) 
  isLock !: Boolean

  @Prop({
    default: true
  }) 
  enableDown !: Boolean

  @Prop({
    default: true
  }) 
  enableUp !: Boolean

  @Prop() 
  refresh !: Function

  @Prop() 
  loadMore !: Function
  
  @Prop({
    default: 10
  }) 
  pageSize !: Number

  @Prop({
    default: '已加载全部数据'
  }) 
  noMoreMessage !: String

  @Prop({
    default: 'list-scroller'
  }) 
  wrapId !: String

  @Prop() 
  scroll !: Function

  @Prop({
    default: true
  }) 
  autoUp !: Function

  mescroll:any = null

  mounted() {
    const MeScroll = require("mescroll.js")
    // debugger;
    const self:any = this
    self.mescroll = new MeScroll(`${this.wrapId}`, {
      up: {
        auto: this.autoUp,
        use: this.enableUp,
        page: { size: self.pageSize },
        callback: self.upCallback, // 上拉回调
        // 默认为可回弹，兼容ios 9.0
        isBounce: true, // 此处禁止ios回弹,解析(务必认真阅读,特别是最后一点)
        htmlNodata: `<p class="upwarp-nodata">${self.noMoreMessage}</p>`,
        warpId: this.wrapId,
        isLock: this.isLock,
        onScroll:  self.scroll
        // empty: {
        //   icon: 'src/assets/img/blankpage.png',
        //   tip: 'shishishi ',
        // },
      },
      down: {
        use: this.enableDown,
        auto: true
      }
    })
    // self.mescroll.optUp.onScroll = (mescroll, y, isUp) => {
    //   // debugger
    //   if (self.scroll) {
    //     self.scroll(mescroll, y, isUp)
    //   }
    // }
    self.mescroll.lockUpScroll(this.isLock)
  }

  upCallback(page) {
    const self = this
    if (self.loadMore) {
      self.loadMore(
        page,
        (length, total) => {
          self.mescroll.endBySize(length, total)
        },
        () => {
          self.mescroll.endErr()
        }
      )
    }
  }
}
</script>

<style lang="css" scoped>
/* @import '~@cloudpivot/common/styles/mixins.less'; */
  @import '~mescroll.js/mescroll.min.css';
</style>
