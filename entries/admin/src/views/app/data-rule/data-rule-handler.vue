<template>
  <div class="data-rule-handler">
    <div class="step-wrap">
      <div class="step" ref="scrollArea">
        <a-steps :current="curStep">
          <a-step>
            <span slot="title" class="step-title">设置触发动作</span>
          </a-step>
          <a-step>
            <span slot="title" class="step-title">设置执行动作</span>
          </a-step>
        </a-steps>
      </div>
      <!-- 步骤1 -->
      <div class="handler-box" v-show="curStep === 0">
        <div class="handler-item">
          <div class="pull-left">
            <span class="required">*</span>规则名称
          </div>
          <div class="pull-right">
            <a-tooltip :visible="isShowErrRuleName">
              <template slot="title">{{ validateStr }}</template>
              <div :class="isShowErrRuleName ? 'input-box has-error' : 'input-box'">
                <a-input
                  placeholder="请输入"
                  class="w_310"
                  v-model="ruleName"
                  @change="onRuleNameChange"
                  maxlength="50"
                  @blur="isShowErrRuleName = false"
                ></a-input>
              </div>
            </a-tooltip>
          </div>
        </div>

        <div class="handler-item">
          <div class="pull-left">
            <span class="required">*</span>触发对象
          </div>
          <div class="pull-right">
            <a-select
              style="width: 310px"
              v-model="triggerObj"
              placeholder="请选择"
              @change="selectTriggerObj"
              :class="!triggerObj ? 'show-placeholder':''"
              :getPopupContainer="getPopupContainer"
              :disabled="mode === 'edit'"
            >
              <!-- :disabled="mode === 'edit'" -->
              <a-select-option
                v-for="(item, index) in triggerObjLists"
                :value="item.code"
                :key="index"
                :propertyType="item.propertyType"
              >{{ `${item.propertyType === 8 ? '子表' : '模型'}-${item.name}[${item.code}]` }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="handler-item">
          <div class="pull-left v-top">触发条件</div>
          <div class="pull-right">
            <div class="trigger-box">
              <div
                v-for="(item, index) in triggerConditionList"
                class="trigger-block"
                :class="item.isSelected ? 'selected': ''"
                :key="index"
                @click="selectTriggerCondition(index)"
              >
                <h3>{{ item.name }}</h3>
                <p>{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="filter-conditions">
          <div class="filter-conditions-top">
            <div class="filter-conditions-top-left">
              <template>
                <span>数据条件</span>
                <span>满足条件的数据触发执行动作</span>
              </template>
            </div>
            <div class="filter-conditions-top-right">
              <a-select
                style="width: 310px"
                v-model="dataConditionJoinType"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  v-for="(item, index) in dataConditionList"
                  :value="item.index"
                  :key="index"
                >{{ item.name }}</a-select-option>
              </a-select>
            </div>
          </div>
          <div class="table-box" v-if="dataConditionJoinType !== 1">
            <template>
              <a-table
                :columns="dataConditionColumns"
                :dataSource="dataConditionData"
                :pagination="false"
                size="small"
              >
                <!-- 数据字段 -->
                <template slot="dataItem" slot-scope="text,record">
                  <div class="item-box">
                    <data-item-select
                      v-model="record.dataItem.val"
                      :list="record.dataItem.list"
                      @change="onDataItemChange(record)"
                      :systemFilterCtl="{
                        code: ['id', 'sortKey', 'modifier', 'workflowInstanceId', 'ownerDeptQueryCode']
                      }"
                      :bizFilterCtl="{
                        type: [6, 7, 8, 9, 10],
                      }"
                      :getPopupContainer="getPopupContainer"
                    />
                    <!-- <a-select
                      @change="onDataItemChange(record)"
                      style="width: 240px"
                      v-model="record.dataItem.val"
                      placeholder="请选择"
                      :class="!record.dataItem.val ? 'show-placeholder':''"
                      :getPopupContainer="getPopupContainer"
                    >
                      <a-select-opt-group label="业务数据项">
                        <a-select-option
                          v-for="(item, index) in record.dataItem.list"
                          :value="item.code"
                          :key="index"
                          :propertyType="item.propertyType"
                          :code="item.code"
                          :isDefaultProperty="item.defaultProperty"
                          :index="record.dataItem.index"
                          v-if="!item.defaultProperty && item.propertyType !== 9"
                        >{{ item.name }}[{{ item.code }}]</a-select-option>
                      </a-select-opt-group>

                      <a-select-opt-group label="系统数据项">
                        <a-select-option
                          v-for="(item, index) in record.dataItem.list"
                          :value="item.code"
                          :key="index"
                          :propertyType="item.propertyType"
                          :code="item.code"
                          :isDefaultProperty="item.defaultProperty"
                          :index="record.dataItem.index"
                          v-if="item.defaultProperty"
                        >{{ item.name }}[{{ item.code }}]</a-select-option>
                      </a-select-opt-group>
                    </a-select>-->
                  </div>
                </template>

                <!-- 过滤条件 -->
                <template slot="filterCondition" slot-scope="text, record">
                  <div class="item-box">
                    <a-select
                      style="width: 100px"
                      v-model="record.filterCondition.val"
                      @change="onFilterConditionChange"
                      placeholder="请选择"
                      :class="!record.filterCondition.val ? 'show-placeholder':''"
                      :getPopupContainer="getPopupContainer"
                    >
                      <a-select-option
                        v-for="(item, index) in record.filterCondition.list"
                        :value="item.index"
                        :key="index"
                        :index="record.filterCondition.index"
                      >{{ item.name }}</a-select-option>
                    </a-select>
                  </div>
                </template>

                <!-- 值 -->
                <template slot="value" slot-scope="text, record">
                  <div class="item-box">
                    <div v-if="record.value.display === 1">
                      <a-input
                        style="width: 180px"
                        v-model="record.value.val"
                        placeholder="请输入"
                      ></a-input>
                    </div>
                    <!-- 日期 需要校验 -->
                    <div v-if="record.value.display === 2">
                      <a-tooltip :visible="!!record.value.errMsg">
                        <template slot="title">
                          <span v-html="record.value.errMsg"></span>
                        </template>
                        <div :class="record.value.errMsg ? 'input-box has-error' : 'input-box'">
                          <a-input
                            style="width: 180px"
                            v-model="record.value.val"
                            placeholder="支持日期格式: 2019-05-10 08:00"
                            @blur="checkDate(record.value)"
                          ></a-input>
                        </div>
                      </a-tooltip>
                    </div>

                    <div v-if="record.value.display === 3">
                      <a-input
                        type="number"
                        style="width: 180px"
                        v-model="record.value.val"
                        placeholder="请输入"
                      ></a-input>
                    </div>

                    <div v-if="record.value.display === 4">
                      <div style="width: 180px"></div>
                    </div>

                    <div v-if="record.value.display === 4">
                      <div style="width: 180px"></div>
                    </div>

                    <div style="width: 180px" v-if="record.value.display === 5">
                      <a-select
                        v-model="record.value.val"
                        style="width: 180px"
                        :getPopupContainer="getPopupContainer"
                      >
                        <a-select-option value="true">true</a-select-option>
                        <a-select-option value="false">false</a-select-option>
                      </a-select>
                    </div>

                    <div
                      style="width: 180px; background: white!important;"
                      v-if="record.value.display === 6"
                    >
                      <StaffSelector
                        class="workflow-name-input"
                        v-model="record.value.val"
                        :options="staffSelectorOpts"
                      />
                    </div>

                    <div style="width: 180px" v-if="record.value.display === 7">
                      <a-select
                        v-model="record.value.val"
                        style="width: 180px"
                        :getPopupContainer="getPopupContainer"
                      >
                        <a-select-option value="PROCESSING">进行中</a-select-option>
                        <a-select-option value="COMPLETED">已完成</a-select-option>
                        <!-- <a-select-option value="CANCELLED">已作废</a-select-option> -->
                      </a-select>
                    </div>
                  </div>
                </template>

                <!-- 操作 -->
                <template slot="operation" slot-scope="operation">
                  <span class="delete-btn">
                    <i
                      class="icon aufontAll h-icon-all-delete-o"
                      @click="deleteDataConditionItem(operation)"
                    ></i>
                  </span>
                </template>
              </a-table>
            </template>
            <div
              class="add-row"
              @click="addDataCondition"
              ref="addDataConditionBtn"
            >
              <i class="icon aufontAll h-icon-all-plus-o"></i> 新增查询条件
            </div>
          </div>
        </div>
      </div>

      <!-- 步骤2 -->
      <div class="handler-box" v-show="curStep === 1">
        <div class="handler-item">
          <div class="pull-left">
            <span class="required">*</span>目标模型
          </div>
          <div class="pull-right">
            <div class="model-tree" v-if="isShowModelTree">
              <!--  -->
              <ModelTree
                @select="(data) => { selectModel(data); clearTargetTableCode()}"
                :width="310"
                :treeValue="targetModel"
                :appCode="appCode"
                :isWriteBack="isWriteBack"
                :getPopupContainer="getPopupContainer"
              />
            </div>
          </div>
        </div>
        <div class="handler-item" v-if="!isSubSchema">
          <div class="pull-left">
            <span class="required">*</span>更新对象
          </div>
          <div class="pull-right">
            <a-select
              style="width: 310px"
              v-model="targetTableCode"
              placeholder="请选择"
              :disabled="targetModel===''"
              :class="!triggerObj ? 'show-placeholder':''"
              @change="targetTableChange"
              :getPopupContainer="getPopupContainer"
            >
              <a-select-option
                v-for="(item, index) in upDateObjLists"
                :value="item.code"
                :key="index"
                :propertyType="item.propertyType"
              >{{ `${item.propertyType === 8 ? '子表' : '模型'}-${item.name}[${item.code}]` }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="handler-item"></div>

        <div class="handler-item mb-0">
          <div class="pull-left v-top">
            触发动作
            <a-tooltip placement="right">
              <template slot="title">
                <span>达到触发条件后，将做数据操作的动作，在设定具体操作规则前需要选择触发动作类型</span>
              </template>
              <i class="icon aufontAll h-icon-all-question-circle-o"></i>
            </a-tooltip>
          </div>
          <div class="pull-right">
            <div class="trigger-box">
              <div
                v-for="(item, index) in triggerActionList"
                class="trigger-block"
                :class="item.isSelected ? 'selected': ''"
                :key="index"
                @click="selectTriggerAction(index)"
              >
                <h3>{{ item.name }}</h3>
                <p>{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 新增过滤条件 -->
        <div class="filter-conditions">
          <div class="filter-conditions-top">
            <div class="filter-conditions-top-left">
              <template>
                <span>{{ filterConditionText }}</span>
                <span>{{ filterConditionTooltip }}</span>
              </template>
            </div>
            <div class="filter-conditions-top-right">
              <a-select
                :getPopupContainer="getPopupContainer"
                style="width: 310px"
                v-model="searchCondition"
              >
                <a-select-option
                  v-for="(item, index) in conditionJoinTypes"
                  :value="item.index"
                  :key="index"
                >{{ item.name }}</a-select-option>
              </a-select>
            </div>
          </div>
          <div class="table-box tabel-color">
            <h3-panel
              :title="'主表条件'"
              :tips="'查找符合条件的主表数据'"
              :collapsible="true"
            >
              <template>
                <a-table
                  :columns="filterColumns"
                  :dataSource="filterData"
                  :pagination="false"
                  size="small"
                >
                  <!-- 目标数据字段 -->
                  <template slot="targetField" slot-scope="text,record">
                    <div class="item-box">
                      <data-item-select
                        v-model="record.targetField.val"
                        :list="record.targetField.list"
                        @change="(val) => {
                          dataItemChange(val, record, 1);
                        }"
                        :systemFilterCtl="{
                          code: ['workflowInstanceId', 'sequenceNo', 'sequenceNo', 'modifier', 'ownerDeptQueryCode','sortKey']
                        }"
                        :bizFilterCtl="{
                          type: [10, 8, 6, 7],
                        }"
                        :disabled="!targetModel"
                        :getPopupContainer="getPopupContainer"
                      />
                    </div>
                  </template>

                  <!-- 操作符 -->
                  <!-- @change="onOperatorChange" -->
                  <span class="hide-thead" slot="operatorTitle">操作符</span>
                  <template slot="operator" slot-scope="text,record">
                    <div class="item-box">
                      <a-select
                        style="width: 100px"
                        v-model="record.operator.val"
                        placeholder="请选择"
                        @change="operatorChange(record)"
                        :class="!record.operator.val ? 'show-placeholder':''"
                        :getPopupContainer="getPopupContainer"
                      >
                        <a-select-option
                          v-for="(item, index) in record.operator.list"
                          :value="item.index"
                          :key="index"
                          :disabled="item.disabled"
                          :index="record.operator.index"
                          data-type="filter"
                        >{{ item.name }}</a-select-option>
                      </a-select>
                    </div>
                  </template>

                  <!-- 值 -->
                  <template slot="value" slot-scope="text, record">
                    <div class="item-box">
                      <a-select
                        style="width: 100px"
                        v-model="record.value.val"
                        @change="valueSelectChange(record)"
                        placeholder="请选择"
                        :class="!record.value.val ? 'show-placeholder':''"
                        :getPopupContainer="getPopupContainer"
                      >
                        <a-select-option
                          v-for="(item, index) in record.value.list"
                          :value="item.index"
                          :key="index"
                          :index="record.value.index"
                          :disabled="item.disabled"
                          data-type="filter"
                        >{{ item.name }}</a-select-option>
                      </a-select>
                    </div>
                  </template>

                  <!-- 当前模型字段 -->
                  <template slot="currentField" slot-scope="text,record">
                    <!-- 动态值 -->
                    <div class="item-box">
                      <data-item-select
                        v-model="record.currentField.val"
                        v-show="record.value.val === 1"
                        :list="record.currentField.list"
                        :systemFilterCtl="{
                          code: ['workflowInstanceId', 'sequenceNo', 'sequenceNo', 'name', 'ownerDeptQueryCode','sortKey']
                        }"
                        :bizFilterCtl="{
                          type: [10, 8, 6, 7],
                        }"
                        :disabled="record.targetField.val === ''"
                        :getPopupContainer="getPopupContainer"
                      />

                      <!-- 固定值 -->
                      <a-input
                        style="width: 240px"
                        v-model="record.currentField.val"
                        v-show="record.value.val === 2 && !getLogicType(record.targetField)"
                        :placeholder="getDateType(record.targetField) ? '日期格式2019-05-10 12:00:00' : '请输入'"
                        :disabled="record.targetField.val === ''"
                      ></a-input>
                      <!-- 为空 -->
                      <div
                        style="width: 240px"
                        v-show="record.value.val === 3 || record.value.val === ''"
                      ></div>

                      <!-- 逻辑时下拉 -->
                      <div
                        style="width: 240px"
                        v-show="record.value.val === 2 && getLogicType(record.targetField)"
                      >
                        <a-select
                          :disabled="record.targetField.val === ''"
                          v-model="record.currentField.val"
                          style="width: 240px"
                          :getPopupContainer="getPopupContainer"
                        >
                          <a-select-option value="true">true</a-select-option>
                          <a-select-option value="false">false</a-select-option>
                        </a-select>
                      </div>
                    </div>
                  </template>

                  <!-- 操作 -->
                  <template slot="operation" slot-scope="operation">
                    <span class="delete-btn">
                      <i
                        class="icon aufontAll h-icon-all-delete-o"
                        @click="deleteFilterItem(operation)"
                      ></i>
                    </span>
                  </template>
                </a-table>
              </template>
              <div
                class="add-row"
                @click="addFilterCondition(false)"
                ref="addFilterConditionBtn"
              >
                <i class="icon aufontAll h-icon-all-plus-o"></i> 新增查询条件
              </div>
            </h3-panel>

            <h3-panel
              :title="'子表条件'"
              :tips="'查找符合条件的子表数据'"
              :collapsible="true"
              v-if="UpDateObjIsSheet && !isSubSchema"
            >
              <template>
                <a-table
                  :columns="filterColumns"
                  :dataSource="ruleScopeChild"
                  :pagination="false"
                  size="small"
                >
                  <!-- 目标数据字段 -->
                  <template slot="targetField" slot-scope="text,record">
                    <div class="item-box">
                      <data-item-select
                        v-model="record.targetField.val"
                        :list="record.targetField.list"
                        @change="(val) => {
                          dataItemChange(val, record, 2);
                        }"
                        :systemFilterCtl="{
                          code: ['workflowInstanceId', 'sequenceNo', 'sequenceNo', 'name', 'ownerDeptQueryCode', 'sortKey']
                        }"
                        :bizFilterCtl="{
                          type: [10, 8, 6, 7],
                        }"
                        :disabled="!targetModel"
                        :getPopupContainer="getPopupContainer"
                      />
                    </div>
                  </template>

                  <!-- 操作符 -->
                  <span class="hide-thead" slot="operatorTitle">操作符</span>
                  <template slot="operator" slot-scope="text,record">
                    <div class="item-box">
                      <a-select
                        style="width: 100px"
                        v-model="record.operator.val"
                        @change="operatorChange(record)"
                        placeholder="请选择"
                        :class="!record.operator.val ? 'show-placeholder':''"
                        :getPopupContainer="getPopupContainer"
                      >
                        <a-select-option
                          v-for="(item, index) in record.operator.list"
                          :value="item.index"
                          :key="index"
                          :disabled="item.disabled"
                          :index="record.operator.index"
                          data-type="filter"
                        >{{ item.name }}</a-select-option>
                      </a-select>
                    </div>
                  </template>

                  <!-- 值 -->
                  <template slot="value" slot-scope="text, record">
                    <div class="item-box">
                      <a-select
                        style="width: 100px"
                        v-model="record.value.val"
                        @change="valueSelectChange(record)"
                        placeholder="请选择"
                        :class="!record.value.val ? 'show-placeholder':''"
                        :getPopupContainer="getPopupContainer"
                      >
                        <a-select-option
                          v-for="(item, index) in record.value.list"
                          :value="item.index"
                          :key="index"
                          :index="record.value.index"
                          :disabled="item.disabled"
                          data-type="filter"
                        >{{ item.name }}</a-select-option>
                      </a-select>
                    </div>
                  </template>

                  <!-- 当前模型字段 -->
                  <template slot="currentField" slot-scope="text,record">
                    <!-- 动态值 -->
                    <div class="item-box">
                      <data-item-select
                        v-model="record.currentField.val"
                        :list="record.currentField.list"
                        v-show="record.value.val === 1"
                        :systemFilterCtl="{
                          code: ['workflowInstanceId', 'sequenceNo', 'sequenceNo', 'name', 'ownerDeptQueryCode', 'sortKey']
                        }"
                        :bizFilterCtl="{
                          type: [10, 8, 6, 7],
                        }"
                        :disabled="record.targetField.val === ''"
                        :getPopupContainer="getPopupContainer"
                      />
                      <!-- 固定值 -->
                      <a-input
                        style="width: 240px"
                        v-model="record.currentField.val"
                        v-show="record.value.val === 2 && !getLogicType(record.targetField)"
                        :disabled="record.targetField.val === ''"
                        :placeholder="getDateType(record.targetField) ? '日期格式2019-05-10 12:00:00' : '请输入'"
                      ></a-input>
                      <!-- 为空 -->
                      <div
                        style="width: 240px"
                        v-show="record.value.val === 3 || record.value.val === ''"
                      ></div>

                      <!-- 逻辑时下拉 -->
                      <div
                        style="width: 240px"
                        v-show="record.value.val === 2 && getLogicType(record.targetField)"
                      >
                        <a-select
                          :disabled="record.targetField.val ===''"
                          v-model="record.currentField.val"
                          style="width: 240px"
                          :getPopupContainer="getPopupContainer"
                        >
                          <a-select-option value="true">true</a-select-option>
                          <a-select-option value="false">false</a-select-option>
                        </a-select>
                      </div>
                    </div>
                  </template>

                  <!-- 操作 -->
                  <template slot="operation" slot-scope="operation">
                    <span class="delete-btn">
                      <i
                        class="icon aufontAll h-icon-all-delete-o"
                        @click="deleteRuleScopeChild(operation)"
                      ></i>
                    </span>
                  </template>
                </a-table>
              </template>
              <div
                class="add-row"
                @click="addSheetCondition"
                ref="addFilterConditionBtn"
              >
                <i class="icon aufontAll h-icon-all-plus-o"></i> 新增查询条件
              </div>
            </h3-panel>
          </div>
        </div>

        <!-- 新增数据动作 -->
        <div class="filter-conditions" v-show="triggerAction !== 3">
          <div class="filter-conditions-top">
            <div class="filter-conditions-top-left">
              <span>{{ dataActionText }}</span>
              <span></span>
            </div>
            <div class="filter-conditions-top-right"></div>
          </div>
          <div class="table-box tabel-color">
            <h3-panel
              :title="'查找主表'"
              :tips="'新增子表数据需关联主表数据，请设置条件查询需关联在主表数据；若查出多条，每条数据下都新增子表数据'"
              :collapsible="true"
              v-if="UpDateObjIsSheet && isShowActionSysDataItems && !isSubSchema"
            >
              <div class="filter-select-wrap">
                <a-select
                  class="filter-select"
                  style="width: 310px"
                  v-model="insertConditionJoinType"
                  :getPopupContainer="getPopupContainer"
                >
                  <a-select-option
                    v-for="(item, index) in conditionJoinTypes"
                    :value="item.index"
                    :key="index"
                  >{{ item.name }}</a-select-option>
                </a-select>
              </div>
              <!-- :columns="dataActionColumns"
                  :dataSource="ruleActionMainScope"
                  :pagination="false"
              size="small"-->
              <template>
                <a-table
                  :columns="dataActionColumns"
                  :dataSource="ruleActionMainScope"
                  :pagination="false"
                  size="small"
                >
                  <!-- 目标数据字段 -->
                  <template slot="targetField" slot-scope="text,record">
                    <div class="item-box">
                      <data-item-select
                        v-model="record.targetField.val"
                        :list="record.targetField.list"
                        @change="(val) => {
                          dataItemChange(val, record, 3);
                        }"
                        :systemFilterCtl="{
                          code: ['workflowInstanceId', 'sequenceNo', 'sequenceNo', 'name', 'ownerDeptQueryCode', 'sortKey']
                        }"
                        :bizFilterCtl="{
                          type: [10, 8, 6, 7],
                        }"
                        :disabled="!targetModel"
                        :getPopupContainer="getPopupContainer"
                      />
                    </div>
                  </template>

                  <!-- 操作符 -->
                  <span class="hide-thead" slot="operatorTitle">操作符</span>
                  <template slot="operator" slot-scope="text,record">
                    <div class="item-box">
                      <a-select
                        style="width: 100px"
                        v-model="record.operator.val"
                        @change="operatorChange(record)"
                        placeholder="请选择"
                        :class="!record.operator.val ? 'show-placeholder':''"
                        :getPopupContainer="getPopupContainer"
                      >
                        <a-select-option
                          v-for="(item, index) in record.operator.list"
                          :value="item.index"
                          :key="index"
                          :disabled="item.disabled"
                          :index="record.operator.index"
                          data-type="filter"
                        >{{ item.name }}</a-select-option>
                      </a-select>
                    </div>
                  </template>

                  <!-- 值 -->
                  <template slot="value" slot-scope="text, record">
                    <div class="item-box">
                      <a-select
                        style="width: 100px"
                        v-model="record.value.val"
                        @change="valueSelectChange(record)"
                        placeholder="请选择"
                        :class="!record.value.val ? 'show-placeholder':''"
                        :getPopupContainer="getPopupContainer"
                      >
                        <a-select-option
                          v-for="(item, index) in record.value.list"
                          :value="item.index"
                          :key="index"
                          :index="record.value.index"
                          :disabled="item.disabled"
                          data-type="filter"
                        >{{ item.name }}</a-select-option>
                      </a-select>
                    </div>
                  </template>

                  <!-- 当前模型字段 -->
                  <template slot="currentField" slot-scope="text,record">
                    <!-- 动态值 -->
                    <div class="item-box">
                      <data-item-select
                        v-model="record.currentField.val"
                        v-show="record.value.val === 1"
                        :list="record.currentField.list"
                        :systemFilterCtl="{
                          code: ['workflowInstanceId', 'sequenceNo', 'sequenceNo', 'name', 'ownerDeptQueryCode', 'sortKey']
                        }"
                        :bizFilterCtl="{
                          type: [10, 8, 6, 7],
                        }"
                        :disabled="record.targetField.val===''"
                        :getPopupContainer="getPopupContainer"
                      />

                      <!-- 固定值 -->
                      <a-input
                        style="width: 240px"
                        v-model="record.currentField.val"
                        v-show="record.value.val === 2 && !getLogicType(record.targetField)"
                        :placeholder="getDateType(record.targetField) ? '日期格式2019-05-10 12:00:00' : '请输入'"
                        :disabled="record.targetField.val===''"
                      ></a-input>
                      <!-- 为空 -->
                      <div
                        style="width: 240px"
                        v-show="record.value.val === 3 || record.value.val === ''"
                      ></div>

                      <!-- 逻辑时下拉 -->
                      <div
                        style="width: 240px"
                        v-show="record.value.val === 2 && getLogicType(record.targetField)"
                      >
                        <a-select
                          :disabled="record.targetField.val===''"
                          v-model="record.currentField.val"
                          style="width: 240px"
                          :getPopupContainer="getPopupContainer"
                        >
                          <a-select-option value="true">true</a-select-option>
                          <a-select-option value="false">false</a-select-option>
                        </a-select>
                      </div>
                    </div>
                  </template>

                  <!-- 操作 -->
                  <template slot="operation" slot-scope="operation">
                    <span class="delete-btn">
                      <i
                        class="icon aufontAll h-icon-all-delete-o"
                        @click="deleteRuleActionMainScope(operation)"
                      ></i>
                    </span>
                  </template>
                </a-table>
              </template>

              <div
                class="add-row"
                ref="addDataActionBtn"
                @click="addSheetDataAction"
              >
                <i class="icon aufontAll h-icon-all-plus-o"></i> 新增字段
              </div>
            </h3-panel>

            <h3-panel :title=" UpDateObjIsSheet?'子表动作' : '主表动作'" :collapsible="true">
              <template>
                <a-table
                  :columns="dataActionColumns"
                  :dataSource="dataActionData"
                  :pagination="false"
                  size="small"
                >
                  <!-- 目标数据字段 -->
                  <template slot="targetField" slot-scope="text,record">
                    <div class="item-box">
                      <data-item-select
                        v-model="record.targetField.val"
                        :list="record.targetField.list"
                        :fliterSystem="triggerAction === 2"
                        :systemFilterCtl="{
                          code: ['modifier','sortKey']
                        }"
                        :bizFilterCtl="{
                          type: [8, 6, 7],
                        }"
                        @change="(val) => {
                          dataItemChange(val, record, 4);
                        }"
                        :getPopupContainer="getPopupContainer"
                      />
                    </div>
                  </template>

                  <!-- 操作符 -->
                  <span class="hide-thead" slot="operatorTitle">操作符</span>
                  <template slot="operator" slot-scope="text, record">
                    <div class="item-box">
                      <a-select
                        style="width: 100px"
                        v-model="record.operator.val"
                        v-show="triggerAction !== 1"
                        @change="onOperatorChange"
                        placeholder="请选择"
                        :class="!record.operator.val ? 'show-placeholder':''"
                        :getPopupContainer="getPopupContainer"
                      >
                        <a-select-option
                          v-for="(item, index) in record.operator.list"
                          :value="item.index"
                          :key="index"
                          :index="record.operator.index"
                          :disabled="item.disabled"
                          data-type="action"
                        >{{ item.name }}</a-select-option>
                      </a-select>
                      <div
                        style="width: 100px; text-align: center; line-height: 32px"
                        v-show="triggerAction === 1"
                      >设置为</div>
                    </div>
                  </template>

                  <!-- 值 -->
                  <template slot="value" slot-scope="text, record">
                    <div class="item-box">
                      <a-select
                        style="width: 100px"
                        v-model="record.value.val"
                        @change="valueSelectChange(record)"
                        placeholder="请选择"
                        :class="!record.value.val ? 'show-placeholder':''"
                        :getPopupContainer="getPopupContainer"
                      >
                        <a-select-option
                          v-for="(item, index) in record.value.list"
                          :value="item.index"
                          :key="index"
                          :index="record.value.index"
                          :disabled="item.disabled"
                          data-type="action"
                        >{{ item.name }}</a-select-option>
                      </a-select>
                    </div>
                  </template>

                  <!-- 当前模型字段 -->
                  <template slot="currentField" slot-scope="text,record">
                    <!-- 动态值 -->
                    <div class="item-box">
                      <data-item-select
                        v-model="record.currentField.val"
                        :list="record.currentField.list"
                        v-show="record.value.val === 1"
                        :systemFilterCtl="{
                          code: ['ownerDeptQueryCode', 'workflowInstanceId', 'modifier','sortKey']
                        }"
                        :bizFilterCtl="{
                          type: [8, 6, 7],
                        }"
                        :disabled="record.targetField.val ===''"
                        :getPopupContainer="getPopupContainer"
                      />

                      <!-- 固定值 -->
                      <a-input
                        style="width: 240px"
                        v-model="record.currentField.val"
                        v-show="record.value.val === 2 && !getLogicType(record.targetField)"
                        :placeholder="getDateType(record.targetField) ? '日期格式2019-05-10 12:00:00' : '请输入'"
                        :disabled="record.targetField.val ===''"
                      ></a-input>
                      <!-- 为空 -->
                      <div
                        style="width: 240px"
                        v-show="record.value.val === 3 || record.value.val === ''"
                      ></div>

                      <!-- 逻辑时下拉 -->
                      <div
                        style="width: 240px"
                        v-show="record.value.val === 2 && getLogicType(record.targetField)"
                      >
                        <a-select
                          :disabled="record.targetField.val ===''"
                          v-model="record.currentField.val"
                          style="width: 240px"
                          :getPopupContainer="getPopupContainer"
                        >
                          <a-select-option value="true">true</a-select-option>
                          <a-select-option value="false">false</a-select-option>
                        </a-select>
                      </div>
                    </div>
                  </template>

                  <!-- 操作 -->
                  <template slot="operation" slot-scope="operation">
                    <span class="delete-btn">
                      <i
                        class="icon aufontAll h-icon-all-delete-o"
                        @click="deleteActionItem(operation)"
                      ></i>
                    </span>
                  </template>
                </a-table>
              </template>
              <div
                class="add-row"
                ref="addDataActionBtn"
                @click="addDataAction(false)"
              >
                <i class="icon aufontAll h-icon-all-plus-o"></i> 新增字段
              </div>
            </h3-panel>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <a-button
        v-if="curStep === 0"
        type="primary"
        :disabled="isNextAble"
        @click="goNextStep"
      >下一步：设置执行动作</a-button>

      <div v-else>
        <a-button type="default" @click="goPrevStep">上一步：设置触发动作</a-button>
        <a-button type="primary" @click="submit">完成</a-button>
      </div>
    </div>

    <a-alert
      v-if="isShowAlert"
      class="warn-alert"
      message="请先完善当前数据条件"
      banner
      @close="onClose"
      closable
    />
  </div>
</template>
<script lang='ts' src="./data-rule.ts"></script>
<style lang='less'>
@import "./style/index.less";
</style>
