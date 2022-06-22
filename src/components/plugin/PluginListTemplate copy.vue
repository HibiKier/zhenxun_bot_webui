<template>
  <div>
    <div style="display: flex; margin-bottom: 10px">
      <el-button icon="el-icon-refresh" circle @click="refresh"></el-button>
    </div>
    <el-table :data="pluginList" style="width: 100%;" height="calc(100vh - 213px)">
      <el-table-column  prop="model" label="模块" width="150" > </el-table-column>
      <el-table-column
        prop="plugin_manager.plugin_name"
        label="插件名称"
        width="200"
      >
      </el-table-column>
      <el-table-column prop="plugin_manager.author"  label="作者" width="150">
      </el-table-column>
      <el-table-column prop="plugin_manager.version"  label="版本" width="110">
      </el-table-column>
      <template v-if="pluginType == 'normal'">
        <el-table-column prop="plugin_manager.status"  label="插件状态">
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
        <el-table-column prop="plugin_manager.block_type"  label="禁用类型">
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
        <el-table-column prop="plugin_settings.level"  label="群权限">
        </el-table-column>
        <el-table-column prop="plugin_settings.default_status"  label="默认开关">
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
        <el-table-column prop="plugin_settings.cmd"  label="别名">
        </el-table-column>
        <el-table-column prop="plugin_settings.cost_gold"  label="花费金币">
        </el-table-column>
        <el-table-column prop="plugin_settings.plugin_type[0]"  label="插件类型">
        </el-table-column>
        <el-table-column prop="plugin_manager.error"  label="加载状态">
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
      <el-table-column  label="配置项" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.plugin_config != null">
            <el-button size="small" @click="showPluginConfigEditVie(scope.row)"
              >配置项</el-button
            >
          </span>
        </template>
      </el-table-column>
      <el-table-column  label="操作" width="150" v-if="pluginType == 'normal'">
        <template slot-scope="scope">
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
    <el-dialog title="编辑插件" :visible.sync="dialogVisible">
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
    <el-dialog
      title="编辑配置项"
      :visible.sync="configDialogVisible"
      custom-class="edit-opt"
    >
      <table></table>
      <el-table :data="pluginData.plugin_config">
        <el-table-column prop="key" label="键"> </el-table-column>
        <el-table-column label="值">
          <template slot-scope="scope">
            <el-input
              v-model="pluginData.plugin_config[scope.row.id].value"
              placeholder="请输入内容"
              size="small"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="help_" label="说明"> </el-table-column>
        <el-table-column label="默认值">
          <template slot-scope="scope">
            <span v-if="scope.row.default_value == true"> True </span>
            <span v-else-if="scope.row.default_value == false"> False </span>
            <span v-else>
              {{ scope.row.default_value }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="configDialogVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="doConfigUpdate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { verifyIdentity } from "@/utils/api";

export default {
  name: "PluginListTemplate",
  props: ["pluginType"],
  data() {
    return {
      pluginList: [],
      dialogVisible: false,
      configDialogVisible: false,
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
        plugin_config: [],
        cd_limit: null,
        block_limit: null,
        count_limit: null,
      },
      configsType: [],
      blockType: [
        { value: "all", label: "全部" },
        { value: "group", label: "群组" },
        { value: "private", label: "私聊" },
      ],
    };
  },
  mounted() {
    verifyIdentity().then((res)=>{
      if(res == "true"){
        this.initPluginList();
      }
    });
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
    showPluginConfigEditVie(data) {
      // 假数据
      if (data.plugin_settings == null) {
        data.plugin_settings = {
          level: null,
          default_status: null,
          limit_superuser: null,
          cmd: "",
          cost_gold: 0,
          plugin_type: "",
        };
      }
      this.pluginData = JSON.parse(JSON.stringify(data));
      for (var i = 0; i < this.pluginData.plugin_config.length; i++) {
        if (this.pluginData.plugin_config[i].value instanceof Array) {
          this.pluginData.plugin_config[i].value =
            this.pluginData.plugin_config[i].value.join(",");
          this.configsType.push({ index: i, type: "list" });
        } else {
          this.pluginData.plugin_config[i].value = String(
            this.pluginData.plugin_config[i].value
          );
        }
      }
      this.configDialogVisible = true;
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
      // 修复回传数据列表变成字符串的问题
      let postConfigData =JSON.parse(JSON.stringify(this.pluginData));//不提交原配置项而是一个副本
      if (postConfigData.plugin_manager.status) {
        postConfigData.plugin_manager.block_type = "";
      }
      postConfigData.plugin_config = null;
      if(postConfigData.plugin_settings.cmd){
        postConfigData.plugin_settings.cmd = postConfigData.plugin_settings.cmd.replace('，', ',');//逗号转换
      }
      this.postRequest("/webui/plugins", postConfigData).then((resp) => {
        //先判断是否有返回数据
        if (resp && resp.code == 200) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.initPluginList();
        } else {
          //修改失败也刷新一次配置
          if(resp && resp.data)
            this.$message.error(resp.data);
          else
            this.$message.error("修改失败");
          this.initPluginList();
        }
      });
      this.dialogVisible = false;
    },
    doConfigUpdate() {
      let pluginConfigData = JSON.parse(JSON.stringify(this.pluginData));
      pluginConfigData.plugin_manager = null;
      pluginConfigData.plugin_settings = null;


      this.postRequest("/webui/plugins", pluginConfigData).then((resp) => {
        if (resp && resp.code == 200) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.initPluginList();
        } else {
           //修改失败也刷新一次配置
          if(resp && resp.data)
            this.$message.error(resp.data);
          else
            this.$message.error("修改失败");
          this.initPluginList();
        }
      });
      this.configDialogVisible = false;
    },
  },
};
</script>

<style>

.el-dialog__body{
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-dialog{
  width: 25%;
}
.edit-opt{
  width: 50%;
}
@media screen  and (max-width:600px) {
  .el-dialog__body{
    padding: 0!important;
    width: 100%;
  }
  .el-dialog__body > table > tr >td{
    padding-bottom: 0.5rem;
  }
  .el-dialog{
    margin: 0 auto!important;
    top:20%;
    width: 90%!important;
  }
  .edit-opt{
    margin: 0 auto!important;
    top:25%;
    width: 95%!important;
  }
  .edit-opt > .el-dialog__body{
    padding: 0;
    width: 100%;
  }
}
</style>