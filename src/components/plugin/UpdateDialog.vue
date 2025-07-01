<template>
  <el-dialog
    :visible.sync="visible"
    @close="close"
    :class="{
      'neko-dialog': true,
      'limit-width': !updateData.config_list || !updateData.config_list.length,
    }"
    width="80%"
    top="5vh"
  >
    <!-- 对话框背景装饰 -->
    <div class="dialog-background">
      <div class="bg-pattern pattern-1"></div>
      <div class="bg-pattern pattern-2"></div>
      <div class="bg-blob blob-1"></div>
      <div class="bg-blob blob-2"></div>
    </div>

    <!-- 头部区域 -->
    <div class="plugin-header">
      <div class="plugin-icon">
        <i class="el-icon-magic-stick"></i>
      </div>
      <div class="plugin-info">
        <h2 class="plugin-title">
          {{ updateData.plugin_name }}
          <span class="plugin-version">v{{ updateData.version }}</span>
        </h2>
        <div class="plugin-meta">
          <span class="plugin-module">{{ updateData.module }}</span>
          <span class="plugin-author" v-if="updateData.author">
            <i class="el-icon-user"></i> {{ updateData.author }}
          </span>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="plugin-content">
      <!-- 基础配置区域 -->
      <div class="settings-container">
        <div class="settings-section">
          <div class="section-header">
            <i class="el-icon-setting"></i>
            <h3>基础配置</h3>
          </div>

          <el-form
            :model="updateData"
            :rules="rules"
            ref="form"
            class="settings-form"
          >
            <!-- 第一行设置 -->
            <div class="settings-row">
              <div class="setting-card">
                <div class="setting-icon">
                  <i class="el-icon-switch-button"></i>
                </div>
                <div class="setting-content">
                  <div class="setting-label">默认开关</div>
                  <div class="setting-control">
                    <MySwitch v-model="updateData.default_status" />
                  </div>
                </div>
              </div>

              <div class="setting-card">
                <div class="setting-icon">
                  <i class="el-icon-user"></i>
                </div>
                <div class="setting-content">
                  <div class="setting-label">限制超级用户</div>
                  <div class="setting-control">
                    <MySwitch v-model="updateData.limit_superuser" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 真寻特有设置 -->
            <template v-if="this.$store.state.botType == 'zhenxun'">
              <div class="settings-row">
                <div class="setting-card">
                  <div class="setting-icon">
                    <i class="el-icon-coin"></i>
                  </div>
                  <div class="setting-content">
                    <div class="setting-label">花费金币</div>
                    <div class="setting-control">
                      <neon-input
                        v-model="updateData.cost_gold"
                        placeholder="0"
                        class="neon-input"
                      />
                    </div>
                  </div>
                </div>

                <div class="setting-card">
                  <div class="setting-icon">
                    <i class="el-icon-menu"></i>
                  </div>
                  <div class="setting-content">
                    <div class="setting-label">菜单类型</div>
                    <div class="setting-control">
                      <neko-select
                        v-model="updateData.menu_type"
                        placeholder="选择类型"
                        class="neko-select"
                        :options="menuTypeOptions"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- 最后一行设置 -->
            <div class="settings-row">
              <div
                class="setting-card"
                v-if="this.$store.state.botType == 'zhenxun'"
              >
                <div class="setting-icon">
                  <i class="el-icon-lock"></i>
                </div>
                <div class="setting-content">
                  <div class="setting-label">群权限</div>
                  <div class="setting-control">
                    <neko-select
                      v-model="updateData.level"
                      placeholder="选择等级"
                      class="neko-select"
                      :options="levelOptions"
                    />
                  </div>
                </div>
              </div>

              <div class="setting-card">
                <div class="setting-icon">
                  <i class="el-icon-remove"></i>
                </div>
                <div class="setting-content">
                  <div class="setting-label">禁用类型</div>
                  <div class="setting-control">
                    <neko-select
                      v-model="updateData.block_type"
                      placeholder="选择类型"
                      class="neko-select"
                      :options="blockTypeOptions"
                      clearable
                    />
                  </div>
                </div>
              </div>
            </div>
          </el-form>
        </div>

        <!-- 配置项区域 -->
        <div
          class="settings-section config-section"
          v-if="updateData.config_list && updateData.config_list.length"
        >
          <div class="section-header">
            <i class="el-icon-edit-outline"></i>
            <h3>配置项</h3>
          </div>

          <div class="config-table-wrapper">
            <el-table
              :data="updateData.config_list"
              border
              class="config-table"
              height="400"
            >
              <el-table-column
                label="键"
                prop="key"
                min-width="100"
                align="left"
              />
              <el-table-column
                label="帮助"
                prop="help"
                min-width="200"
                align="left"
              />
              <el-table-column
                label="默认值"
                prop="default_value"
                min-width="100"
                align="center"
              >
                <template slot-scope="{ row }">
                  {{
                    row.default_value + "" != "null"
                      ? row.default_value + ""
                      : "-"
                  }}
                </template>
              </el-table-column>
              <el-table-column label="值" min-width="140" align="center">
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

    <!-- 底部操作区 -->
    <div class="dialog-footer">
      <div class="action-buttons">
        <button class="cancel-button" @click="close">
          <i class="el-icon-close"></i>
          <span>取消</span>
        </button>
        <button class="confirm-button" @click="commit">
          <i class="el-icon-check"></i>
          <span>确定</span>
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import AutoComponent from "./AutoComponent.vue"
import NeonInput from "@/components/ui/NeonInput.vue"
import NekoSelect from "@/components/ui/NekoSelect.vue"
import MySwitch from "@/components/ui/MySwitch.vue"
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
// 主题颜色变量
$primary: var(--el-color-primary, #409eff);
$primary-light: var(--el-color-primary-light-3, #79bbff);
$primary-lighter: var(--el-color-primary-light-7, #c6e2ff);
$primary-lightest: var(--el-color-primary-light-9, #ecf5ff);
$text-main: var(--el-text-color-primary, #303133);
$text-secondary: var(--el-text-color-secondary, #909399);
$border-color: var(--el-border-color-light, #e4e7ed);
$bg-color: var(--el-bg-color, #ffffff);
$bg-color-overlay: var(--el-bg-color-overlay, #ffffff);

// 动画
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.9;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

// 对话框样式
.neko-dialog {
  ::v-deep .el-dialog {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: none;
    background: $bg-color-overlay;
    backdrop-filter: blur(10px);
    position: relative;
  }

  ::v-deep .el-dialog__header {
    display: none; // 隐藏默认头部
  }

  ::v-deep .el-dialog__body {
    padding: 0;
    position: relative;
    z-index: 1;
  }

  // 背景装饰
  .dialog-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
    opacity: 0.5;
    pointer-events: none;

    .bg-pattern {
      position: absolute;
      opacity: 0.05;

      &.pattern-1 {
        top: 0;
        right: 0;
        width: 300px;
        height: 300px;
        background-image: radial-gradient(
          circle,
          $primary 1px,
          transparent 1px
        );
        background-size: 20px 20px;
      }

      &.pattern-2 {
        bottom: 0;
        left: 0;
        width: 200px;
        height: 200px;
        background-image: linear-gradient(45deg, $primary 25%, transparent 25%),
          linear-gradient(-45deg, $primary 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, $primary 75%),
          linear-gradient(-45deg, transparent 75%, $primary 75%);
        background-size: 20px 20px;
        background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
      }
    }

    .bg-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(50px);
      opacity: 0.1;

      &.blob-1 {
        top: -100px;
        right: -50px;
        width: 300px;
        height: 300px;
        background: linear-gradient(135deg, $primary, #8a2be2);
        animation: pulse 10s infinite ease-in-out;
      }

      &.blob-2 {
        bottom: -80px;
        left: -50px;
        width: 250px;
        height: 250px;
        background: linear-gradient(135deg, #00bfff, $primary);
        animation: pulse 8s infinite ease-in-out reverse;
      }
    }
  }

  // 插件头部
  .plugin-header {
    display: flex;
    align-items: center;
    padding: 24px 30px;
    background: linear-gradient(135deg, $primary-lightest, $bg-color);
    border-bottom: 1px solid $border-color;
    position: relative;
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(
        90deg,
        $primary,
        $primary-light,
        $primary,
        $primary-light
      );
      background-size: 200% 100%;
      animation: gradientMove 3s linear infinite;
    }

    .plugin-icon {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      background: linear-gradient(135deg, $primary, $primary-light);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

      i {
        font-size: 30px;
        color: white;
      }
    }

    .plugin-info {
      flex: 1;

      .plugin-title {
        margin: 0 0 8px;
        font-size: 24px;
        font-weight: 700;
        color: $text-main;
        display: flex;
        align-items: center;

        .plugin-version {
          font-size: 14px;
          font-weight: normal;
          color: $text-secondary;
          margin-left: 10px;
          padding: 2px 8px;
          background: $primary-lightest;
          border-radius: 12px;
        }
      }

      .plugin-meta {
        display: flex;
        align-items: center;
        color: $text-secondary;
        font-size: 14px;

        .plugin-module {
          padding-right: 12px;
          margin-right: 12px;
          border-right: 1px solid $border-color;
        }

        .plugin-author {
          display: flex;
          align-items: center;

          i {
            margin-right: 4px;
            font-size: 14px;
          }
        }
      }
    }
  }

  // 内容区域
  .plugin-content {
    padding: 20px 30px;
    max-height: 60vh;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: $bg-color;
    }

    &::-webkit-scrollbar-thumb {
      background: $primary-lighter;
      border-radius: 3px;

      &:hover {
        background: $primary-light;
      }
    }
  }

  // 设置容器
  .settings-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  // 设置区域
  .settings-section {
    background: $bg-color;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      background: $primary-lightest;
      border-bottom: 1px solid $border-color;

      i {
        font-size: 20px;
        color: $primary;
        margin-right: 10px;
      }

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: $primary;
      }
    }

    .settings-form {
      padding: 20px;
    }

    .settings-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    // 设置卡片
    .setting-card {
      display: flex;
      align-items: center;
      padding: 16px;
      background: $bg-color-overlay;
      border-radius: 12px;
      border: 1px solid $border-color;
      transition: all 0.3s ease;

      &:hover {
        border-color: $primary-light;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      }

      .setting-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: $primary-lightest;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;

        i {
          font-size: 20px;
          color: $primary;
        }
      }

      .setting-content {
        flex: 1;

        .setting-label {
          font-size: 15px;
          font-weight: 500;
          color: $text-main;
          margin-bottom: 8px;
        }

        .setting-control {
          display: flex;
          align-items: center;

          .neon-input,
          .neko-select {
            width: 100%;
          }
        }
      }
    }
  }

  // 配置表格
  .config-section {
    .config-table-wrapper {
      padding: 15px;
      max-height: 400px;
      overflow: hidden;
    }

    .config-table {
      ::v-deep .el-table {
        border-radius: 10px;
        overflow: hidden;

        &::before {
          display: none;
        }

        .el-table__header-wrapper {
          th {
            background: $primary-lightest;
            color: $primary;
            font-weight: 600;
            padding: 12px 0;
          }
        }

        .el-table__row {
          td {
            padding: 10px 0;
            transition: all 0.3s;
          }

          &:hover td {
            background-color: $primary-lightest;
          }
        }
      }
    }
  }

  // 底部操作区
  .dialog-footer {
    padding: 20px 30px;
    border-top: 1px solid $border-color;
    background: $bg-color;
    display: flex;
    justify-content: flex-end;

    .action-buttons {
      display: flex;
      gap: 15px;

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 24px;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;

        i {
          margin-right: 6px;
          font-size: 16px;
        }

        &.cancel-button {
          background: $bg-color;
          color: $text-secondary;
          border: 1px solid $border-color;

          &:hover {
            background: #f5f7fa;
            color: $text-main;
          }
        }

        &.confirm-button {
          background: $primary;
          color: white;

          &:hover {
            background: $primary-light;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(64, 158, 255, 0.3);
          }

          &:active {
            transform: translateY(0);
          }
        }
      }
    }
  }

  // 响应式调整
  @media (max-width: 768px) {
    ::v-deep .el-dialog {
      width: 95% !important;
      margin: 10px auto;
    }

    .plugin-header {
      padding: 15px;
      flex-direction: column;
      align-items: flex-start;

      .plugin-icon {
        margin-bottom: 15px;
      }
    }

    .plugin-content {
      padding: 15px;
    }

    .settings-row {
      grid-template-columns: 1fr !important;
    }

    .dialog-footer {
      padding: 15px;

      .action-buttons {
        width: 100%;

        button {
          flex: 1;
          padding: 10px 0;
        }
      }
    }
  }

  // 限制宽度
  &.limit-width {
    ::v-deep .el-dialog {
      max-width: 600px;
    }
  }
}
</style>
