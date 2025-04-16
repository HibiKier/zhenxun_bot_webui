<template>
  <div class="list-box">
    <div
      v-for="data in dataList"
      :key="data.module"
      class="plugin-card"
      :style="{ height: cardHeight + 'px' }"
    >
      <div class="base-info">
        <div class="base-info-box">
          <p class="plugin-name-class">
            {{ data.plugin_name }}
            <span class="version-class">v{{ data.version }}</span>
          </p>
          <p class="author-border">
            {{ data.module }}
            <span class="author-class" v-if="data.author">@{{ data.author }}</span>
          </p>
        </div>

        <div class="setting">
          <span @click="changeSwitch(data)">
            <svg-icon
              v-if="pluginType != 'HIDDEN'"
              :icon-class="data.status ? 'power-open' : 'power-close'"
              class="power-icon"
            />
          </span>
          <span @click="openSetting(data)">
            <svg-icon icon-class="setting" class="setting-icon" />
          </span>
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
      cardHeight: 80,
    }
  },
  created() {
    // Remove or adjust botType specific height changes if not needed
    // if (this.$store.state.botType == "nonebot") {
    //   this.cardHeight = 80 // Example fixed height for nonebot
    // }
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
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 10px;
}

.plugin-card {
  width: calc(33.333% - 18px);
  max-width: 380px;
  height: 80px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;

  &:hover {
     box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  }

  .base-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;

    .base-info-box {
      flex-grow: 1;
      margin-right: 15px;
    }

    .plugin-name-class {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .version-class {
      font-size: 11px;
      font-weight: 400;
      margin-left: 6px;
      color: #909399;
    }

    .author-border {
      color: #b0b3b8;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 220px;
    }

    .author-class {
      margin-left: 5px;
    }

    .setting {
      display: flex;
      align-items: center;
      gap: 12px;

      span {
        cursor: pointer;
      }

      .power-icon,
      .setting-icon {
        width: 20px;
        height: 20px;
        color: #a8abb2;
        transition: color 0.3s ease;

        &:hover {
           color: #4d7cfe;
        }
      }
       .power-icon[icon-class*="power-open"] {
         color: #67c23a;
          &:hover {
           color: #85d860;
         }
       }
        .power-icon[icon-class*="power-close"] {
         color: #f56c6c;
         &:hover {
           color: #f78989;
         }
       }
    }
  }
}
</style>
