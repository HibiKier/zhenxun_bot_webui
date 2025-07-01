<template>
  <div class="auto-component">
    <el-form :model="formObj" :rules="rules" ref="form">
      <el-form-item prop="myValue">
        <!-- 布尔类型 -->
        <div v-if="checkIf(boolType)" class="bool-input">
          <MySwitch
            v-model="formObj.myValue"
            @input="input"
            class="switch-control"
          />
          <span class="type-badge bool">布尔</span>
        </div>

        <!-- 元组类型 -->
        <div v-else-if="checkIf(tupleType)" class="tuple-input">
          <span class="type-badge tuple">元组</span>
          <div class="tuple-items">
            <div
              v-for="(iType, index) in typeInner"
              :key="index"
              class="tuple-item"
            >
              <div class="item-index">{{ index + 1 }}</div>
              <div class="item-control">
                <!-- 字符串类型的元组项 -->
                <el-input
                  v-if="iType === 'str'"
                  ref="tp"
                  v-model="formObj.myValue[index]"
                  @input="input"
                  :placeholder="getTypePlaceholder(iType)"
                  class="tuple-input-control"
                ></el-input>

                <!-- 整数类型的元组项 -->
                <el-input
                  v-else-if="iType === 'int'"
                  ref="tp"
                  v-model="formObj.myValue[index]"
                  @input="input"
                  type="number"
                  :placeholder="getTypePlaceholder(iType)"
                  class="tuple-input-control"
                  @change="validateItemValue(index, iType)"
                ></el-input>

                <!-- 浮点数类型的元组项 -->
                <el-input
                  v-else-if="iType === 'float'"
                  ref="tp"
                  v-model="formObj.myValue[index]"
                  @input="input"
                  type="number"
                  step="0.01"
                  :placeholder="getTypePlaceholder(iType)"
                  class="tuple-input-control"
                  @change="validateItemValue(index, iType)"
                ></el-input>

                <!-- 布尔类型的元组项 -->
                <MySwitch
                  v-else-if="iType === 'bool'"
                  ref="tp"
                  v-model="formObj.myValue[index]"
                  @input="input"
                  class="tuple-switch-control"
                />

                <!-- 其他类型的元组项 -->
                <el-input
                  v-else
                  ref="tp"
                  v-model="formObj.myValue[index]"
                  @input="input"
                  :placeholder="getTypePlaceholder(iType)"
                  class="tuple-input-control"
                ></el-input>

                <div class="item-type">{{ getTypeLabel(iType) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 列表类型 -->
        <div v-else-if="checkIf(listType)" class="list-input">
          <div class="list-header">
            <span class="type-badge list">列表</span>
            <span class="list-type">{{ getTypeLabel(getInnerType) }}</span>
            <div class="list-actions">
              <MyButton
                @click="addInput"
                icon="add"
                type="primary"
                class="list-action-btn"
                title="添加项"
              />
            </div>
          </div>

          <div
            class="list-items"
            v-if="formObj.myValue && formObj.myValue.length > 0"
          >
            <div
              v-for="(v, index) in formObj.myValue"
              :key="index"
              class="list-item"
              :class="{ error: itemErrors[index] }"
            >
              <div class="item-index">{{ index + 1 }}</div>
              <div class="item-control">
                <!-- 字符串类型的列表项 -->
                <el-input
                  v-if="getInnerType === 'str'"
                  ref="tp"
                  v-model="formObj.myValue[index]"
                  @input="(val) => handleItemInput(val, index)"
                  :placeholder="getTypePlaceholder(getInnerType)"
                ></el-input>

                <!-- 整数类型的列表项 -->
                <el-input
                  v-else-if="getInnerType === 'int'"
                  ref="tp"
                  v-model="formObj.myValue[index]"
                  @input="(val) => handleItemInput(val, index)"
                  type="number"
                  :placeholder="getTypePlaceholder(getInnerType)"
                  @change="validateItemValue(index, getInnerType)"
                ></el-input>

                <!-- 浮点数类型的列表项 -->
                <el-input
                  v-else-if="getInnerType === 'float'"
                  ref="tp"
                  v-model="formObj.myValue[index]"
                  @input="(val) => handleItemInput(val, index)"
                  type="number"
                  step="0.01"
                  :placeholder="getTypePlaceholder(getInnerType)"
                  @change="validateItemValue(index, getInnerType)"
                ></el-input>

                <!-- 布尔类型的列表项 -->
                <MySwitch
                  v-else-if="getInnerType === 'bool'"
                  ref="tp"
                  v-model="formObj.myValue[index]"
                  @input="(val) => handleItemInput(val, index)"
                />

                <!-- 其他类型的列表项 -->
                <el-input
                  v-else
                  ref="tp"
                  v-model="formObj.myValue[index]"
                  @input="(val) => handleItemInput(val, index)"
                  :placeholder="getTypePlaceholder(getInnerType)"
                ></el-input>

                <div class="item-error" v-if="itemErrors[index]">
                  {{ itemErrors[index] }}
                </div>
              </div>
              <div class="item-delete">
                <i
                  class="el-icon-close"
                  @click="removeItemAt(index)"
                  title="删除此项"
                ></i>
              </div>
            </div>
          </div>

          <div v-else class="list-empty">
            <i class="el-icon-info"></i>
            <span>列表为空，请点击上方"+"按钮添加项</span>
          </div>
        </div>

        <!-- 基本类型（字符串/数字） -->
        <div v-else class="basic-input">
          <!-- 字符串类型 -->
          <el-input
            v-if="type === 'str'"
            v-model="formObj.myValue"
            @input="input"
            :placeholder="getTypePlaceholder(type)"
          ></el-input>

          <!-- 整数类型 -->
          <el-input
            v-else-if="type === 'int'"
            v-model="formObj.myValue"
            @input="input"
            type="number"
            :placeholder="getTypePlaceholder(type)"
          ></el-input>

          <!-- 浮点数类型 -->
          <el-input
            v-else-if="type === 'float'"
            v-model="formObj.myValue"
            @input="input"
            type="number"
            step="0.01"
            :placeholder="getTypePlaceholder(type)"
          ></el-input>

          <!-- 其他类型 -->
          <el-input
            v-else
            v-model="formObj.myValue"
            @input="input"
            :placeholder="getTypePlaceholder(type)"
          ></el-input>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import MySwitch from "@/components/ui/MySwitch"
import MyButton from "@/components/ui/MyButton"
import { checkConfig } from "@/utils/check"

export default {
  name: "AutoComponent",
  props: ["value", "type", "typeInner"],
  components: {
    MySwitch,
    MyButton,
  },
  data() {
    const type2str = {
      int: "输入内容必须为整数",
      float: "输入内容必须为数字",
      tuple: "输入类型错误",
      list: "输入类型错误",
      str: "输入内容必须为字符串",
    }

    const typePlaceholders = {
      int: "请输入整数",
      float: "请输入数字",
      str: "请输入文本",
      bool: "开关状态",
    }

    const typeLabels = {
      int: "整数",
      float: "小数",
      str: "文本",
      bool: "布尔",
      list: "列表",
      tuple: "元组",
    }

    var checkRule = (rule, value, callback) => {
      if (!checkConfig(value, this.type, this.typeInner)) {
        return callback(new Error(type2str[this.type] || "输入类型错误"))
      }
      callback()
    }

    return {
      inputType: ["int", "str", "float"],
      boolType: ["bool"],
      listType: ["list"],
      tupleType: ["tuple"],
      typePlaceholders,
      typeLabels,
      type2str,
      itemErrors: {}, // 存储每个列表项的错误信息

      formObj: {
        myValue: null,
      },

      rules: {
        myValue: [{ validator: checkRule, trigger: "blur" }],
      },
    }
  },
  computed: {
    // 获取列表的内部类型
    getInnerType() {
      if (this.typeInner && this.typeInner.length > 0) {
        return this.typeInner[0]
      }
      return "str" // 默认为字符串类型
    },
  },
  created() {
    this.initializeValue()
    console.log("this.formObj.myValue", this.value, this.type, this.typeInner)
  },
  methods: {
    // 初始化值
    initializeValue() {
      this.formObj.myValue = this.value

      // 确保列表类型初始化为数组
      if (this.checkIf(this.listType)) {
        if (!Array.isArray(this.formObj.myValue)) {
          this.formObj.myValue = this.formObj.myValue
            ? [this.formObj.myValue]
            : []
        }

        // 特别处理：确保list[str]类型始终有一个数组实例
        if (this.getInnerType === "str" && !this.formObj.myValue) {
          this.formObj.myValue = []
        }
      }

      // 确保元组类型初始化为数组
      if (this.checkIf(this.tupleType)) {
        if (!Array.isArray(this.formObj.myValue)) {
          this.formObj.myValue = this.formObj.myValue
            ? [this.formObj.myValue]
            : []
        }

        // 确保元组长度与类型定义一致
        if (
          this.typeInner &&
          this.typeInner.length > this.formObj.myValue.length
        ) {
          const diff = this.typeInner.length - this.formObj.myValue.length
          for (let i = 0; i < diff; i++) {
            // 只为字符串类型提供默认值，其他类型保持null
            const innerType = this.typeInner[this.formObj.myValue.length]
            this.formObj.myValue.push(innerType === "str" ? "" : null)
          }
        }
      }
    },
    checkIf(other_list, type) {
      if (type) {
        return other_list.includes(type)
      }
      return other_list.includes(this.type)
    },
    input() {
      this.$emit("input", this.formObj.myValue)
    },
    validate() {
      // 先验证每个列表项
      if (this.checkIf(this.listType) && Array.isArray(this.formObj.myValue)) {
        let isValid = true
        this.formObj.myValue.forEach((item, index) => {
          if (!this.validateItemValue(index, this.getInnerType)) {
            isValid = false
          }
        })

        if (!isValid) {
          return false
        }
      }

      // 再验证整体表单
      let flag = false
      this.$refs["form"].validate((valid) => {
        flag = valid
      })
      return flag
    },
    addInput() {
      if (!Array.isArray(this.formObj.myValue)) {
        this.formObj.myValue = []
      }

      // 只为字符串类型提供默认值，其他类型保持null
      const innerType = this.getInnerType
      this.formObj.myValue.push(innerType === "str" ? "" : null)

      this.input()
    },
    deleteInput() {
      if (
        Array.isArray(this.formObj.myValue) &&
        this.formObj.myValue.length > 0
      ) {
        this.formObj.myValue.pop()

        // 清除对应的错误信息
        if (this.itemErrors[this.formObj.myValue.length]) {
          this.$delete(this.itemErrors, this.formObj.myValue.length)
        }

        this.input()
      }
    },
    removeItemAt(index) {
      if (
        Array.isArray(this.formObj.myValue) &&
        index >= 0 &&
        index < this.formObj.myValue.length
      ) {
        this.formObj.myValue.splice(index, 1)

        // 重新整理错误信息
        const newErrors = {}
        Object.keys(this.itemErrors).forEach((key) => {
          const keyIndex = parseInt(key)
          if (keyIndex < index) {
            newErrors[keyIndex] = this.itemErrors[keyIndex]
          } else if (keyIndex > index) {
            newErrors[keyIndex - 1] = this.itemErrors[keyIndex]
          }
        })
        this.itemErrors = newErrors

        this.input()
      }
    },
    getTypePlaceholder(type) {
      return this.typePlaceholders[type] || "请输入"
    },
    getTypeLabel(type) {
      return this.typeLabels[type] || type
    },
    // 根据类型获取默认值
    getDefaultValueByType(type) {
      // 只为字符串类型提供默认值，其他类型保持null
      return type === "str" ? "" : null
    },
    // 验证单个列表项的值
    validateItemValue(index, type) {
      if (!type || !this.formObj.myValue) return true

      const value = this.formObj.myValue[index]

      // 如果值为null且类型不是str，则视为有效（因为我们不为非字符串类型提供默认值）
      if (value === null && type !== "str") {
        this.$delete(this.itemErrors, index)
        return true
      }

      let isValid = true

      switch (type) {
        case "int":
          isValid = value === null || /^-?\d+$/.test(value)
          break
        case "float":
          isValid = value === null || /^-?\d+(\.\d+)?$/.test(value)
          break
        case "bool":
          isValid =
            value === null ||
            typeof value === "boolean" ||
            ["true", "false"].includes(value)
          break
        default:
          isValid = true
      }

      if (!isValid) {
        this.$set(this.itemErrors, index, this.type2str[type] || "输入类型错误")
      } else {
        this.$delete(this.itemErrors, index)
      }

      return isValid
    },
    // 处理列表项输入
    handleItemInput(val, index) {
      // 对于list[str]类型，确保空字符串也被保存
      if (this.getInnerType === "str" && val === "") {
        this.formObj.myValue[index] = ""
      }

      this.validateItemValue(index, this.getInnerType)
      this.input()
    },
  },
  watch: {
    // 监听值变化，确保类型正确
    value(newVal) {
      this.initializeValue()
    },
  },
}
</script>

<style lang="scss" scoped>
// 颜色变量
$primary: var(--el-color-primary, #409eff);
$primary-light: var(--el-color-primary-light-3, #79bbff);
$primary-lighter: var(--el-color-primary-light-7, #c6e2ff);
$success: var(--el-color-success, #67c23a);
$warning: var(--el-color-warning, #e6a23c);
$danger: var(--el-color-danger, #f56c6c);
$info: var(--el-color-info, #909399);
$border-color: var(--el-border-color-light, #e4e7ed);
$bg-color: var(--el-bg-color, #ffffff);

.auto-component {
  position: relative;

  // 类型标签样式
  .type-badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 12px;
    color: white;
    margin-left: 8px;

    &.bool {
      background-color: $success;
    }

    &.tuple {
      background-color: $warning;
    }

    &.list {
      background-color: $primary;
    }

    &.basic {
      background-color: $info;
    }
  }

  // 布尔类型
  .bool-input {
    display: flex;
    align-items: center;
  }

  // 基本类型
  .basic-input {
    display: flex;
    align-items: center;
  }

  // 元组类型
  .tuple-input {
    margin-bottom: 10px;

    .tuple-items {
      margin-top: 8px;
      border-left: 2px solid $warning;
      padding-left: 10px;
    }

    .tuple-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .item-index {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: $warning;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        margin-right: 10px;
      }

      .item-control {
        flex: 1;
        position: relative;

        .item-type {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          color: $info;
          background-color: $bg-color;
          padding: 0 4px;
        }
      }
    }
  }

  // 列表类型
  .list-input {
    .list-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .list-type {
        margin-left: 8px;
        font-size: 13px;
        color: $info;
      }

      .list-actions {
        margin-left: auto;
        display: flex;
        gap: 8px;

        .list-action-btn {
          // 样式会由组件自身提供
        }
      }
    }

    .list-items {
      border-left: 2px solid $primary;
      padding-left: 10px;
    }

    .list-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      position: relative;

      &:last-child {
        margin-bottom: 0;
      }

      &.error {
        .item-control {
          input {
            border-color: $danger;
          }
        }
      }

      .item-index {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: $primary;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        margin-right: 10px;
      }

      .item-control {
        flex: 1;
        position: relative;

        .item-error {
          position: absolute;
          left: 0;
          bottom: -18px;
          font-size: 12px;
          color: $danger;
        }
      }

      .item-delete {
        margin-left: 8px;
        cursor: pointer;
        color: $danger;
        opacity: 0.5;
        transition: all 0.3s;

        &:hover {
          opacity: 1;
        }
      }
    }

    .list-empty {
      padding: 15px;
      text-align: center;
      background-color: #f8f8f8;
      border-radius: 4px;
      color: $info;
      font-size: 14px;

      i {
        margin-right: 5px;
      }
    }
  }
}
</style>
