<template>
  <div class="list-box">
    <div
      v-for="data in dataList"
      :key="data.module"
      class="plugin-card"
      :class="{ 'is-selected': isSelected(data.module) }"
      @click="toggleSelection(data.module)"
    >
      <div class="selection-indicator" v-if="isSelected(data.module)">
        <i class="el-icon-check"></i>
      </div>
      <div class="base-info">
        <div class="base-info-box">
          <p class="plugin-name-class">
            {{ data.plugin_name }}
            <span class="version-class">v{{ data.version }}</span>
          </p>
          <p class="author-border">
            {{ data.module }}
            <span class="author-class" v-if="data.author"
              >@{{ data.author }}</span
            >
          </p>
        </div>
        <div class="menu-type-container" v-if="data.menu_type">
          <span class="menu-type-display">{{ data.menu_type }}</span>
        </div>

        <div class="setting">
          <span @click.stop="changeSwitch(data)">
            <svg-icon
              v-if="pluginType != 'HIDDEN'"
              :icon-class="data.status ? 'power-open' : 'power-close'"
              class="power-icon"
            />
          </span>
          <span @click.stop="openSetting(data)">
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
import SvgIcon from "../SvgIcon/SvgIcon.vue";
import UpdateDialog from "./UpdateDialog";
export default {
  name: "PluginListTemplate",
  props: { pluginType: String, menuType: String },
  components: { SvgIcon, UpdateDialog },
  data() {
    return {
      dataList: [],
      pluginModule: null,
      dialogVisible: false,
      selectedPlugins: [],
    };
  },
  created() {},
  mounted() {
    this.getPluginList();
  },
  methods: {
    getPluginList() {
      this.clearSelection();
      const loading = this.getLoading(".list-box");
      this.getRequest(`${this.$root.prefix}/plugin/get_plugin_list`, {
        plugin_type: [this.pluginType],
        menu_type: this.menuType,
      })
        .then((resp) => {
          if (resp && resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning);
            } else {
              this.dataList = Array.isArray(resp.data) ? resp.data : [];
              console.log("[Plugin List Data]:", this.dataList);
            }
          } else {
            const errorInfo = resp
              ? resp.info
              : "获取插件列表失败：无效的响应或操作失败";
            this.$message.error(errorInfo || "获取插件列表失败");
            this.dataList = [];
            console.error(
              "[Plugin List Error]: Invalid response or failed request",
              resp
            );
          }
          loading.close();
        })
        .catch((error) => {
          loading.close();
          this.$message.error("请求插件列表失败: " + error);
          this.dataList = [];
          console.error("[Plugin List Exception]:", error);
        });
    },
    changeSwitch(data) {
      this.postRequest(`${this.$root.prefix}/plugin/change_switch`, {
        module: data.module,
        status: !data.status,
      }).then((resp) => {
        if (resp.suc) {
          if (resp.warning) {
            this.$message.warning(resp.warning);
          } else {
            this.$message.success(resp.info);
            this.getPluginList();
          }
        } else {
          this.$message.error(resp.info);
        }
      });
    },
    openSetting(data) {
      this.pluginModule = data.module;
      this.dialogVisible = true;
    },
    closeSetting(isRefresh) {
      this.pluginModule = null;
      this.dialogVisible = false;
      if (isRefresh) {
        this.getPluginList();
      }
    },
    isSelected(module) {
      return this.selectedPlugins.includes(module);
    },
    toggleSelection(module) {
      const index = this.selectedPlugins.indexOf(module);
      if (index > -1) {
        this.selectedPlugins.splice(index, 1);
      } else {
        this.selectedPlugins.push(module);
      }
      this.$emit("update:selection", [...this.selectedPlugins]);
    },
    clearSelection() {
      if (this.selectedPlugins.length > 0) {
        this.selectedPlugins = [];
        this.$emit("update:selection", []);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.list-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 10px;
  align-content: flex-start;
}

.plugin-card {
  flex: 1 1 calc(25% - 20px); /* Adjust the percentage for column count */
  max-width: 380px;
  height: 110px;
  background-color: var(--bg-color-secondary);
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
  position: relative;

  &.is-selected {
    border-color: var(--primary-color);
    box-shadow: 0 5px 15px rgba(var(--primary-color-rgb, 77, 124, 254), 0.2);
  }

  .selection-indicator {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: var(--primary-color);
    color: var(--bg-color-secondary);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    z-index: 5;
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
      min-width: 0;

      .plugin-name-class {
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--text-color);
      }

      .version-class {
        font-size: 11px;
        font-weight: 400;
        margin-left: 6px;
        color: var(--text-color-secondary);
      }

      .author-border {
        color: var(--text-color-secondary);
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 0;
      }

      .author-class {
        margin-left: 5px;
      }
    }

    .menu-type-container {
      flex-shrink: 0;
      margin-right: 15px;
    }

    .menu-type-display {
      font-size: 12px;
      color: var(--text-color-secondary);
      background-color: var(--bg-color-hover);
      padding: 2px 6px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .setting {
      flex-shrink: 0;
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
        color: var(--info-color);
        transition: color 0.3s ease;

        &:hover {
          color: var(--primary-color);
        }
      }
      .power-icon[icon-class*="power-open"] {
        color: var(--success-color);
        &:hover {
          filter: brightness(1.1);
        }
      }
      .power-icon[icon-class*="power-close"] {
        color: var(--danger-color);
        &:hover {
          filter: brightness(1.1);
        }
      }
    }
  }
}
</style>
