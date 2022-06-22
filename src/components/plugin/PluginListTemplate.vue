<template>
  <div class="box-background">
    <div v-for="(plugin,index) in pluginList.slice(0,4)" :key="index" class="card-box">
        <div class="author-version">v0.1.0.0</div>
        <div class="author-box">
            <div class="plugin-name">幻影坦克</div>
            <div class="author-name">@neigui1</div>
        </div>
        <div class="plugin-other-name">(nonebot_plugin_miragetank)</div>
        <div class="options-box">
            <div class="plugin-status">默认开关
                <div class="switch" style="margin-left: 1rem;">
                    <input id="switch-1" type="checkbox">
                    <label for="switch-1"></label>
                </div>
            </div>
            <div class="plugin-switch">
                <PlayButton :pluginSta="pluginSta" @func="getMsgFormSon"></PlayButton>
            </div>
            <div class="plugin-super">限制超级用户
                <div class="switch" style="margin-left: 1rem;">
                    <input id="switch-2" type="checkbox">
                    <label for="switch-2"></label>
                </div>
            </div>
            <div class="plugin-cost">花费金币:
                <div class="form">
                    <input type="text" class="form__input" placeholder="5">
                </div>
            </div>
            <div class="plugin-type">插件类型: 
                <div class="chip">
                    <p>群内小游戏</p>
                    <div class="chip__close">
                        <ion-icon name="close"></ion-icon>
                    </div>
                </div>
            </div>
            <div class="plugin-Authority">群权限
                <RateSlider></RateSlider>
            </div>
        </div>
        
        <div class="edit-btn">
            <div class="btn btn__primary">
                <p>配置项</p>
            </div>
            <div class="btn btn__secondary">
                <p>编辑</p>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { verifyIdentity } from "@/utils/api";
import RateSlider from "@/components/UI/RateSlider";
import PlayButton from "@/components/UI/PlayButton";
export default {
  name: "PluginListTemplate",
  components: {
    RateSlider,
    PlayButton
  },
  props: ["pluginType"],
  data() {
    return {
      pluginSta:true,
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
    getMsgFormSon(data){
      this.pluginSta = data
      console.log(this.pluginSta)
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
:root {
    --primary-light: #8abdff;
    --primary: #2ebb96;
    --primary-dark: #238067;
    --white: #FFFFFF;
    --greyLight-1: #E4EBF5;
    --greyLight-2: #c8d0e7;
    --greyLight-3: #bec8e4;
    --greyDark: #9baacf;
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
  height: 20rem;
  min-height: 20rem;
  padding: 2rem;
  overflow: hidden;
  border-radius: 3rem;
  margin: 1rem;
  box-shadow: 0.8rem 0.8rem 1.4rem var(--greyLight-2), -0.2rem -0.2rem 1.8rem var(--white);
}
.author-version{
    position: absolute;
    line-height: 5rem;
    width: 10rem;
    height: 4rem;
    right: -3rem;
    top:0rem;
    text-align: center;
    background-color: #2da44e;
    transform: rotate(45deg);
    user-select: none;
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
.plugin-other-name{
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
/*  PLAY BUTTON  */
.circle {
    position: absolute;
    right: 0;
    top:7rem;
    width: 9rem;
    height: 9rem;
    border-radius: 1rem;
}

.circle__btn {
    position: relative;
    width: 6rem;
    height: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-size: 3.2rem;
    color: var(--primary);
    z-index: 300;
    background: var(--greyLight-1);
    box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
    cursor: pointer;
}

.circle__btn.shadow {
    box-shadow: inset 0.2rem 0.2rem 0.5rem var(--greyLight-2), inset -0.2rem -0.2rem 0.5rem var(--white);
}

.circle__btn .play {
    position: absolute;
    opacity: 0;
    transition: all 0.2s linear;
}

.circle__btn .play.icon-visibility {
    opacity: 1;
}

.circle__btn .pause {
    position: absolute;
    transition: all 0.2s linear;
}

.circle__btn .pause.icon-visibility {
    opacity: 0;
}

.circle__back-1,
.circle__back-2 {
    position: absolute;
    display: block;
    top:0;
    left: 0;
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    filter: blur(1px);
    z-index: 100;
}

.circle__back-1 {
    box-shadow: 0.4rem 0.4rem 0.8rem var(--greyLight-2), -0.4rem -0.4rem 0.8rem var(--white);
    background: linear-gradient(to bottom right, var(--greyLight-2) 0%, var(--white) 100%);
    -webkit-animation: waves 4s linear infinite;
    animation: waves 4s linear infinite;
}

.circle__back-1.paused {
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
}

.circle__back-2 {
    box-shadow: 0.4rem 0.4rem 0.8rem var(--greyLight-2), -0.4rem -0.4rem 0.8rem var(--white);
    -webkit-animation: waves 4s linear 2s infinite;
    animation: waves 4s linear 2s infinite;
}

.circle__back-2.paused {
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
}
@keyframes waves {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        opacity: 1;
    }

    100% {
        transform: scale(2);
        opacity: 0;
    }
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
.plugin-cost {
  display: flex;
  align-items: center;
}
.form{
  margin-left: 1rem;
}

.form__input {
  width: 6rem;
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