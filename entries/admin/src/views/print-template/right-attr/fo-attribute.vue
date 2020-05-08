<template>
  <div class="right-form">
    <p class="form-title">
      模板类型
    </p>
    <div class="document-print">
      <a-radio-group @change="changeDocument" v-model="isDocument">
        <!--<a-radio disabled :value="1">套打类</a-radio>-->
        <!--<div class="top-content">-->
        <!--<div>用于重复打印或套打表单内容</div>-->
        <!--<div>-->
        <!--注：可每页重复打印主表内容，打印固定条数且不重复的子表内容或将表单内容打印到已有样式的纸张-->
        <!--</div>-->
        <!--</div>-->
        <a-radio :value="2">文档类</a-radio>
        <div class="bottom-content">
          <div>用于连续打印表单所有内容</div>
          <div>
            注：从上至下依次打印表单内容且不重复，同打印word文档
          </div>
          <!-- <a-checkbox @change="checkChange($event, 'formHead')">跨页打印时重复显示子表表头</a-checkbox> -->
          <div>
            默认行距
            <a-input-number
              :min="1"
              :max="10"
              v-model="inputNum"
              @change="inputChange"
            />
          </div>
        </div>
      </a-radio-group>
      <div class="down-btn">
        <a-checkbox @change="checkChange($event, 'downBtn')">隐藏下载按钮</a-checkbox>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'right-form',
})
export default class RightForm extends Vue {
  isDocument:number = 2;

  inputNum:number = 0;

  created() {
  }

  changeDocument(v:any) {
    console.log(v);
  }

  checkChange(e:any, str:string) {
    console.log(e.target.checked, str);
  }

  inputChange(e:any) {
    console.info(e);
  }
}
</script>

<style lang="less" scoped>
  .right-form{
    text-align: left;
    margin: 0 10px 0 10px;
    p {
      font-size: 14px;
      font-weight: bold;
      color: rgba(0,0,0,0.85);
    }
    .document-print {
      margin: 10px 0 0 0;
      label {
        display: block;
      }
      .top-content, .bottom-content {
        margin: 5px 0 5px 25px;
        color: #000;
        opacity: 0.7;
        font-weight: 100 ;
        .ant-checkbox-wrapper {
          margin: 10px 0 10px -10px;
        }
      }
      .down-btn {
        margin: 10px 0 5px 0;
      }
    }
  }
</style>
