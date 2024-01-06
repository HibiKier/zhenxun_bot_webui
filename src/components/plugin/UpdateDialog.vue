<template>
  <el-dialog class="dialog-class" width="570px" :visible="true" @close="close">
    <p class="tip">
      <svg-icon
        icon-class="magic"
        style="height: 20px; width: 20px"
      />施展了来自奇迹的魔法
    </p>
    <el-divider />
    <div>
      <p class="plugin-name-class">
        {{ data.plugin_name
        }}<span class="version-class">v{{ data.version }}</span>
      </p>
      <p style="color: #b8bac0">
        {{ data.module
        }}<span class="author-class" v-if="data.author"
          >@{{ data.author }}</span
        >
      </p>
    </div>
    <div class="update-info">
      <el-form :model="updateData">
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <div>
                <span slot="label">默认开关</span>
                <MySwitch v-model="updateData.default_status" />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <div>
                <span slot="label">限制超级用户</span>
                <MySwitch v-model="updateData.limit_superuser" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item>
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
            <el-form-item>
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
            <el-form-item>
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
            <el-form-item>
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
  </el-dialog>
</template>

<script>
import MySwitch from "@/components/ui/MySwitch"

export default {
  name: "UpdateDialog",
  props: {
    data: Object,
    menuTypeList: Array,
  },
  components: {
    MySwitch,
  },
  data() {
    return {
      updateData: {
        default_status: false,
        limit_superuser: false,
        cost_gold: 0,
        cmd: 0,
        menu_type: "normal",
        level: 0,
        block_type: null,
      },
    }
  },
  methods: {
    close() {
      this.$emit("close")
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

    span {
      color: #758ea1;
      font-size: 17px;
    }

    ::v-deep .el-input__inner {
      width: 172px;
    }

    ::v-deep .el-select {
      width: 100%;

      .el-input {
        width: 172px;
      }
    }
  }
}
</style>
