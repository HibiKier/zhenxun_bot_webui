<template>
  <div>
    <el-form :model="formObj" :rules="rules" ref="form">
      <el-form-item prop="myValue">
        <el-input
          v-if="checkIf(inputType)"
          v-model="formObj.myValue"
          @input="input"
        ></el-input>
        <MySwitch
          v-if="checkIf(boolType)"
          v-model="formObj.myValue"
          @input="input"
        />
        <template v-if="checkIf(tupleType)"></template>
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
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import MySwitch from "@/components/ui/MySwitch"
import { checkConfig } from "@/utils/check"

export default {
  name: "AutoComponent",
  props: ["value", "type", "typeInner"],
  components: {
    MySwitch,
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
  mounted() {
    console.log("tttt", this.value, this.type, this.typeInner)

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
  },
}
</script>

<style lang="scss" scoped></style>
