<template>
  <el-dialog
    :visible.sync="visible"
    @close="close"
    :class="{
      'dialog-class': true,
      'neko-dialog': true,
      'limit-width': !updateData.config_list || !updateData.config_list.length,
    }"
  >
    <div class="main">
      <!-- 添加二次元装饰元素 -->
      <div class="decoration deco-1"></div>
      <div class="decoration deco-3"></div>

      <div class="header-section">
        <div class="title-wrapper">
          <p class="plugin-name-class">
            {{ updateData.plugin_name }}
            <span class="version-class">v{{ updateData.version }}</span>
          </p>
        </div>
        <p class="module-info">
          {{ updateData.module }}
          <span class="author-class" v-if="updateData.author">
            @{{ updateData.author }}
          </span>
        </p>
      </div>

      <div class="update-info mt-8 flex flex-col md:flex-row">
        <!-- 基础配置区域 -->
        <div class="base-setting w-full">
          <div class="section-title">
            <span class="title-text">基础配置</span>
            <div class="title-decoration"></div>
          </div>
          <el-form :model="updateData" :rules="rules" ref="form">
            <el-row>
              <el-col span="24 md:span-12" prop="default_status">
                <el-form-item>
                  <div class="form-item-cute">
                    <span class="label-text">默认开关</span>
                    <MySwitch v-model="updateData.default_status" />
                    <span class="emoji">💡</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col span="24 md:span-12">
                <el-form-item prop="limit_superuser">
                  <div class="form-item-cute">
                    <span class="label-text">限制超级用户</span>
                    <MySwitch v-model="updateData.limit_superuser" />
                    <span class="emoji">👑</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <template v-if="this.$store.state.botType == 'zhenxun'">
              <el-row>
                <el-col span="24 md:span-12">
                  <el-form-item prop="cost_gold">
                    <div class="form-item-cute">
                      <span class="label-text">花费金币</span>
                      <neon-input
                        v-model="updateData.cost_gold"
                        placeholder="0"
                        class="mt-1 cute-input"
                      />
                      <span class="emoji">💰</span>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col span="24 md:span-12">
                  <el-form-item prop="menu_type">
                    <div class="form-item-cute">
                      <span class="label-text">菜单类型</span>
                      <neko-select
                        v-model="updateData.menu_type"
                        placeholder="选择类型"
                        class="mt-1 cute-select"
                        :options="menuTypeOptions"
                      />
                      <span class="emoji">📋</span>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>

            <el-row>
              <el-col
                span="24 md:span-12"
                v-if="this.$store.state.botType == 'zhenxun'"
              >
                <el-form-item prop="level">
                  <div class="form-item-cute">
                    <span class="label-text">群权限</span>
                    <neko-select
                      v-model="updateData.level"
                      placeholder="选择等级"
                      class="mt-1 cute-select"
                      :options="levelOptions"
                    />
                    <span class="emoji">🔒</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col span="24 md:span-12">
                <el-form-item prop="block_type">
                  <div class="form-item-cute">
                    <span class="label-text">禁用类型</span>
                    <neko-select
                      v-model="updateData.block_type"
                      placeholder="选择类型"
                      class="mt-1 cute-select"
                      :options="blockTypeOptions"
                      clearable
                    />
                    <span class="emoji">🚫</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <!-- 配置项区域 -->
        <div
          class="config-setting mt-8 md:mt-0 md:ml-8 w-full md:w-1/2"
          v-if="updateData.config_list && updateData.config_list.length"
        >
          <div class="section-title">
            <span class="title-text">配置项</span>
            <div class="title-decoration"></div>
          </div>
          <div class="config-table cute-scroll">
            <el-table
              :data="updateData.config_list"
              border
              class="neko-table"
              height="470"
            >
              <el-table-column
                label="键"
                prop="key"
                min-width="100px"
                header-class-name="neko-table-header"
              ></el-table-column>
              <el-table-column
                label="帮助"
                prop="help"
                min-width="200px"
                header-class-name="neko-table-header"
              ></el-table-column>
              <el-table-column
                label="默认值"
                prop="default_value"
                header-class-name="neko-table-header"
              >
                <template slot-scope="{ row }">
                  {{
                    row.default_value + "" != "null"
                      ? row.default_value + ""
                      : ""
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="值"
                min-width="140px"
                header-class-name="neko-table-header"
              >
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

    <el-divider class="neko-divider">
      <div class="divider-content">✨ 配置选项 ✨</div>
    </el-divider>

    <div class="footer flex justify-center items-center py-4">
      <CuteButton
        icon="cancel"
        @click="close"
        :rounded="true"
        color="#A0A0A0"
        text-color="#fff"
      >
        取消
      </CuteButton>

      <CuteButton
        class="confirm-btn ml-4 md:ml-12"
        @click="commit"
        type="primary"
        :rounded="true"
        icon="true"
        >确定
      </CuteButton>
    </div>
  </el-dialog>
</template>

<script>
import AutoComponent from "./AutoComponent.vue"
import NeonInput from "@/components/ui/NeonInput.vue"
import NekoSelect from "@/components/ui/NekoSelect.vue"
import MySwitch from "@/components/ui/MySwitch.vue"
import CuteButton from "@/components/ui/CuteButton.vue"
import { checkConfig } from "@/utils/check"

export default {
  name: "NekoPluginDialog",
  props: {
    module: String,
  },
  components: {
    AutoComponent,
    "neon-input": NeonInput,
    "neko-select": NekoSelect,
    MySwitch,
    CuteButton,
  },
  data() {
    var checkCostGold = (rule, value, callback) => {
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
      menuTypeOptions: [],
      levelOptions: Array.from({ length: 10 }, (_, i) => ({
        value: i + 1,
        label: `等级 ${i + 1}`,
      })),
      blockTypeOptions: [
        { value: "ALL", label: "全部" },
        { value: "GROUP", label: "群聊" },
        { value: "PRIVATE", label: "私聊" },
      ],
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
              this.menuTypeOptions = resp.data.map((item) => ({
                value: item,
                label: item,
                icon: this.getMenuTypeIcon(item),
              }))
            }
          } else {
            this.$message.error(resp.info)
          }
        }
      )
    },
    getMenuTypeIcon(type) {
      const icons = {
        normal: "menu-normal",
        group: "menu-group",
        private: "menu-private",
        admin: "menu-admin",
      }
      return icons[type] || "menu-default"
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
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes sparkle {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}

.main {
  max-height: 50vh;
  overflow: auto;
}

.limit-width {
  /deep/ .el-dialog {
    width: 500px !important;
  }
}

.neko-dialog {
  ::v-deep .el-dialog {
    border-radius: 20px;
    background: linear-gradient(
      145deg,
      rgba(255, 240, 250, 0.98) 0%,
      rgba(240, 240, 255, 0.98) 100%
    );
    backdrop-filter: blur(12px);
    box-shadow: 0 10px 30px rgba(255, 150, 200, 0.3);
    border: 2px solid rgba(255, 220, 240, 0.8);
    overflow: hidden;
    position: relative;
  }

  ::v-deep .el-dialog__header {
    border-bottom: 1px solid rgba(255, 200, 220, 0.5);
    padding: 15px 20px;
    background: rgba(255, 240, 250, 0.5);
  }

  ::v-deep .el-dialog__title {
    color: #ff6b9e;
    font-weight: bold;
    font-size: 18px;
    text-shadow: 0 2px 4px rgba(255, 150, 200, 0.2);
  }

  ::v-deep .el-dialog__body {
    color: #758ea1;
    padding: 20px;
    position: relative;
  }

  .decoration {
    position: absolute;
    z-index: 0;
    opacity: 0.1;

    &.deco-1 {
      top: 20px;
      right: 20px;
      width: 80px;
      height: 80px;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="%23ff6b9e" d="M50 0c13.8 0 25 11.2 25 25s-11.2 25-25 25-25-11.2-25-25 11.2-25 25-25z"/></svg>');
      animation: float 4s ease-in-out infinite;
    }

    &.deco-2 {
      bottom: 40px;
      left: 20px;
      width: 60px;
      height: 60px;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="%239d65ff" d="M50 0l12.5 37.5h25l-20 15 7.5 25-25-15-25 15 7.5-25-20-15h25z"/></svg>');
      animation: sparkle 3s ease-in-out infinite;
    }

    &.deco-3 {
      top: 50%;
      right: 10%;
      width: 40px;
      height: 40px;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="%2365ffa3" d="M50 0c27.6 0 50 22.4 50 50s-22.4 50-50 50-50-22.4-50-50 22.4-50 50-50z"/></svg>');
      animation: float 5s ease-in-out infinite;
    }
  }

  .header-section {
    text-align: center;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;

    .title-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 5px;
    }

    .plugin-name-class {
      font-size: 2rem;
      font-weight: bold;
      color: #ff6b9e;
      text-shadow: 0 2px 4px rgba(255, 150, 200, 0.3);
      margin: 0;
      display: inline-block;
      background: linear-gradient(45deg, #ff6b9e, #9d65ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .version-class {
      font-size: 1rem;
      font-weight: normal;
      color: #9d65ff;
      margin-left: 0.5rem;
    }

    .module-info {
      color: #888;
      font-size: 0.9rem;
      margin-top: 5px;

      .author-class {
        color: #9d65ff;
        font-weight: 500;
      }
    }
  }

  .section-title {
    position: relative;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;

    .title-text {
      font-size: 1.25rem;
      font-weight: bold;
      color: #ff6b9e;
      background: linear-gradient(45deg, #ff6b9e, #9d65ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      padding-right: 10px;
      z-index: 1;
    }

    .title-decoration {
      flex-grow: 1;
      height: 2px;
      background: linear-gradient(
        90deg,
        rgba(255, 107, 158, 0.3),
        rgba(157, 101, 255, 0.3)
      );
      position: relative;

      &::after {
        content: "";
        position: absolute;
        top: -3px;
        right: 0;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #9d65ff;
      }
    }
  }

  .form-item-cute {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(255, 150, 200, 0.1);
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 150, 200, 0.2);
      background: rgba(255, 255, 255, 0.9);
    }

    .label-text {
      font-size: 14px;
      color: #666;
      min-width: 80px;
      margin-right: 10px;
    }

    .emoji {
      margin-left: 8px;
      font-size: 16px;
    }
  }

  .cute-input {
    ::v-deep .el-input__inner {
      border-radius: 12px;
      border: 1px solid rgba(255, 150, 200, 0.5);
      background: rgba(255, 255, 255, 0.8);
      color: #ff6b9e;
      padding-left: 10px;

      &:focus {
        border-color: #ff6b9e;
        box-shadow: 0 0 0 2px rgba(255, 107, 158, 0.2);
      }
    }
  }

  .cute-select {
    ::v-deep .el-select {
      .el-input__inner {
        border-radius: 12px;
        border: 1px solid rgba(255, 150, 200, 0.5);
        background: rgba(255, 255, 255, 0.8);
        color: #ff6b9e;

        &:hover {
          border-color: #ff6b9e;
        }
      }

      .el-select__caret {
        color: #ff6b9e;
      }
    }
  }

  .neko-divider {
    ::v-deep .el-divider__text {
      background: linear-gradient(
        145deg,
        rgba(255, 240, 245, 0.95) 0%,
        rgba(240, 240, 255, 0.95) 100%
      );
      color: #ff6b9e;
      font-size: 14px;
      padding: 0 15px;
    }

    .divider-content {
      display: flex;
      align-items: center;

      &::before,
      &::after {
        content: "🌸";
        margin: 0 5px;
      }
    }
  }

  .neko-table {
    ::v-deep .el-table {
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 15px !important;
      overflow: hidden;
      border: 1px solid rgba(255, 200, 220, 0.5);

      &::before {
        display: none;
      }
    }

    ::v-deep .el-table__header-wrapper {
      border-radius: 15px 15px 0 0;
    }

    ::v-deep .el-table__body-wrapper {
      border-radius: 0 0 15px 15px;
    }

    .neko-table-header {
      background: linear-gradient(45deg, #ffebf2 0%, #ebf2ff 100%);
      color: #ff6b9e;
      font-weight: bold;

      th {
        border-bottom: 1px solid rgba(255, 200, 220, 0.5);
      }
    }

    ::v-deep .el-table__row {
      background-color: rgba(255, 255, 255, 0.5);
      transition: all 0.3s;

      td {
        border-bottom: 1px solid rgba(255, 200, 220, 0.3);
      }

      &:hover {
        background-color: rgba(255, 240, 245, 0.7);
        transform: translateX(2px);
      }

      &:nth-child(even) {
        background-color: rgba(255, 250, 252, 0.5);
      }
    }
  }

  .cute-scroll {
    ::v-deep ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    ::v-deep ::-webkit-scrollbar-track {
      background: rgba(255, 220, 240, 0.3);
      border-radius: 3px;
    }

    ::v-deep ::-webkit-scrollbar-thumb {
      background: rgba(255, 150, 200, 0.5);
      border-radius: 3px;

      &:hover {
        background: rgba(255, 150, 200, 0.7);
      }
    }
  }

  .cute-btn {
    border-radius: 20px;
    padding: 10px 25px;
    font-weight: bold;
    transition: all 0.3s ease;
    border: none;
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.3) 0%,
        transparent 70%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(255, 150, 200, 0.4);

      &::before {
        opacity: 1;
      }
    }

    &:active {
      transform: translateY(1px);
    }
  }

  .cancel-btn {
    background: linear-gradient(45deg, #f0f0f0 0%, #e0e0e0 100%);
    color: #888;

    &:hover {
      background: linear-gradient(45deg, #f8f8f8 0%, #e8e8e8 100%);
    }
  }

  .confirm-btn {
    background: linear-gradient(45deg, #ff76d0 0%, #a966ff 100%);
    color: white;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);

    &:hover {
      background: linear-gradient(45deg, #ff8cd9 0%, #b57aff 100%);
    }
  }
}

@media (max-width: 768px) {
  .neko-dialog {
    ::v-deep .el-dialog {
      width: 95% !important;
      max-width: 95%;
      margin: 10px auto;
      border-radius: 15px;
    }

    .update-info {
      flex-direction: column;

      .base-setting,
      .config-setting {
        width: 100% !important;
      }

      .config-setting {
        margin-left: 0 !important;
        margin-top: 20px;
      }
    }

    ::v-deep .el-col {
      padding-left: 0 !important;
      margin-bottom: 10px;
    }

    .form-item-cute {
      flex-direction: column;
      align-items: flex-start;

      .label-text {
        margin-bottom: 5px;
      }

      .emoji {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .footer {
      flex-direction: column;

      .confirm-btn {
        margin-left: 0 !important;
        margin-top: 10px;
      }
    }
  }
}
</style>
