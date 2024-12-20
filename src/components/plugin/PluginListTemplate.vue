<template>
  <div class="list-box">
    <div v-for="data in dataList" :key="data.module" class="plugin-card">
      <div
        class="plugin-status"
        :style="{ 'background-color': data.status ? '#3cc07d' : '#757175' }"
      ></div>
      <div class="base-info">
        <div class="base-info-box">
          <p class="plugin-name-class">
            {{ data.plugin_name
            }}<span class="version-class">v{{ data.version }}</span>
          </p>
          <p style="color: #b8bac0" class="author-border">
            {{ data.module
            }}<span class="author-class" v-if="data.author"
              >@{{ data.author }}</span
            >
          </p>
        </div>

        <div class="setting">
          <span @click="changeSwitch(data)">
            <svg-icon
              v-if="pluginType != 'other'"
              :icon-class="data.status ? 'power-open' : 'power-close'"
              class="power-icon"
            />
          </span>
          <span @click="openSetting(data)">
            <svg-icon icon-class="setting" class="setting-icon" />
          </span>
        </div>
      </div>
      <el-divider />
      <div class="plugin-info">
        <div class="plugin-box">
          <div class="plugin-info-box-item">
            <p class="plugin-info-item-text">
              <svg-icon
                :icon-class="data.default_status ? 'yes-green' : 'no-red'"
              />
            </p>
            <p class="base-small-title">默认开关</p>
          </div>
          <el-divider direction="vertical" />
          <div class="plugin-info-box-item">
            <p class="plugin-info-item-text">
              <svg-icon
                :icon-class="data.limit_superuser ? 'yes-green' : 'no-red'"
              />
            </p>
            <p class="base-small-title">限制超级用户</p>
          </div>
          <el-divider direction="vertical" />
          <div class="plugin-info-box-item">
            <p class="plugin-info-item-text">
              {{ data.cost_gold }}
            </p>
            <p class="base-small-title">花费金币</p>
          </div>
        </div>
        <el-divider />
        <div class="plugin-box">
          <div class="plugin-info-box-item">
            <p class="plugin-info-item-text">
              {{ data.level }}
            </p>
            <p class="base-small-title">群权限</p>
          </div>
          <el-divider direction="vertical" />
          <div class="plugin-info-box-item" style="width: 214px">
            <p class="plugin-info-item-text">
              {{ data.menu_type }}
            </p>
            <p class="base-small-title">菜单类型</p>
          </div>
        </div>
      </div>
    </div>
    <UpdateDialog
      v-if="dialogVisible"
      :module="pluginModule"
      @close="closeSetting"
    />
  </div>
</template>

<script>
import SvgIcon from "../SvgIcon/SvgIcon.vue"
import UpdateDialog from "./UpdateDialog"
export default {
  name: "PluginListTemplate",
  props: { pluginType: String, menuType: String },
  components: { SvgIcon, UpdateDialog },
  data() {
    return {
      dataList: [],
      pluginModule: null,
      dialogVisible: false,
    }
  },
  mounted() {
    this.getPluginList()
  },
  methods: {
    getPluginList() {
      const loading = this.getLoading(".list-box")
      this.getRequest(`${this.$root.prefix}/plugin/get_plugin_list`, {
        plugin_type: [this.pluginType],
        menu_type: this.menuType,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.dataList = resp.data
          }
        } else {
          this.$message.error(resp.info)
        }
        loading.close()
      })
    },
    changeSwitch(data) {
      this.postRequest(`${this.$root.prefix}/plugin/change_switch`, {
        module: data.module,
        status: !data.status,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning)
          } else {
            this.$message.success(resp.info)
            this.getPluginList()
          }
        } else {
          this.$message.error(resp.info)
        }
      })
    },
    openSetting(data) {
      this.pluginModule = data.module
      this.dialogVisible = true
    },
    closeSetting(isRefresh) {
      this.pluginModule = null
      this.dialogVisible = false
      if (isRefresh) {
        this.getPluginList()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.list-box {
  width: 100%;
  height: 100%;

  .plugin-card {
    padding: 0 30px 30px 30px;
    float: left;
    height: 240px;
    width: 390px;
    background-color: #ffffff;
    margin: 10px 40px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .plugin-status {
      width: 100%;
      height: 3px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }

    .base-info {
      width: 390px;
      height: 44px;
      margin-top: 30px;

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

      .author-border {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 250px;
      }

      .author-class {
        margin-left: 10px;
      }

      .base-info-box {
        float: left;
      }

      .setting {
        float: right;
      }

      .setting-icon {
        width: 25px;
        height: 25px;
        cursor: pointer;
      }

      .power-icon {
        width: 35px;
        height: 35px;
        margin-right: 30px;
        cursor: pointer;
      }
    }
    ::v-deep .el-divider--horizontal {
      margin: 12px 0 5px 0 !important;
    }

    .plugin-info {
      .base-small-title {
        color: #afb2b9;
        font-size: 13px;
      }

      ::v-deep .el-divider--horizontal {
        margin: 0 !important;
      }

      .plugin-box {
        display: flex;

        ::v-deep .el-divider--vertical {
          height: 75px;
        }

        .plugin-info-box-item {
          display: flex;
          flex-direction: column;
          text-align: center;
          margin: 10px 20px;
          height: 55px;
          width: 79px;

          .plugin-info-item-text {
            font-size: 21px;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
}
</style>
