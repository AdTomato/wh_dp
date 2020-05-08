<template>
  <div class="warp">
    <div class="sheet">
      <div class="sheet__row sheet__head">
        <div
          class="center middle sheet__col"
          :class="{ 'shadow-left': shadowLeft && freezeColumns.length === 0 }"
        >
          <a-checkbox
            v-if="checkbox"
            @change="checkAll"
            :indeterminate="indeterminate"
            :checked="checkedAll"
          ></a-checkbox>

          <template v-else>{{
            $t("cloudpivot.form.renderer.number")
          }}</template>
        </div>

        <template v-for="(col, colIdx) in freezeColumns">
          <h3-size-slider
            v-if="columnSlots[col.key]"
            class="middle sheet__col"
            :key="col.key"
            :class="[shadowLeft && isLastFreeze(col.key) ? 'shadow-left' : '']"
            :style="getColStyle(col.key)"
            :right="true"
            :maxWidth="855"
            @resize="e => onColResize(e, colIdx, col)"
          >
            <slot
              :name="columnSlots[col.key]"
              :column="col"
              :index="colIdx"
            ></slot>
          </h3-size-slider>

          <h3-size-slider
            v-else
            class="middle sheet__col"
            :key="col.key"
            v-show="showColumn(col.key)"
            :class="[
              getControlClass(col.type),
              shadowLeft && isLastFreeze(col.key) ? 'shadow-left' : ''
            ]"
            :style="getColStyle(col.key)"
            :right="true"
            :maxWidth="855"
            @resize="e => onColResize(e, colIdx, col)"
          >
            <div>
              {{ getColumnLabel(col) }}
              <a-tooltip placement="top" v-if="getTips(col)">
                <template slot="title">
                  <span>{{ getTips(col) }}</span>
                </template>
                <a-icon
                  type="anticon anticon-question-circle-o"
                  theme="twoTone"
                />
              </a-tooltip>
            </div>

            <a-dropdown v-show="canUnFrozen">
              <a class="ant-dropdown-link">
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a
                    href="javascript:;"
                    @click="freezeColumn(col.key, false)"
                  >{{ $t("cloudpivot.form.renderer.unFrozenColumn") }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </h3-size-slider>
        </template>

        <div class="sheet__cols" :class="{ noAction: !showAction }">
          <div class="sheet__row">
            <template v-for="(col, colIdx) in unFreezeColumns">
              <h3-size-slider
                v-if="columnSlots[col.key]"
                class="middle sheet__col"
                :key="col.key"
                :class="[isLastUnFreeze(col.key) ? 'last' : '']"
                :style="getColStyle(col.key)"
                :right="true"
                :maxWidth="855"
                @resize="e => onColResize(e, colIdx, col)"
              >
                <slot
                  :name="columnSlots[col.key]"
                  :column="col"
                  :index="colIdx"
                ></slot>
              </h3-size-slider>

              <h3-size-slider
                v-else
                class="middle sheet__col"
                :key="col.key"
                v-show="showColumn(col.key)"
                :class="[
                  getControlClass(col.type),
                  isLastUnFreeze(col.key) ? 'last' : ''
                ]"
                :style="getColStyle(col.key)"
                :right="true"
                :maxWidth="855"
                @resize="e => onColResize(e, colIdx, col)"
              >
                <div>
                  {{ getColumnLabel(col) }}
                  <a-tooltip placement="top" v-if="getTips(col)">
                    <template slot="title">
                      <span>{{ getTips(col) }}</span>
                    </template>
                    <a-icon
                      type="anticon anticon-question-circle-o"
                      theme="twoTone"
                    />
                  </a-tooltip>
                </div>

                <a-dropdown v-show="canFrozen && sheetIsScroll">
                  <a class="ant-dropdown-link">
                    <a-icon type="down" />
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a
                        href="javascript:;"
                        @click="freezeColumn(col.key, true)"
                      >{{ $t("cloudpivot.form.renderer.frozenColumn") }}</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </h3-size-slider>
            </template>
          </div>
        </div>

        <div
          v-if="showAction"
          class="center middle sheet__col"
          :class="{ 'shadow-right': shadowRight }"
        >
          {{ $t("cloudpivot.form.renderer.action") }}
        </div>
      </div>

      <div class="sheet__body" :class="{ 'show-total': showTotal }">
        <div
          class="sheet__row"
          v-for="(row, rowIdx) in rows"
          :key="rowIdx"
          :class="{'diffControls': !!row.diff}"
          @click="$emit('rowClick', rowIdx)"
        >
          <checkbox-text
            :readonly="!checkbox && !radio"
            :radio="radio"
            :value="checkeds[rowIdx]"
            @change="check(rowIdx)"
            class="center middle sheet__col"
            :class="{ 'shadow-left': shadowLeft && freezeColumns.length === 0 }"
          >{{ rowIdx + rowNumber + 1 }}</checkbox-text>

          <template v-for="(col, colIdx) in getFreezeCells(row)">
            <div
              v-if="rowSlots[col.key]"
              class="center middle sheet__col"
              :key="col.key"
              :style="getColStyle(col.key)"
              :class="{ 'shadow-left': shadowLeft && isLastFreeze(col.key) }"
            >
              <slot
                :name="rowSlots[col.key]"
                :row="row"
                :column="columns[colIdx]"
                :cell="col"
                :rowIndex="rowIdx + rowNumber"
              ></slot>
            </div>

            <div
              v-else
              class="center middle sheet__col"
              :key="col.key"
              v-show="showColumn(col.key)"
              :style="getColStyle(col.key)"
              :class="[
                getControlClass(col.type),
                shadowLeft && isLastFreeze(col.key) ? 'shadow-left' : ''
              ]"
            >
              <a-tooltip placement="topLeft" v-show="col.controller.display">
                <template slot="title" v-if="col.controller.hasError">
                  <ul>
                    <li v-for="err in col.controller.errors" :key="err">
                      {{ getErrorMessage(col, err) }}
                    </li>
                  </ul>
                </template>

                <div
                  :class="{
                    error: col.controller.hasError,
                    required: col.controller.required
                  }"
                >
                  <base-control-adapter
                    class="cell"
                    :control="col"
                  ></base-control-adapter>
                </div>
              </a-tooltip>
            </div>
          </template>

          <div
            class="sheet__cols"
            :class="{ noAction: !showAction }"
            @keydown.9="onScroll"
          >
            <div class="sheet__row">
              <template v-for="(col, colIdx) in row">
                <template v-if="frozenKeys.indexOf(col.key) === -1">
                  <div
                    v-if="rowSlots[col.key]"
                    class="middle sheet__col diffControls"
                    :key="`${col.key + colIdx}`"
                    :class="[isLastUnFreeze(col.key) ? 'last' : '']"
                    :style="getColStyle(col.key)"
                  >
                    <slot
                      :name="rowSlots[col.key]"
                      :row="row"
                      :column="columns[colIdx]"
                      :cell="col"
                      :rowIndex="rowIdx + rowNumber"
                    ></slot>
                  </div>

                  <div
                    v-else
                    class="middle sheet__col"
                    :key="`${col.key + colIdx}`"
                    v-show="showColumn(col.key)"
                    :class="[
                      getControlClass(col.type),
                      isLastUnFreeze(col.key) ? 'last' : '',
                      col.diff?'diffControls': ''
                    ]"
                    :style="getColStyle(col.key)"
                  >
                    <a-tooltip
                      placement="topLeft"
                      v-show="col.controller.display"
                    >
                      <template slot="title" v-if="col.controller.hasError">
                        <ul>
                          <li v-for="err in col.controller.errors" :key="err">
                            {{ getErrorMessage(col, err) }}
                          </li>
                        </ul>
                      </template>

                      <div
                        :class="{
                          error: col.controller.hasError,
                          required: col.controller.required
                        }"
                      >
                        <base-control-adapter
                          class="cell"
                          :control="col"
                        ></base-control-adapter>
                      </div>
                    </a-tooltip>
                  </div>
                </template>
              </template>
            </div>
          </div>

          <div
            class="center middle sheet__col"
            v-if="showAction"
            :class="{ 'shadow-right': shadowRight }"
          >
            <slot
              name="action"
              :row="row"
              :index="rowIdx + rowNumber"
            ></slot>
          </div>
        </div>
      </div>

      <div class="sheet__row total" v-if="showTotal && hasStat">
        <div
          class="center middle sheet__col"
          :class="{ 'shadow-left': shadowLeft && freezeColumns.length === 0 }"
        >
          {{ $t("cloudpivot.form.renderer.total") }}
        </div>

        <div
          class="center middle sheet__col"
          v-for="col in freezeColumns"
          :key="col.key"
          v-show="showColumn(col.key)"
          :class="[
            getControlClass(col.type),
            shadowLeft && isLastFreeze(col.key) ? 'shadow-left' : ''
          ]"
          :style="getColStyle(col.key)"
        >
          <template v-if="showStat(col.key)">{{ getStatText(col.key) }}{{ stats[col.key] | number }}</template>
        </div>

        <div class="sheet__cols" :class="{ noAction: !showAction }">
          <div class="sheet__row">
            <div
              class="center middle sheet__col"
              v-for="col in unFreezeColumns"
              :key="col.key"
              v-show="showColumn(col.key)"
              :class="[
                getControlClass(col.type),
                isLastUnFreeze(col.key) ? 'last' : ''
              ]"
              :style="getColStyle(col.key)"
            >
              <template v-if="showStat(col.key)">{{ getStatText(col.key) }}{{ stats[col.key] | number }}</template>
            </div>
          </div>
        </div>

        <div
          v-if="showAction"
          class="center middle sheet__col"
          :class="{ 'shadow-right': shadowRight }"
        ></div>
      </div>
    </div>

    <div class="sheet__row scrollbar">
      <div class="center middle sheet__col"></div>

      <div
        class="center middle sheet__col"
        v-for="col in freezeColumns"
        :key="col.key"
        v-show="showColumn(col.key)"
        :style="getColStyle(col.key)"
        :class="[getControlClass(col.type)]"
      ></div>

      <div class="sheet__cols" @scroll="onScroll">
        <div class="sheet__row">
          <template v-for="col in unFreezeColumns">
            <div
              v-if="columnSlots[col.key]"
              class="center middle sheet__col"
              :key="col.key"
              :class="[isLastUnFreeze(col.key) ? 'last' : '']"
              :style="getColStyle(col.key)"
            ></div>

            <div
              v-else
              class="center middle sheet__col"
              :key="col.key"
              v-show="showColumn(col.key)"
              :class="[
                getControlClass(col.type),
                isLastUnFreeze(col.key) ? 'last' : ''
              ]"
              :style="getColStyle(col.key)"
            ></div>
          </template>
        </div>
      </div>

      <div v-if="showAction" class="center middle sheet__col"></div>
    </div>
  </div>
</template>

<script lang="ts" src="./sheet.ts"></script>

<style lang="less" scoped>
.warp {
  position: relative;

  &:hover {
    & > .sheet__row.scrollbar.stick {
      opacity: 0.8;
    }
  }
}

/*ie11 css hack*/
@media all and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .warp.fullsheet {
    margin-right: 8px;
  }
}

.shadow-left {
  position: relative;

  &::after {
    content: "";
    box-shadow: inset 8px 0px 6px -6px rgba(0, 0, 0, 0.15);
    height: 100%;
    width: 8px;
    display: block;
    right: -8px;
    top: 0; // 解决ie11 往下偏移的问题
    position: absolute;
    z-index: 1;
  }
}

.shadow-right {
  position: relative;

  &::before {
    content: "";
    box-shadow: inset -9px 0 6px -6px rgba(0, 0, 0, 0.15);
    height: 100%;
    width: 8px;
    display: block;
    left: -8px;
    top: 0; // 解决ie11 往下偏移的问题
    position: absolute;
    z-index: 1;
  }
}

.sheet {
  border: 1px solid #e8e8e8;
  border-bottom: 0;
  border-radius: 4px;

  &__row {
    display: flex;
  }

  &__col {
    width: 46px;
    padding: 8px;
    flex-shrink: 0;
    border-right: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    transition: width 1ms linear;

    &.two {
      width: 92px;
    }
    &.attachment {
    }
  }

  &__head {
    background-color: #fafafa;
    font-weight: 500;
  }
}

.sheet__cols {
  flex-grow: 1;
  width: 100%;
  overflow-x: hidden;

  & > .sheet__row {
    height: 100%;

    & > .sheet__col {
      min-width: 60px;
      // overflow: auto;

      // & > div {
      //   flex-grow: 1;
      // }

      &.dropdown {
        line-height: 0.99;
        &>div{
          width: 100%;
        }
      }

      // &.logic,
      // &.text,
      // &.number,
      // &.dropdown {
      //   min-width: 60px;
      // }

      // &.textarea {
      //   min-width: 300px;
      // }

      &.last {
        flex-grow: 1;
      }
    }
  }
}

.sheet__head .sheet__col {
  border-right-width: 0;

  &.center {
    border-right-width: 1px;
  }

  /deep/.h3-size-slider__sider-right {
    right: 0;
    background: #e8e8e8;
    width: 1px;
  }

  // &:last-child{
  //   /deep/.h3-size-slider__sider-right{
  //     right:-1px;
  //   }
  // }

  & > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-grow: 1;
  }
}

.sheet__body .sheet__cols .sheet__col {
  overflow: hidden;
}

.sheet__body .sheet__col > div {
  flex-grow: 1;
}

.sheet__cols + .sheet__col,
.noAction .last {
  border-right: none;
}

.sheet__row.scrollbar {
  min-height: 7px;
  margin-bottom: 7px;

  &.stick {
    position: fixed;
    bottom: 2px;
    z-index: 100;
    opacity: 0.4;
    transition: opacity 0.3s ease-out;
  }

  & > .sheet__cols {
    overflow-x: auto;

    & > .sheet__row {
      height: 0;
    }
  }

  .sheet__col {
    min-height: 1px;
    // height: auto;
    // height:1px;
    border: 0;
    margin-right: 1px;
    padding-top: 0;
    padding-bottom: 0;
  }
}

.center {
  display: inline-flex;
  justify-content: center;
}

.middle {
  display: inline-flex;
  align-items: center;
}

.list {
  .sheet {
    border: none;
  }

  .sheet > .sheet__head,
  .sheet__body > .sheet__row {
    border-bottom: 1px solid #e8e8e8;
  }

  .sheet__col {
    border: none;
  }

  .sheet__head /deep/.h3-size-slider__sider {
    background: #e8e8e8;
    width: 1px;
    top: 8px;
    height: 22px;
  }

  .sheet__body .sheet__col > div {
    max-width: 100%;

    /deep/.cell {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

/deep/a.ant-dropdown-link {
  color: @light-color-2;

  &:active {
    color: @light-color-2;
  }
}
</style>
