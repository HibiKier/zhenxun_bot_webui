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
      <div class="search-select">
        <el-select
          v-model="searchMenuType"
          placeholder="菜单类型"
          style="width: 270px"
          @change="selectMenuType"
          clearable
        >
          <el-option
            v-for="data in menuTypeList"
            :label="data"
            :value="data"
            :key="data"
          ></el-option>
        </el-select>
      </div>
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
    clickPluginType(pluginType) {
      this.activeBtn = pluginType
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
              this.menuTypeList = resp.data
            }
          } else {
            this.$message.error(resp.info)
          }
        }
      )
    },
    selectMenuType() {
      this.pltKey++
    },
  },
}
</script>

<style lang="scss" scoped>
.el-main {
  background-color: #f1f5f8;
}

.base-box {
  padding: 50px;
  width: calc(100% - 100px);
  height: calc(100% - 210px);

  .top-select {
    width: 100%;
    height: 50px;

    .top-select-btn-box {
      float: left;
      display: flex;
      background-color: #ffffff;
      height: 50px;
      width: 40%;
      border-radius: 5px;
      color: #758ea1;
      // align-items: center;
      // text-align: center;

      ::v-deep .el-divider--vertical {
        height: 25px;
        margin: 0;
        margin-top: 13px;
      }

      .top-select-btn-item {
        display: flex;
        width: 25%;
        cursor: pointer;
        height: 100%;
        align-items: center;
        justify-content: center;
      }

      .top-btn-item-select {
        color: #ffffff;
        background-color: #4d7cfe;
      }
    }

    .search-select {
      float: right;
      margin-right: 50px;
      margin-top: 5px;
    }
  }

  ::v-deep .el-divider--horizontal {
    margin: 50px 0;
  }

  .plugin-list {
    width: 100%;
    height: 100%;
    overflow: auto;
    border-radius: 10px;
  }
}
</style>
