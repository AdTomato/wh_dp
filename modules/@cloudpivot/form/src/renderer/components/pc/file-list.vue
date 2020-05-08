
<template>
  <div class="file-list">
    <div
      class="file-item"
      @click.stop="downFile(item, key)"
      v-for="(item, key) in downUrls"
      :class="[getStatus(key)]"
      :key="key"
    >
      <a-icon type="paper-clip" />
        
      <div class="file-item-text-warp">
        <div class="file-item-text">
          <p class="file-item-name"  :title="item.name">{{ initFieName(item.name) }} ({{ initSize(item.size) }})</p>
          <p class="file-item-name-right">
            <span>{{ getName(item) }}</span> 
            <span class="icon-wrap">
              {{ getTime(item) }}
              <a-icon type="close" @click.stop="rmFile(item, key)" v-show="!showRm" />
            </span>
            
          </p>
        </div>
        <a-progress
          :percent="getPercent(key)"
          :strokeWidth="2"
          :strokeColor="getColor(precents[key])"
          :class="{'showProgress': getStatus(key) !== 'done'   }"
          class="file-item-progress"
          :format="() => ''"
        />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop, Watch, Inject, Emit } from "vue-property-decorator";
import moment from 'moment';
import { progress, Icon } from "h3-antd-vue";

@Component({
  name: "file-list",
  components: {
    AProgress: progress,
    AIcon: Icon
  }
})
export default class FileList extends Vue {
  status:string[] = []; // 保存单个文件状态
  timer:any = 0;
  @Prop({default: () => []}) readonly list!:Array<any>;
  @Prop({default: false}) readonly showRm!:boolean;
  @Prop({default: () => []}) readonly downUrls!:Array<any>;
  // @Watch('downUrls')
  // listChange(list=[]) {
  // }
  @Prop({default: () => []}) readonly eventList!:Array<any>;
  precents:any = [];
  @Watch('eventList')
  eventListChange(arr=[]) {
    // 跟新文件上传进度
    this.autoStep()
  }
  @Emit()
  rmFile(file, key) {
    let res = {...file, status: "removed"};
    // // 更新文件上传状态list
    this.precents = this.precents.filter((item:any, idx: any) => {
      return idx !== key
    });
    return res;
  }

  nameWidth:number = 0;
  /*
   * @desc 格式化文件大小
   */
  initSize(size):string {
    let k = 1024; // 比特 字节大小
    let m = 1048576; // 兆字节大小
    let num = k; // 默认使用的几算大小
    let str = 'KB';
    if (size > m) {
      num  = m;
      str = 'M'
    }
    return `${(size/num).toFixed(2)}${str}`;
  }
  getPercent(key) {
    let res = this.precents[key];
    if (!res) return 0;
    return res.percent;
  }
  getStatus(key){
    if (!this.precents.length) return 'done';
    let status = this.precents[key];
    if (!status) {
      status = '';
    }
    return status.status;
  }
  /**
   * @des 模拟更新进度条
   */
  autoStep(){
    // 防止开启多个定时器
    clearTimeout(this.timer);
    let isRpeat = false;
    this.precents = this.eventList.map(item => {
      
      let { status, percent = 0, timer = -1, size = 0, response } = item;
      let step = 0;
      let ss = 300; // 默认每秒钟300k的上传速度
      if (status === 'done' || status === 'error') {
        percent = 100;
      } else {
        step = size / ss / 100;
        percent = percent + step;
        isRpeat = true;
      }
      // 状态更新
      if (response && !response.data) {
        status = 'error';
      }
      return {percent, status}
    })
    // 调用自己
    if (isRpeat) {
      this.timer = window.setTimeout(this.autoStep, 1000)
    }
  }
  /**
   * @desc 处理时间
   */
  format = function(time, format = 'YYYY-MM-dd HH:mm:sss'):string {
    let t = new Date(time)
    let o = {
    "M+": t.getMonth() + 1,
    "d+": t.getDate(),
    "H+": t.getHours(),
    "m+": t.getMinutes(),
    "s+": t.getSeconds(),
    "q+": Math.floor((t.getMonth() + 3) / 3),//季度
    "f+": t.getMilliseconds(),//毫秒
    };
    if(/(Y+)/.test(format)) {
      format = format.replace(RegExp.$1, t.getFullYear() + "").substr(4 - RegExp.$1.length);
    }
      
    for(let k in o) {
      if(new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return format;
  }
 
  getColor(item){
    if (!this.precents.length) return '#17BC94';
    if (item.status === "error") return '#FF5500'
    return '#17BC94'
  }
  getName(item){
    if (item.hasOwnProperty('uploadName') && item.uploadName) {
      return item.uploadName
    }
    return item.response.data.creater.name
  }
  getTime(item){
    if (item.hasOwnProperty('uploadTime') && item.uploadTime) {
      return this.format(item.uploadTime)
    }
    return item.response.data.createdTime
  }
  /**
   * @desc 下载文件
   */
  downFile(file, idx) {
    let val = this.downUrls[idx];
    window.open(val.url)
  }
  initFieName(name){
    let size = 14; // 字的大小
    let len = name.length * size;
    if (len <= this.nameWidth) return name;
    let start = name.slice(0, 6);
    let idex = name.lastIndexOf('.')
    let middle = name.slice(idex -6, idex)
    let end = name.slice(idex,)
    return `${start}...${middle}${end}`
  }
  /**
   * @desc 获取组件的宽度
   */
  getWidth() {
    let size:number = 0;
    let el = document.querySelector('.file-list')
    if (el) {
      size = el.clientWidth;
    }
    this.nameWidth = Math.ceil(size * 0.7);
  }
  mounted() {
    this.getWidth();
    window.addEventListener('resize', this.getWidth)
    let { downUrls } = this;
    downUrls = downUrls ? downUrls:[]
    this.status = downUrls.map(item => item.status);
  }
}
</script>

<style lang="less" scoped>
.file-list {
  width: 100%;
  margin-top: 10px;
  .file-item, .file-item-text{
    display: flex;
  }
  .file-item{
    color:rgba(0,0,0,0.45);
    cursor: pointer;
    line-height: 22px;
    margin-bottom: 10px;
    word-break: normal;
    white-space: nowrap;
    &:hover{
      background-color: #E8FCF4;
    }
  }
  .file-item.done{
    color: rgba(0,0,0,0.65)
  }
  .file-item.error{
    color: #F5222D;
  }
  .file-item-text{
    justify-content: space-between;
    position: relative;
    z-index: 10;
    &:hover
    .file-item-name-right
    .anticon-close{
      display: inline-block;
    }
  }
  .file-item-text-warp{
    width: 100%;
    padding-left: 20px;
  }
  .anticon-paper-clip,
  .loading{
    position: absolute;
    margin-top: 3px;
  }
  .file-item-progress{
    position: absolute;
    transform: translateY(-12px);
    display: none;
  }
  .showProgress{
    display: block;
  }
  .file-item-name{
    max-width: 70%;
  }
  .file-item-name-right{
    color: rgba(0,0,0,0.45);
    span{
      display: inline-block;
      margin-left: 6px;
    }
    .icon-wrap{
      padding-right: 20px;
    }
    .anticon-close{
      margin: 3px 4px 0;
      position: absolute;
      display: none;
    }
  }
}

</style>

