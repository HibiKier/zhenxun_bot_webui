<template>
  <el-dialog
    class="dialog-class"
    :width="dialogWidth"
    :visible.sync="visible"
    @close="close"
  >
    <OneMark />
    <div class="main">
      <div>
        <p class="plugin-name-class">
          {{ updateData.plugin_name
          }}<span class="version-class">v{{ updateData.version }}</span>
        </p>
        <p style="color: #b8bac0">
          {{ updateData.module
          }}<span class="author-class" v-if="updateData.author"
            >@{{ updateData.author }}</span
          >
        </p>
      </div>
      <div class="update-info">
        <div class="base-setting">
          <p class="base-title">基础配置</p>
          <el-form :model="updateData" :rules="rules" ref="form">
            <el-row>
              <el-col :span="12" prop="default_status">
                <el-form-item>
                  <div>
                    <span slot="label">默认开关</span>
                    <MySwitch v-model="updateData.default_status" />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="limit_superuser">
                  <div>
                    <span slot="label">限制超级用户</span>
                    <MySwitch v-model="updateData.limit_superuser" />
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="cost_gold">
                  <div>
                    <span slot="label">花费金币</span>
                    <el-input
                      v-model="updateData.cost_gold"
                      placeholder="花费金币"
                    ></el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="menu_type">
                  <div>
                    <span slot="label">菜单类型</span>
                    <el-select
                      v-model="updateData.menu_type"
                      placeholder="菜单类型"
                    >
                      <el-option
                        v-for="data in menuTypeList"
                        :label="data"
                        :value="data"
                        :key="data"
                      ></el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="level">
                  <div>
                    <span slot="label">群权限</span>
                    <el-select
                      v-model="updateData.level"
                      placeholder="禁用类型"
                      clearable
                    >
                      <el-option
                        v-for="n in 10"
                        :label="n"
                        :value="n"
                        :key="n"
                      ></el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="block_type">
                  <div>
                    <span slot="label">禁用类型</span>
                    <el-select
                      v-model="updateData.block_type"
                      placeholder="禁用类型"
                      clearable
                    >
                      <el-option label="全部" value="all"></el-option>
                      <el-option label="群聊" value="group"></el-option>
                      <el-option label="私聊" value="private"></el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div
          class="config-setting"
          v-if="updateData.config_list && updateData.config_list.length"
        >
          <p class="base-title" style="margin-left: 0">配置项</p>
          <div class="config-table">
            <el-table :data="updateData.config_list" border height="268">
              <el-table-column
                label="键"
                prop="key"
                min-width="100px"
              ></el-table-column>
              <el-table-column
                label="帮助"
                prop="help"
                min-width="200px"
              ></el-table-column>
              <el-table-column label="默认值" prop="default_value">
                <template slot-scope="{ row }">
                  {{
                    row.default_value + "" != "null"
                      ? row.default_value + ""
                      : ""
                  }}
                </template>
              </el-table-column>
              <el-table-column label="值" min-width="140px">
                <template slot-scope="scope">
                  <AutoComponent
                    :ref="'autoComponent_' + scope.$index"
                    v-model="scope.row.value"
                    :type="scope.row.type"
                    :typeInner="scope.row.type_inner"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <el-divider />
    <div class="footer">
      <MyButton text="取消" @click="close" :width="120" />
      <MyButton
        text="确定"
        style="margin-left: 50px"
        :width="120"
        @click="commit"
      />
    </div>
  </el-dialog>
</template>

<script>
import MySwitch from "@/components/ui/MySwitch"
import MyButton from "@/components/ui/MyButton"
import OneMark from "@/components/ui/OneMark"
import AutoComponent from "./AutoComponent.vue"
import { checkConfig } from "@/utils/check"

export default {
  name: "UpdateDialog",
  props: {
    module: String,
  },
  components: {
    MySwitch,
    MyButton,
    AutoComponent,
    OneMark,
  },
  data() {
    var checkCostGold = (rule, value, callback) => {
      console.log("value", value)

      if (!("1" + value)) {
        return callback(new Error("请输入花费金币"))
      }
      if (!checkConfig(value, "int")) {
        return callback(new Error("输入值必须为数字"))
      }
      callback()
    }
    return {
      dialogWidth: "1300px",
      visible: false,
      menuTypeList: [],
      updateData: {
        plugin_name: "",
        version: 0,
        module: "",
        author: "",
        default_status: false,
        limit_superuser: false,
        cost_gold: 0,
        cmd: 0,
        menu_type: "normal",
        level: 0,
        block_type: null,
        config_list: [],
      },
      rules: {
        cost_gold: [{ validator: checkCostGold, trigger: "blur" }],
      },
    }
  },
  mounted() {
    this.getPluginDetail()
    this.getPluginMenuType()
  },
  methods: {
    close() {
      this.$emit("close")
    },
    getPluginDetail() {
      const loading = this.getLoading(".el-dialog")
      this.getRequest(`${this.$root.prefix}/plugin/get_plugin`, {
        module: this.module,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.updateData = resp.data
            if (!resp.data.config_list || !resp.data.config_list.length) {
              this.dialogWidth = "700px"
            }
            this.visible = true
          }
        } else {
          this.$message.error(resp.info)
          this.$emit("close")
        }
        loading.close()
      })
    },
    getPluginMenuType() {
      this.getRequest(`${this.$root.prefix}/plugin/get_plugin_menu_type`).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.menuTypeList = resp.data
            }
          } else {
            this.$message.error(resp.info)
          }
        }
      )
    },
    commit() {
      if (this.updateData.config_list && this.updateData.config_list) {
        for (let i = 0; i < this.updateData.config_list.length; i++) {
          const ref = this.$refs["autoComponent_" + i]
          if (ref) {
            const flag = ref.validate()
            if (!flag) {
              return this.$message.warning("配置项填写错误...")
            }
          }
        }
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.updateData))
          if (data.config_list && data.config_list.length) {
            const configs = {}
            data.config_list.forEach((e) => {
              configs[e.key] = e.value
            })
            data.configs = configs
            data.config_list = null
          }

          data.block_type = data.block_type || null
          const loading = this.getLoading(".el-dialog")

          this.postRequest(
            `${this.$root.prefix}/plugin/update_plugin`,
            data
          ).then((resp) => {
            if (resp.suc) {
              if (resp.warning) {
                this.$message.warning(resp.warning)
              } else {
                this.$message.success(resp.info)
                this.$emit("close", true)
              }
            } else {
              this.$message.error(resp.info)
            }
            loading.close()
          })
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog-class {
  padding: 30px 50px;

  ::v-deep .el-dialog {
    border-radius: 10px;
  }

  .tip {
    color: #acafb8;
    font-size: 12px;
    text-align: center;
  }

  .main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .base-title {
      color: #939395;
      margin-bottom: 5px;
      font-size: 18px;
      margin-left: 25px;
    }

    .plugin-name-class {
      font-size: 20px;
      font-weight: bold;
    }

    .version-class {
      font-size: 16px;
      font-weight: 400;
      margin-left: 17px;
      color: #939395;
    }

    .author-class {
      margin-left: 10px;
    }

    .update-info {
      margin-top: 30px;
      display: flex;
      width: 100%;

      .base-setting {
        span {
          color: #758ea1;
          font-size: 14px;
        }

        ::v-deep .el-input__inner {
          width: 230px;
        }

        ::v-deep .el-select {
          width: 100%;

          .el-input {
            width: 230px;
          }
        }
      }

      .config-setting {
        .config-table {
          margin-left: 26px;
          margin-top: 17px;
        }
      }

      ::v-deep .el-col {
        padding-left: 50px;
      }
    }
  }

  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
