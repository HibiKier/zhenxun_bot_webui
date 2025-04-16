<template>
  <div class="base-box">
    <div class="top-select">
      <div class="top-select-btn-box">
        <div
          :class="getTopItemClass('NORMAL')"
          @click="clickPluginType('NORMAL')"
          style="border-top-left-radius: 5px; border-bottom-left-radius: 5px"
        >
          普通插件({{ pluginCount.normal }})
        </div>
        <el-divider direction="vertical" />
        <div
          :class="getTopItemClass('ADMIN')"
          @click="clickPluginType('ADMIN')"
        >
          管理员插件({{ pluginCount.admin }})
        </div>
        <el-divider direction="vertical" />
        <div
          :class="getTopItemClass('SUPERUSER')"
          @click="clickPluginType('SUPERUSER')"
        >
          超级用户插件({{ pluginCount.superuser }})
        </div>
        <el-divider direction="vertical" />
        <div
          :class="getTopItemClass('HIDDEN')"
          @click="clickPluginType('HIDDEN')"
          style="border-top-right-radius: 5px; border-bottom-right-radius: 5px"
        >
          其他插件({{ pluginCount.other }})
        </div>
      </div>
    </div>
    <div class="filter-tags-container">
      <div class="filter-tags">
        <span
          :class="getTagClass(null)"
          @click="selectMenuType(null)"
          class="filter-tag-item"
        >
          全部
        </span>
        <span
          v-for="tag in sortedMenuTypeList"
          :key="tag"
          :class="getTagClass(tag)"
          class="filter-tag-item"
          @click="selectMenuType(tag)"
        >
          {{ tag }}
        </span>
      </div>
      <el-button
        icon="el-icon-plus"
        size="mini"
        title="新增菜单类型"
        @click="addNewMenuType"
        class="add-type-button"
        >新增类型</el-button
      >
      <el-button
        icon="el-icon-setting"
        size="mini"
        title="管理菜单类型"
        @click="openManageTypesDialog"
        class="manage-type-button"
        >管理类型</el-button
      >
    </div>

    <div class="bulk-action-bar" v-if="selectedPluginModules.length > 0">
      <span class="selection-count"
        >已选择 {{ selectedPluginModules.length }} 项</span
      >
      <el-button
        icon="el-icon-turn-off"
        size="mini"
        type="success"
        @click="bulkToggleSwitch(true)"
        >启用</el-button
      >
      <el-button
        icon="el-icon-open"
        size="mini"
        type="warning"
        @click="bulkToggleSwitch(false)"
        >禁用</el-button
      >

      <el-divider direction="vertical"></el-divider>

      <el-select
        v-model="targetMenuTypeBulk"
        placeholder="选择新菜单类型"
        size="mini"
        style="width: 180px; margin: 0 5px"
        clearable
      >
        <el-option
          v-for="item in sortedMenuTypeList"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-button size="mini" type="primary" @click="bulkUpdateMenuType"
        >应用类型</el-button
      >

      <el-divider direction="vertical"></el-divider>

      <el-button icon="el-icon-close" size="mini" @click="cancelSelection"
        >取消选择</el-button
      >
    </div>

    <el-divider />
    <div class="plugin-list">
      <PluginListTemplate
        ref="pluginListRef"
        :pluginType="activeBtn"
        :menuType="searchMenuType"
        :key="pltKey"
        @update:selection="handleSelectionUpdate"
      />
    </div>

    <el-dialog
      title="管理菜单类型"
      :visible.sync="manageTypesDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="manage-types-list">
        <p v-if="sortedMenuTypeList.length === 0">暂无自定义菜单类型。</p>
        <ul>
          <li v-for="type in sortedMenuTypeList" :key="type">
            <span>{{ type }}</span>
            <div class="actions">
              <el-button
                type="text"
                size="mini"
                @click="triggerRenameType(type)"
                >重命名</el-button
              >
            </div>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="manageTypesDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PluginListTemplate from "@/components/plugin/PluginListTemplate.vue";

export default {
  name: "PluginList",
  data() {
    return {
      activeName: "NormalPlugin",
      pluginCount: { normal: 0, admin: 0, superuser: 0, other: 0 },
      activeBtn: "NORMAL",
      pltKey: 0,
      menuTypeList: [],
      searchMenuType: null,
      selectedPluginModules: [],
      targetMenuTypeBulk: null,
      manageTypesDialogVisible: false,
    };
  },
  components: {
    PluginListTemplate,
  },
  mounted() {
    this.getPluginCount();
    this.getPluginMenuType();
  },
  computed: {
    sortedMenuTypeList() {
      return [...this.menuTypeList].sort((a, b) => {
        const strA = String(a || "");
        const strB = String(b || "");
        return strA.localeCompare(strB);
      });
    },
  },
  methods: {
    getTopItemClass(pluginType) {
      return {
        "top-select-btn-item": true,
        "top-btn-item-select": this.activeBtn == pluginType,
      };
    },
    getTagClass(tag) {
      return {
        "filter-tag-item": true,
        "active-tag": this.searchMenuType === tag,
      };
    },
    clickPluginType(pluginType) {
      this.activeBtn = pluginType;
      this.searchMenuType = null;
      this.pltKey++;
    },
    getPluginCount() {
      this.getRequest(`${this.$root.prefix}/plugin/get_plugin_count`)
        .then((resp) => {
          if (!resp) {
            this.$message.error("获取插件数量失败：无效的响应");
            return;
          }
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning);
            } else {
              this.pluginCount = resp.data;
            }
          } else {
            this.$message.error(resp.info || "获取插件数量失败");
          }
        })
        .catch((error) => {
          this.$message.error("请求插件数量失败: " + error);
        });
    },
    getPluginMenuType() {
      this.getRequest(`${this.$root.prefix}/plugin/get_plugin_menu_type`)
        .then((resp) => {
          if (!resp) {
            this.$message.error("获取菜单类型失败：无效的响应");
            return;
          }
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning);
            } else {
              this.menuTypeList = (
                Array.isArray(resp.data) ? resp.data : []
              ).filter(Boolean);
            }
          } else {
            this.$message.error(resp.info || "获取菜单类型失败");
          }
        })
        .catch((error) => {
          this.$message.error("请求菜单类型失败: " + error);
        });
    },
    selectMenuType(menuType) {
      if (this.searchMenuType !== menuType) {
        this.searchMenuType = menuType;
        this.pltKey++;
      }
    },
    handleSelectionUpdate(selectedModules) {
      this.selectedPluginModules = selectedModules || [];
    },

    cancelSelection() {
      this.selectedPluginModules = [];
      this.$refs.pluginListRef?.clearSelection();
    },

    bulkToggleSwitch(enable) {
      if (this.selectedPluginModules.length === 0) return;
      const actionText = enable ? "启用" : "禁用";
      const loading = this.$loading({
        lock: true,
        text: `正在批量${actionText}...`,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      const updates = this.selectedPluginModules.map((module) => ({
        module: module,
        block_type: enable ? null : "ALL",
      }));

      this.putRequest(`${this.$root.prefix}/plugin/plugins/batch_update`, {
        updates: updates,
      })
        .then((resp) => {
          loading.close();
          if (!resp) {
            this.$message.error(`批量${actionText}失败：无效的响应`);
            return;
          }
          if (resp.success) {
            this.$message.success(
              `成功${actionText} ${resp.updated_count} 个插件！`
            );
            if (resp.errors && resp.errors.length > 0) {
              resp.errors.forEach((err) =>
                this.$message.warning(`插件 ${err.module}: ${err.error}`)
              );
            }
            this.cancelSelection();
            this.pltKey++;
          } else {
            let errorMsg = `批量${actionText}失败`;
            if (resp.errors && resp.errors.length > 0) {
              errorMsg +=
                ": " +
                resp.errors.map((e) => `${e.module}(${e.error})`).join(", ");
            }
            this.$message.error(errorMsg);
          }
        })
        .catch((error) => {
          loading.close();
          this.$message.error(`请求失败: ${error}`);
        });
    },

    bulkUpdateMenuType() {
      if (!this.targetMenuTypeBulk) {
        this.$message.warning("请先在上方选择目标菜单类型");
        return;
      }
      if (this.selectedPluginModules.length === 0) return;

      const loading = this.$loading({
        lock: true,
        text: "正在批量修改菜单类型...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      const updates = this.selectedPluginModules.map((module) => ({
        module: module,
        menu_type: this.targetMenuTypeBulk,
      }));

      this.putRequest(`${this.$root.prefix}/plugin/plugins/batch_update`, {
        updates: updates,
      })
        .then((resp) => {
          loading.close();
          if (!resp) {
            this.$message.error("批量修改菜单类型失败：无效的响应");
            return;
          }
          if (resp.success) {
            this.$message.success(
              `成功更新 ${resp.updated_count} 个插件的菜单类型！`
            );
            if (resp.errors && resp.errors.length > 0) {
              resp.errors.forEach((err) =>
                this.$message.warning(`插件 ${err.module}: ${err.error}`)
              );
            }
            this.targetMenuTypeBulk = null;
            this.cancelSelection();
            this.pltKey++;
          } else {
            let errorMsg = "批量修改菜单类型失败";
            if (resp.errors && resp.errors.length > 0) {
              errorMsg +=
                ": " +
                resp.errors.map((e) => `${e.module}(${e.error})`).join(", ");
            }
            this.$message.error(errorMsg);
          }
        })
        .catch((error) => {
          loading.close();
          this.$message.error("请求失败: " + error);
        });
    },

    addNewMenuType() {
      this.$prompt("请输入新的菜单类型名称：", "新增菜单类型", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S+/,
        inputErrorMessage: "菜单类型名称不能为空",
      })
        .then(({ value }) => {
          const newType = value.trim();
          if (!newType) {
            this.$message.warning("菜单类型名称不能为空");
            return;
          }
          const exists = this.menuTypeList.some(
            (type) => type.toLowerCase() === newType.toLowerCase()
          );
          if (exists) {
            this.$message.warning(`菜单类型 "${newType}" 已存在`);
          } else {
            this.menuTypeList.push(newType);
            this.$message.success(
              `菜单类型 "${newType}" 已添加，您可以现在将其应用到插件`
            );
          }
        })
        .catch(() => {
          this.$message.info("已取消新增");
        });
    },

    editMenuType(oldName) {
      if (!oldName) return;

      this.$prompt(`重命名菜单类型 "${oldName}" 为：`, "重命名菜单类型", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: oldName,
        inputPattern: /\S+/,
        inputErrorMessage: "菜单类型名称不能为空",
      })
        .then(({ value }) => {
          const newName = value.trim();
          if (!newName) {
            this.$message.warning("菜单类型名称不能为空");
            return;
          }
          if (newName === oldName) {
            this.$message.info("名称未改变");
            return;
          }

          const exists = this.menuTypeList.some(
            (type) =>
              type.toLowerCase() === newName.toLowerCase() &&
              type.toLowerCase() !== oldName.toLowerCase()
          );
          if (exists) {
            this.$message.warning(`菜单类型名称 "${newName}" 已存在`);
            return;
          }

          const loading = this.$loading({
            lock: true,
            text: "正在重命名...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          this.putRequest(`${this.$root.prefix}/plugin/menu_type/rename`, {
            old_name: oldName,
            new_name: newName,
          })
            .then((resp) => {
              loading.close();
              if (!resp) {
                this.$message.error("重命名失败：无效的响应");
                return;
              }
              if (resp.suc) {
                this.$message.success(resp.info || "重命名成功！");
                const index = this.menuTypeList.findIndex(
                  (type) => type === oldName
                );
                if (index !== -1) {
                  this.$set(this.menuTypeList, index, newName);
                }
                if (this.searchMenuType === oldName) {
                  this.searchMenuType = newName;
                }
              } else {
                this.$message.error(resp.info || "重命名失败");
              }
            })
            .catch((error) => {
              loading.close();
              this.$message.error(`请求失败: ${error}`);
            });
        })
        .catch(() => {
          this.$message.info("已取消重命名");
        });
    },

    openManageTypesDialog() {
      this.manageTypesDialogVisible = true;
    },

    triggerRenameType(oldName) {
      if (!oldName) return;

      this.$prompt(`重命名菜单类型 "${oldName}" 为：`, "重命名菜单类型", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: oldName,
        inputPattern: /\S+/,
        inputErrorMessage: "菜单类型名称不能为空",
      })
        .then(({ value }) => {
          const newName = value.trim();
          if (!newName) {
            this.$message.warning("菜单类型名称不能为空");
            return;
          }
          if (newName === oldName) {
            this.$message.info("名称未改变");
            return;
          }

          const exists = this.menuTypeList.some(
            (type) =>
              type.toLowerCase() === newName.toLowerCase() &&
              type.toLowerCase() !== oldName.toLowerCase()
          );
          if (exists) {
            this.$message.warning(`菜单类型名称 "${newName}" 已存在`);
            return;
          }

          const loading = this.$loading({
            lock: true,
            text: "正在重命名...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          this.putRequest(`${this.$root.prefix}/plugin/menu_type/rename`, {
            old_name: oldName,
            new_name: newName,
          })
            .then((resp) => {
              loading.close();
              if (!resp) {
                this.$message.error("重命名失败：无效的响应");
                return;
              }
              if (resp.suc) {
                this.$message.success(resp.info || "重命名成功！");
                const index = this.menuTypeList.findIndex(
                  (type) => type === oldName
                );
                if (index !== -1) {
                  this.menuTypeList.splice(index, 1, newName);
                }
                this.manageTypesDialogVisible = false;
              } else {
                this.$message.error(resp.info || "重命名失败");
              }
            })
            .catch((error) => {
              loading.close();
              this.$message.error(`请求失败: ${error}`);
            });
        })
        .catch(() => {
          this.$message.info("已取消重命名");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-main {
  background-color: var(--bg-color);
}

.base-box {
  padding: 20px 50px;
  width: calc(100% - 100px);
  height: calc(100% - 100px);

  .top-select {
    width: 100%;
    height: 40px;

    .top-select-btn-box {
      float: left;
      display: flex;
      background-color: var(--bg-color-secondary);
      height: 40px;
      border-radius: 5px;
      color: var(--text-color-secondary);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

      ::v-deep .el-divider--vertical {
        height: 20px;
        margin: 0;
        margin-top: 10px;
      }

      .top-select-btn-item {
        display: flex;
        padding: 0 20px;
        cursor: pointer;
        height: 100%;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: background-color 0.3s, color 0.3s;
      }

      .top-btn-item-select {
        color: #ffffff;
        background-color: var(--primary-color);
      }

      .top-select-btn-item:not(.top-btn-item-select):hover {
        background-color: var(--bg-color-hover);
      }
    }
  }

  .filter-tags-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }

  .filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    flex-grow: 1;
  }

  .filter-tag-item {
    padding: 5px 15px;
    border: 1px solid var(--border-color);
    border-radius: 15px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text-color-secondary);
    background-color: var(--bg-color-secondary);
    transition: all 0.3s;

    &:hover {
      border-color: var(--primary-color-light);
      color: var(--primary-color);
    }

    &.active-tag {
      background-color: var(--primary-color);
      color: #ffffff;
      border-color: var(--primary-color);

      &:hover {
        background-color: var(--primary-color-light);
        border-color: var(--primary-color-light);
        color: #ffffff;
      }
    }
  }

  .add-type-button {
    margin-left: 5px;
  }

  .manage-type-button {
    margin-left: 5px;
  }

  .bulk-action-bar {
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary-light-7);
    border-radius: 6px;
    padding: 8px 15px;
    margin-top: 15px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;

    .selection-count {
      font-size: 13px;
      color: var(--primary-color);
      margin-right: 15px;
      font-weight: 500;
    }

    .el-divider--vertical {
      height: 20px;
      background-color: var(--el-color-primary-light-5);
    }
  }

  ::v-deep .el-divider--horizontal {
    margin: 20px 0;
    background-color: var(--border-color-light);
  }

  .plugin-list {
    width: 100%;
    height: calc(100% - 160px);
    overflow: auto;
  }
}

.manage-types-list {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--border-color-light);

    &:last-child {
      border-bottom: none;
    }

    .actions {
      margin-left: 10px;
      flex-shrink: 0;
    }

    span {
      color: var(--text-color);
    }
  }
}

::v-deep .el-dialog {
  background-color: var(--bg-color-secondary);
}
::v-deep .el-dialog__title {
  color: var(--text-color);
}
::v-deep .el-dialog__body {
  color: var(--text-color-secondary);
}
</style>
