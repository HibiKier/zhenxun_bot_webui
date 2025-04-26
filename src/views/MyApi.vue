<template>
  <div class="bg-box">
    <div class="bg-img">
      <div class="bg-cover">
        <div class="api-box">
          <div class="api-title" :class="{ rightshow: rightshow }">
            <span>IP:PORT</span>
          </div>
          <div class="api-input">
            <input
              v-model.trim="apiurl"
              @focus="inpOnfocus"
              @blur="inpOnBlur"
              type="text"
              placeholder="IP"
              spellcheck="false"
            />
            <input
              v-model.trim="port"
              @focus="inpOnfocus"
              @blur="inpOnBlur"
              type="text"
              placeholder="PORT"
              spellcheck="false"
              style="width: 100px"
            />
          </div>
          <div class="tips">
            <p>注意事项：</p>
            <p>①开发环境中修改api地址一样生效，即覆盖代理服务器的转发</p>
            <p>
              ②如果生产环境部署的资源和真寻本体<ins><b>不在</b></ins
              >同一个机器上，则输入你的服务器接口地址以及真寻的端口。最后记得修改防火墙设置哦
            </p>
          </div>
          <div class="api-btn">
            <button class="goback" @click="goBack">返回</button>
            <button class="myapi" ref="myapi" @click="changeUrl($event)">
              修改
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBaseApiUrl, setBaseApiUrl, getPort, setPort } from "@/utils/api"
import { Rain } from "@/assets/js/rain"

export default {
  name: "MyApi",
  created() {
    this.rainClass = new Rain({
      speed: [2, 40],
      hasBounce: true,
      wind_direction: 340,
      gravity: 0.05,
      maxNum: 40,
      numLevel: 5,
      drop_chance: 0.4,
      cloud: false,
    })
  },
  data() {
    return {
      port: getPort(),
      rainClass: null,
      rightshow: false,
      apiurl: getBaseApiUrl(),
      fromPageName: "",
      fromPagePath: "/",
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.fromPage = from.path
      vm.fromPageName = from.name
    })
  },
  methods: {
    goBack() {
      if (this.fromPageName) {
        this.$router.replace(this.fromPage)
      } else {
        this.$router.replace("/")
      }
    },
    changeUrl(e) {
      let x = e.clientX - this.$refs.myapi.getBoundingClientRect().left
      let y = e.clientY - this.$refs.myapi.getBoundingClientRect().top
      let span = document.createElement("span")
      span.classList.add("spanAni")
      span.style.left = x + "px"
      span.style.top = y + "px"
      this.$refs.myapi.appendChild(span)
      setTimeout(() => {
        span.remove()
        setBaseApiUrl(this.apiurl)
        setPort(this.port)
        if (this.fromPageName == "Configure") {
          this.goBack()
        } else {
          this.$router.replace("/")
        }
      }, 500)
    },
    inpOnfocus() {
      this.rightshow = true
    },
    inpOnBlur() {
      this.rightshow = false
    },
  },
  beforeDestroy() {
    this.rainClass.clearRain()
  },
}
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  background-color: var(--bg-color);
}
.title {
  font-size: 40px;
  font-family: "fzrzFont";
  width: 100%;
  text-align: center;
  color: var(--text-color);
  padding-top: 5%;
}
.api-border {
  background-color: var(--bg-color-secondary);
  border-radius: 10px;
  padding: 50px;
  margin: 2% auto;
  width: 40%;
  min-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);

  .des {
    font-size: 14px;
    color: var(--text-color-secondary);
    text-align: center;
    margin-bottom: 30px;
  }

  .label {
    color: var(--text-color-secondary);
    font-size: 14px;
    margin-bottom: 10px;
    display: block;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  gap: 20px;
  
  .el-button {
    width: 100%;
  }
}
</style>

<style>
.spanAni {
  background-color: #fff;
  position: absolute;
  transform: translate(-50%, -50%);
  animation: move 0.5s linear infinite;
  border-radius: 50%;
  pointer-events: none;
}

@keyframes move {
  from {
    width: 0;
    height: 0;
    opacity: 0.2;
  }
  to {
    width: 48rem;
    height: 48rem;
    opacity: 0;
  }
}
</style>
