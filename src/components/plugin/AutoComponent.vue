<template>
  <div>
    <el-form :model="formObj" :rules="rules" ref="form">
      <el-form-item prop="myValue">
        <MySwitch
          v-if="checkIf(boolType)"
          v-model="formObj.myValue"
          @input="input"
        />
        <template v-else-if="checkIf(tupleType)">
          <div v-for="(iType, index) in typeInner" :key="index">
            <el-input
              v-if="checkIf(inputType, iType)"
              ref="tp"
              v-model="formObj.myValue[index]"
              @input="input"
            ></el-input>
            <MySwitch
              v-if="checkIf(boolType, iType)"
              ref="tp"
              v-model="formObj.myValue[index]"
              @input="input"
            />
          </div>
        </template>
        <template v-else-if="checkIf(listType)">
          <div v-for="(v, index) in formObj.myValue" :key="index">
            <el-input
              v-if="checkIf(inputType, typeInner[0])"
              ref="tp"
              v-model="formObj.myValue[index]"
              @input="input"
            ></el-input>
            <MySwitch
              v-if="checkIf(boolType, typeInner[0])"
              ref="tp"
              v-model="formObj.myValue[index]"
              @input="input"
            />
          </div>
          <div class="btn-class">
            <MyButton @click="addInput" :width="59" icon="add" />
            <MyButton @click="deleteInput" :width="59" icon="reduce" />
          </div>
        </template>
        <template v-else>
          <el-input v-model="formObj.myValue" @input="input"></el-input>
        </template>
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
    // const zType = {
    //   int: "数字",
    //   float: "小数",
    //   bool: "布尔",
    // }
    const type2str = {
      int: "输入内容必须为数字",
      float: "输入内容必须为小数",
      tuple: "输入类型错误",
      list: "输入类型错误",
    }
    var checkRule = (rule, value, callback) => {
      console.log("value", value)

      if (!checkConfig(value, this.type, this.typeInner)) {
        return callback(new Error(type2str[this.type]))
      }
      callback()
    }
    return {
      inputType: ["int", "str", "float"],
      boolType: ["bool"],
      listType: ["list"],
      tupleType: ["tuple"],

      formObj: {
        myValue: null,
      },

      rules: {
        myValue: [{ validator: checkRule, trigger: "blur" }],
      },
    }
  },
  created() {
    this.formObj.myValue = this.value
  },
  methods: {
    checkIf(other_list, type) {
      if (type) {
        return other_list.includes(type)
      }
      return other_list.includes(this.type)
    },
    input() {
      if (this.type == "Tuple") {
        console.log("this.ddd", this.formObj.myValue)
      }
      this.$emit("input", this.formObj.myValue)
    },
    commit() {
      console.log("ref", this.$refs["tp"])
    },
    validate() {
      let flag = false
      this.$refs["form"].validate((valid) => {
        flag = valid
      })
      return flag
    },
    addInput() {
      this.formObj.myValue.push("")
    },
    deleteInput() {
      this.formObj.myValue.pop()
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-class {
  display: flex;
  margin-top: 10px;
}
</style>
