<template>
  <div>
    <div style="display: flex; margin-bottom: 10px">
      <el-button icon="el-icon-refresh" circle @click="refresh"></el-button>
    </div>
    <el-table :data="pluginList" style="width: 100%">
      <el-table-column prop="model" label="模块" width="150"> </el-table-column>
      <el-table-column
        prop="plugin_manager.plugin_name"
        label="插件名称"
        width="200"
      >
      </el-table-column>
      <el-table-column prop="plugin_manager.author" label="作者" width="150">
      </el-table-column>
      <el-table-column prop="plugin_manager.version" label="版本" width="110">
      </el-table-column>
      <template v-if="pluginType == 'normal'">
        <el-table-column prop="plugin_manager.status" label="插件状态">
          <template slot-scope="scope">
            <el-tag
              v-if="
                scope.row.plugin_manager != null &&
                scope.row.plugin_manager.status == true
              "
              type="success"
              >启用</el-tag
            >
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="plugin_manager.block_type" label="禁用类型">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.plugin_manager.status == true"
              type="success"
              >未禁用</el-tag
            >
            <el-tag v-else type="danger">{{
              scope.row.plugin_manager.block_type
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="plugin_settings.level" label="群权限">
        </el-table-column>
        <el-table-column prop="plugin_settings.default_status" label="默认开关">
          <template slot-scope="scope">
            <el-tag
              v-if="
                scope.row.plugin_settings == null ||
                scope.row.plugin_settings.default_status == true ||
                scope.row.plugin_settings.level == null
              "
              type="success"
              >开启</el-tag
            >
            <el-tag v-else type="danger">关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="plugin_settings.limit_superuser"
          label="限制超级用户"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="
                scope.row.plugin_settings == null ||
                scope.row.plugin_settings.limit_superuser == false ||
                scope.row.plugin_settings.level == null
              "
              type="success"
              >否</el-tag
            >
            <el-tag v-else type="danger">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="plugin_settings.cmd" label="别名">
        </el-table-column>
        <el-table-column prop="plugin_settings.cost_gold" label="花费金币">
        </el-table-column>
        <el-table-column prop="plugin_settings.plugin_type[0]" label="插件类型">
        </el-table-column>
        <el-table-column prop="plugin_manager.error" label="加载状态">
          <template slot-scope="scope">
            <el-tag
              v-if="
                scope.row.plugin_manager != null &&
                scope.row.plugin_manager.error == false
              "
              type="success"
              >正常</el-tag
            >
            <el-tag v-else type="danger">错误</el-tag>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope" v-if="pluginType == 'normal'">
          <el-button
            v-if="
              scope.row.plugin_settings != null &&
              scope.row.plugin_settings.level != null
            "
            size="small"
            @click="showEditView(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑插件" :visible.sync="dialogVisible" width="400px">
      <table>
        <tr>
          <td>插件名称</td>
          <td>
            <el-input
              v-model="pluginData.plugin_manager.plugin_name"
              placeholder=""
              size="small"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>插件状态</td>
          <td>
            <el-switch
              style="margin-right: 30px"
              v-model="pluginData.plugin_manager.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="禁用"
              size="small"
            >
            </el-switch>
          </td>
        </tr>
        <tr>
          <td>禁用类型</td>
          <td>
            <el-select
              v-model="pluginData.plugin_manager.block_type"
              size="small"
              :disabled="pluginData.plugin_manager.status == true"
            >
              <el-option
                v-for="item in blockType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>群权限</td>
          <td>
            <el-input
              v-model="pluginData.plugin_settings.level"
              placeholder=""
              size="small"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>默认开关</td>
          <td>
            <el-switch
              style="margin-right: 30px"
              v-model="pluginData.plugin_settings.default_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭"
              size="small"
            >
            </el-switch>
          </td>
        </tr>
        <tr>
          <td>限制超级用户</td>
          <td>
            <el-switch
              style="margin-right: 30px"
              v-model="pluginData.plugin_settings.limit_superuser"
              active-color="#ff4949"
              inactive-color="#13ce66"
              active-text="是"
              inactive-text="否"
              size="small"
            >
            </el-switch>
          </td>
        </tr>
        <tr>
          <td>别名</td>
          <td>
            <el-input
              v-model="pluginData.plugin_settings.cmd"
              placeholder=""
              size="small"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>花费金币</td>
          <td>
            <el-input
              v-model="pluginData.plugin_settings.cost_gold"
              placeholder=""
              size="small"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>插件类型</td>
          <td>
            <el-input
              v-model="pluginData.plugin_settings.plugin_type[0]"
              placeholder=""
              size="small"
            ></el-input>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="doUpdate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PluginListTemplate",
  props: ["pluginType"],
  data() {
    return {
      pluginList: [],
      dialogVisible: false,
      pluginData: {
        model: "",
        plugin_settings: {
          level: 0,
          default_status: null,
          limit_superuser: null,
          cmd: "",
          cost_gold: 0,
          plugin_type: "",
        },
        plugin_manager: {
          plugin_name: "",
          status: null,
          error: null,
          version: 0,
          author: "",
          block_type: "all",
        },
        cd_limit: null,
        block_limit: null,
        count_limit: null,
      },
      blockType: [
        { value: "all", label: "全部" },
        { value: "group", label: "群组" },
        { value: "private", label: "私聊" },
      ],
    };
  },
  mounted() {
    this.initPluginList();
  },
  methods: {
    refresh() {
      this.initPluginList();
      this.$message({
        message: "刷新成功",
        type: "success",
      });
    },
    initPluginList() {
      this.getRequest("/webui/plugins?type_=" + this.pluginType).then(
        (resp) => {
          if (resp) {
            this.pluginList = resp.data;
          } else {
            this.$message.error("获取数据失败！");
          }
        }
      );
    },
    showEditView(data) {
      this.pluginData = JSON.parse(JSON.stringify(data));
      if (
        this.pluginData.plugin_manager.block_type == "" ||
        this.pluginData.plugin_manager.block_type == null
      ) {
        this.pluginData.plugin_manager.block_type = "all";
      }
      this.dialogVisible = true;
    },
    doUpdate() {
      if (this.pluginData.plugin_manager.status) {
        this.pluginData.plugin_manager.block_type = "";
      }
      this.postRequest("/webui/plugins", this.pluginData).then((resp) => {
        if (resp) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.initPluginList();
        }
      });
      this.dialogVisible = false;
    },
  },
};
</script>

<style>
</style>