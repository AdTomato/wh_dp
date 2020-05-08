<template>
  <div class="sidebar">
    <div class="sidebar__item sidebar__add" @click="addFolder">
      <span>{{ $t('languages.integration.Folder') }}</span>
      <i class="icon aufontAll h-icon-all-plus-o"></i>
    </div>
    <ul>
      <li
        v-for="(item,index) in categories"
        :key="index"
        :class="['sidebar__item',index === current && 'active']"
      >
        <span @click="selectItem(item,index)">{{ item.name }}</span>
        <a-popover
          v-model="item.showPop"
          placement="rightTop"
          trigger="click"
          overlayClassName="sidebar__popover"
        >
          <template slot="content">
            <p @click="editFolder(item)">{{ $t('languages.integration.Edit') }}</p>
            <p @click="popFolder(item,index)" class="danger">{{ $t('languages.integration.Delete') }}</p>
          </template>
          <i class="icon aufontAll h-icon-all-setting-o setting"></i>
        </a-popover>
      </li>
    </ul>
    <!--  -->
    <add-folder
      v-model="showEditModel"
      :folder="folderData"
      :handler="handler"
      @reset="resetFolderData"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace, State, Action } from 'vuex-class';
import AddFolder from './modals/add-folder.vue';

const CategoryModule = namespace('Integration/Category');

@Component({
  name: 'integration-sidebar',
  components: {
    AddFolder
  }
})
export default class IntegrationSidebar extends Vue {
  @CategoryModule.Action('getCategories') getCategories: any;

  @CategoryModule.Action('createCategory') createCategory: any;

  @CategoryModule.Action('updateCategory') updateCategory: any;

  @CategoryModule.Action('deleteCategory') deleteCategory: any;

  @CategoryModule.State('categories') categories!: BizService.Category.Item[];

  // 当前激活的目录索引
  current: number = -1;

  // 当前激活目录的数据
  folderData: any = {};

  // 是否显示添加/编辑弹窗
  showEditModel: boolean = false;

  /**
   * 选中目录
   */
  selectItem(item: BizService.Category.Item, index: number) {
    if (index === this.current) {
      return;
    }
    this.current = index;
    this.$emit('toggle', item);
  }

  /**
   * 新增目录
   */
  addFolder() {
    this.folderData = {};
    this.showEditModel = true;
  }

  /**
   * 编辑目录
   */
  editFolder(item: BizService.Category.Item) {
    item.showPop= false;
    this.folderData = item;
    this.showEditModel = true;
  }

  /**
   * 删除目录
   */
  popFolder(item: BizService.Category.Item, index: number) {
    item.showPop= false;
    this.deleteCategory(item).then((res: any) => {
      if (!res.errcode) {
        this.$message.success('删除目录成功');
        this.reselectFolder(index);
      } else if (res.errcode === 501003) {
        /* note: 如果是有业务方法，则弹窗提示有业务方法，只有确认按钮 */
        this.$warning({
          title: this.$t('languages.Apps.DeletePrompt'),
          content: this.$t('languages.integration.DeleteMethodsBeforeDeleteFolder'),
          okText: this.$t('languages.Apps.Ok').toString(),
        });
      }
    });
  }

  /**
   * 根据当前移除的目录是否当前选中，决定是否重新选中目录
   */
  reselectFolder(index: number) {
    console.log('remove folder', index);
    if (index === this.current) {
      const firstItem:any = this.categories[0];
      if (firstItem) {
        this.selectItem(firstItem, 0);
      } else {
        this.current = -1;
        this.$emit('toggle', null);
      }
    }
  }

  /**
   * 重置目录数据
   */
  resetFolderData() {
    this.folderData = {};
  }

  /**
   * 处理编辑或新增
   */
  handler({ id, name, callback }:any) {
    if (!id) {
      this.createCategory({ name }).then((res: any) => {
        if (res.errcode === 0) {
          this.$message.success('添加目录成功');
          callback();
        } else {
          this.$message.error(res.errmsg);
        }
      }).finally(() => {
        // 如果添加前未选中目录或无目录，则默认选中第一个
        this.$nextTick(() => {
          if (this.current < 0) {
            this.selectItem(this.categories[0], 0);
          }
        });
      });
    } else {
      const existNames: string[] = this.categories.filter((cat:any) => cat.id !== id).map((cat:any) => cat.name);
      if (existNames.includes(name)) {
        this.$message.error('该目录名称已存在');
        return;
      }
      this.updateCategory({ id, name }).then((res: any) => {
        if (!res.errcode) {
          this.$message.success('更新目录成功');
          callback();
        } else {
          this.$message.error(res.errmsg);
        }
      });
    }
  }

  mounted() {
    this.getCategories().then(() => {
      this.selectItem(this.categories[0], 0);
    });
  }
}
</script>
<style lang="less" scoped>
.sidebar {
  padding-top: 16px;
  background-color: #fafafa;
  box-shadow: 1px 0px 0px 0px rgba(232, 232, 232, 1);
  &__item {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    height: 40px;
    line-height: 40px;
    padding: 0 16px 0 24px;
    > span {
      flex: 1;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    i {
      flex: none;
      cursor: pointer;
      font-size: 0;
    }
    &:hover,
    &.active {
      background-color: #E8FCF4;
      // background-color: #fff;
      i {
        font-size: 14px;
      }
      // >span {
      //   color: @primary-color;
      // }
    }
    &.active {
      >span {
        color: @primary-color;
        pointer-events: none;
      }
    }
  }
  &__add {
    margin-top: 0;
    color:rgba(0,0,0,0.85);
    font-family:PingFang-SC-Regular;
    font-weight: 600;
    i {
      font-size: 14px;
      color: @primary-color;
    }
    &:hover {
      background-color: transparent;
    }
  }
  &__popover {
    p {
      border-bottom: 1px solid rgba(0, 0, 0, 0.09);
      padding: 6px 16px;
      cursor: pointer;
      &:hover {
        background-color: #E8FCF4;
      }
      &:first-child {
        &:hover {
          &:before {
            content: "";
            display: block;
            width: 8.5px;
            height: 8.5px;
            transform: rotate(45deg);
            background-color: #E8FCF4;
            position: absolute;
            left: 6px;
            top: 12px;
          }
        }
      }
    }
    .danger {
      border-bottom: none;
      // color: #f5222d;
    }
  }
}
</style>

<style lang="less">
.sidebar__popover {
  .ant-popover-inner-content {
    padding: 0;
  }
}
</style>
