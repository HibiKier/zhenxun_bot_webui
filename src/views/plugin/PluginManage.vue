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
    <div class="filter-tags">
      <span
        :class="getTagClass(null)"
        @click="selectMenuType(null)"
      >
        全部
      </span>
      <span
        v-for="tag in menuTypeList"
        :key="tag"
        :class="getTagClass(tag)"
        @click="selectMenuType(tag)"
      >
        {{ tag }}
      </span>
    </div>
    <el-divider />
    <div class="plugin-list">
      <PluginListTemplate
        :pluginType="activeBtn"
        :menuType="searchMenuType"
        :key="pltKey"
      />
    </div>
  </div>
</template>

<script>
import PluginListTemplate from "@/components/plugin/PluginListTemplate.vue"

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
    }
  },
  components: {
    PluginListTemplate,
  },
  mounted() {
    this.getPluginCount()
    this.getPluginMenuType()
  },
  methods: {
    getTopItemClass(pluginType) {
      return {
        "top-select-btn-item": true,
        "top-btn-item-select": this.activeBtn == pluginType,
      }
    },
    getTagClass(tag) {
      return {
        'filter-tag-item': true,
        'active-tag': this.searchMenuType === tag,
      }
    },
    clickPluginType(pluginType) {
      this.activeBtn = pluginType
      this.searchMenuType = null
      this.pltKey++
    },
    getPluginCount() {
      this.getRequest(`${this.$root.prefix}/plugin/get_plugin_count`).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.pluginCount = resp.data
            }
          } else {
            this.$message.error(resp.info)
          }
        }
      )
    },
    getPluginMenuType() {
      this.getRequest(`${this.$root.prefix}/plugin/get_plugin_menu_type`).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.menuTypeList = resp.data.sort()
            }
          } else {
            this.$message.error(resp.info)
          }
        }
      )
    },
    selectMenuType(menuType) {
      if (this.searchMenuType !== menuType) {
        this.searchMenuType = menuType
        this.pltKey++
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.el-main {
  background-color: #f1f5f8;
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
      background-color: #ffffff;
      height: 40px;
      border-radius: 5px;
      color: #758ea1;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);

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
        background-color: #4d7cfe;
      }

      .top-select-btn-item:not(.top-btn-item-select):hover {
        background-color: #f8f9fa;
      }
    }
  }

  .filter-tags {
    margin-top: 20px;
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .filter-tag-item {
      padding: 5px 15px;
      border: 1px solid #e0e0e0;
      border-radius: 15px;
      cursor: pointer;
      font-size: 13px;
      color: #606266;
      background-color: #ffffff;
      transition: all 0.3s;

      &:hover {
        border-color: #c0c4cc;
        color: #409eff;
      }
    }

    .active-tag {
      background-color: #4d7cfe;
      color: #ffffff;
      border-color: #4d7cfe;

      &:hover {
         background-color: #6b8efc;
         border-color: #6b8efc;
         color: #ffffff;
      }
    }
  }

  ::v-deep .el-divider--horizontal {
    margin: 20px 0;
  }

  .plugin-list {
    width: 100%;
    height: calc(100% - 110px);
    overflow: auto;
  }
}
</style>
