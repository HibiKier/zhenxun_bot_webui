<template>
  <div class="box-background">
    <div v-for="(plugin,index) in pluginEditList.slice(0,49)" :key="index" :class="{pstatus:!plugin.plugin_manager.status}" class="card-box">
        <div class="plugin-version" >{{'v'+plugin.plugin_manager.version}}</div>
        <div class="author-box">
            <div class="plugin-name">{{plugin.plugin_manager.plugin_name}}</div>
            <div class="author-name">{{'@'+plugin.plugin_manager.author}}</div>
        </div>
        <div class="plugin-model-name">{{'('+plugin.model+')'}}</div>
        <div class="options-box">
            <div class="plugin-status" :class="{disabled:!isEdit[index]}">默认开关
                <div class="switch" style="margin-left: 1rem;">
                    <input :id="'switch-'+index" v-model="plugin.plugin_settings.default_status" type="checkbox">
                    <label :for="'switch-'+index"></label>
                </div>
            </div>
            <div class="plugin-switch" :class="{disabled:!isEdit[index]}">
                <PlayButton :pluginSta="plugin.plugin_manager.status" :tindex="index" @func="getMsgFormPlayButton"></PlayButton>
                <div style="margin-left:-1rem;" v-show="plugin.plugin_manager.block_type">
                  <div class="block-type">禁用类型</div>
                  <SegmentedControl :block_type="plugin.plugin_manager.block_type" :tindex="index" @func="getMsgFormSegmentedControl"></SegmentedControl>
                </div>
            </div>
            <div class="plugin-super" :class="{disabled:!isEdit[index]}">限制超级用户
                <div class="switch"  style="margin-left: 1rem;">
                    <input :id="'switch1-'+index" v-model="plugin.plugin_settings.limit_superuser" type="checkbox">
                    <label :for="'switch1-'+index"></label>
                </div>
            </div>
            <div class="plugin-cost" :class="{disabled:!isEdit[index]}">花费金币:
                <div class="form">
                    <input type="text" v-model="plugin.plugin_settings.cost_gold" class="form__input" placeholder="0">
                </div>
            </div>
            <div class="plugin-type" :class="{disabled:!isEdit[index]}">插件类型: 
              <div class="form">
                    <input type="text" v-model="plugin.plugin_settings.plugin_type[0]" class="form__input" placeholder="无">
                </div>
                <!-- <div class="chip">
                    <p>群内小游戏</p>
                    <div class="chip__close">
                        <ion-icon name="close"></ion-icon>
                    </div>
                </div> -->
            </div>
            <div class="plugin-other-name" :class="{disabled:!isEdit[index]}">插件别名: 
              <div class="form">
                    <input type="text" v-model="plugin.plugin_settings.cmd" class="form__input" placeholder="无">
                </div>
            </div>
            <div class="plugin-Authority" :class="{disabled:!isEdit[index]}">群权限
                <RateSlider :level="plugin.plugin_settings.level" :tindex="index" @func="getMsgFormRateSlider"></RateSlider>
            </div>
        </div>
        
        <div v-if="!isEdit[index]" class="edit-btn">
            <div class="btn btn__primary" @click="showEditOpt(plugin.plugin_config,index)" v-if="plugin.plugin_config">
                <p>配置项</p>
            </div>
            <div class="btn btn__secondary" @click="isEdit.splice(index,1,true)">
                <p>编辑</p>
            </div>
        </div>

        <div v-if="isEdit[index]" class="edit-btn">
            <div class="btn btn__primary" @click="doUpdate(index)">
                <p>保存</p>
            </div>
            <div class="btn btn__secondary" @click="cancelEdit(index)">
                <p>取消</p>
            </div>
        </div>
    </div>
    <EditOpt v-if="editOptShow" :editOptData="editOpt" @close="closeEditOptShow" @changeOpt="changeEditOpt"></EditOpt>
  </div>
</template>

<script>
import { verifyIdentity } from "@/utils/api";
import RateSlider from "@/components/UI/RateSlider";
import PlayButton from "@/components/UI/PlayButton";
import SegmentedControl from "@/components/UI/SegmentedControl";
import EditOpt from "@/components/UI/EditOpt";

export default {
  name: "PluginListTemplate",
  components: {
    RateSlider,
    PlayButton,
    SegmentedControl,
    EditOpt
  },
  props: ["pluginType"],
  data() {
    return {
      editOpt:{
        data:{},
        index:-1
      },
      editOptShow: false,
      isEdit:[],
      pluginSta:true,
      pluginEditList: [],
      pluginList: [],
      dialogVisible: false,
      configDialogVisible: false,
      pluginData: {
        model: "",
        plugin_settings: {
          level: 0,
          default_status: false,
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
    changeEditOpt(data,index){
      console.log(index);
      let pluginConfigData = JSON.parse(JSON.stringify(this.pluginEditList[index]));
      pluginConfigData.plugin_config = data;
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
      this.closeEditOptShow();
    },
    showEditOpt(data,index){
      this.editOpt.index = index;
      this.editOpt.data = data;
      this.editOptShow = true;
    },
    closeEditOptShow(){
      this.editOpt = {
        data:{},
        index:-1
      },
      this.editOptShow = false;
    },
    cancelEdit(index){
      // this.initPluginList();
      this.isEdit.splice(index,1,false);
      this.pluginEditList.splice(index,1,JSON.parse(JSON.stringify(this.pluginList[index])));
      // this.pluginEditList[index] = this.pluginList[index];
    },
    getMsgFormPlayButton(index,data){
      this.pluginEditList[index].plugin_manager.status = data;
      if(this.pluginEditList[index].plugin_manager.status == false && this.pluginEditList[index].plugin_manager.block_type == ""){
        this.pluginEditList[index].plugin_manager.block_type = "全部";
      }else if(this.pluginEditList[index].plugin_manager.status == true){
        this.pluginEditList[index].plugin_manager.block_type = "";
      }
    },
    getMsgFormSegmentedControl(index,data){
      this.pluginEditList[index].plugin_manager.block_type = data;
    },
    getMsgFormRateSlider(index,data){
      this.pluginEditList[index].plugin_settings.level = data;
    },
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
            this.pluginEditList = JSON.parse(JSON.stringify(this.pluginList));
            this.isEdit = new Array(this.pluginList.length).fill(false);
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
    doUpdate(index) {
      this.isEdit[index] = false;
      // 修复回传数据列表变成字符串的问题
      let postConfigData =JSON.parse(JSON.stringify(this.pluginEditList[index]));//不提交原配置项而是一个副本
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

<style scoped>
.disabled {
    pointer-events: none;
    cursor: default;
}
.box-background{
  display: flex;
  width:100%;
  height:100%;
  justify-content: center;
  flex-flow: wrap;
  background: var(--greyLight-1);
}
.card-box{
  position: relative;
  width: 25rem;
  min-width: 25rem;
  height: 23rem;
  min-height: 23rem;
  padding: 2rem;
  overflow: hidden;
  border-radius: 3rem;
  margin: 1rem;
  box-shadow: 0.8rem 0.8rem 1.4rem var(--greyLight-2), -0.2rem -0.2rem 1.8rem var(--white);
}
.plugin-version{
    position: absolute;
    line-height: 5rem;
    width: 10rem;
    height: 4rem;
    right: -3rem;
    top:0rem;
    font-size: 1.2rem;
    text-align: center;
    /* background-color: #2da44e; */
    background-color: var(--primary);
    transform: rotate(45deg);
    user-select: none;
}
.card-box.pstatus {
  --primary: hsla(356,72%,44%,1);
  --primary-dark: rgba(207,34,46,1);
}
.author-box{
    display: flex;
    height: 1.5rem;
    line-height: 1.5rem;
}
.author-name{
    margin-left: 0.5rem;
    color: #57606a;
}
.plugin-name{
    font-size: 1.5rem;
    font-weight: 700;
    color: #0969da;
}
.plugin-switch{
  position: absolute;
  right: 2rem;
  top:3rem;
}
.plugin-model-name{
    font-size: 1.25rem;
    font-weight: 700;
    color: #0969da;
    text-align: start;
}
.options-box>div{
    font-size: 1.15rem;
    margin:0.8rem 0;
    user-select: none;
}
.edit-btn{
    position: absolute;
    display: flex;
    width: 100%;
    bottom: 1rem;
    left: 0;
    justify-content: space-around;
}
.plugin-status,.plugin-super{
    display: flex;
    align-items: center;
}
.block-type{
  text-align:start ;
  height: 2rem;
  line-height: 2rem;
  margin: 0.5rem 0 0.8rem 0.5rem;
}
 /*  BUTTONS  */
.btn {
    width: 10rem;
    height: 3rem;
    border-radius: 1rem;
    box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
    justify-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    transition: 0.3s ease;
}

.btn__primary {
    background: var(--primary);
    box-shadow: inset 0.2rem 0.2rem 1rem var(--primary-light), inset -0.2rem -0.2rem 1rem var(--primary-dark), 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
    color: var(--greyLight-1);
}

.btn__primary:hover {
    color: var(--white);
}

.btn__primary:active {
    box-shadow: inset 0.2rem 0.2rem 1rem var(--primary-dark), inset -0.2rem -0.2rem 1rem var(--primary-light);
}

.btn__secondary {
    color: var(--greyDark);
}

.btn__secondary:hover {
    color: var(--primary);
}

.btn__secondary:active {
    box-shadow: inset 0.2rem 0.2rem 0.5rem var(--greyLight-2), inset -0.2rem -0.2rem 0.5rem var(--white);
}

.btn p {
    font-size: 1.3rem;
}

 /*  SWITCH  */
.switch {
  width: 4rem;
}

.switch label {
  display: flex;
  align-items: center;
  width: 100%;
  height: 2rem;
  box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
  background: rgba(255, 255, 255, 0);
  position: relative;
  cursor: pointer;
  border-radius: 1.6rem;
}

.switch label::after {
  content: "";
  position: absolute;
  left: 0.4rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: var(--greyDark);
  transition: all 0.4s ease;
}

.switch label::before {
  content: "";
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(330deg, var(--primary-dark) 0%, var(--primary) 50%, var(--primary-light) 100%);
  opacity: 0;
  transition: all 0.4s ease;
}

.switch input:checked~label::before {
  opacity: 1;
}

.switch input {
    display: none;
}

.switch input:checked~label::after {
  left: 50%;
  background: var(--greyLight-1);
}

/*  RANGE-SLIDER  */
.plugin-Authority{
  display: flex;
  width: 100%;
}
/*  FORM  */
.plugin-cost , .plugin-other-name{
  display: flex;
  align-items: center;
}
.plugin-other-name .form__input{
  width: 100%;
}
.form{
  margin-left: 1rem;
}

.form__input {
  width: 5rem;
  height: 2rem;
  border: none;
  border-radius: 1rem;
  font-size: 1.2rem;
  padding:0 1.4rem;
  box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
  background: none;
  font-family: inherit;
  color: var(--greyDark);
}

.form__input::-moz-placeholder {
  color: var(--greyLight-3);
}

.form__input:-ms-input-placeholder {
  color: var(--greyLight-3);
}

.form__input::placeholder {
  color: var(--greyLight-3);
}

.form__input:focus {
  outline: none;
  box-shadow: inset 0.2rem 0.2rem 0.5rem var(--greyLight-2), inset -0.2rem -0.2rem 0.5rem var(--white);
}

/*  CHIP  */
.plugin-type{
    display: flex;
    align-items: center;
}
.chip {
    margin-left: 1rem;
    justify-self: center;
    width: 9rem;
    height: 2rem;
    border-radius: 1rem;
    box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chip p {
    font-size: 1rem;
    padding-left: 1rem;
    color: var(--greyDark);
}
.chip__close {
    width: 2rem;
    height: 1rem;
    display: flex;
    font-size: 1rem;
    margin-right: 0.5rem;
    color: var(--greyLight-3);
    cursor: pointer;
    justify-content: center;
    align-items: center;
}
</style>