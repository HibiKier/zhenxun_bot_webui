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

<style scoped>
* {
  box-sizing: border-box;
}
input::-webkit-input-placeholder {
  color: #3a3637c7;
  user-select: none;
}
.bg-box {
  height: 100vh;
  width: 100%;
  background: #04060a;
}
.bg-img {
  width: 100%;
  height: 100%;
  background: url(../assets/image/bg.jfif) no-repeat;
  background-size: 100% 100%;
}
.bg-cover {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px) saturate(150%);
}
.api-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 28rem;
  height: 20rem;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  overflow: hidden;
}
.api-title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 5rem;
  overflow: hidden;
  backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.75);
}

.api-title::after {
  content: "";
  position: absolute;
  top: 100%;
  right: 3rem;
  width: 4rem;
  height: 4rem;
  background: url(../assets/image/inp_p.png) no-repeat;
  background-size: 100% 100%;
}
.rightshow.api-title::after {
  top: 0.5rem;
}
.api-title > span {
  color: #04060a;
  font-size: 1.5rem;
  font-family: Inter, sans-serif;
  font-weight: 700;
  user-select: none;
}
.api-input {
  margin: 0 2rem;
  width: 24rem;
  height: 2.5rem;
  display: flex;
}
.api-input > input {
  padding: 0 1rem;
  width: 100%;
  height: 100%;
  outline: none;
  color: #333;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: inset 0px 0px 3px 0px rgb(31 38 135 / 37%);
  backdrop-filter: blur(1px);
  transition: all 0.2s ease;
}
.api-input > input:hover {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: inset 0px 0px 3px 1px rgb(31 38 135 / 37%);
}
.api-input > input:focus {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: inset 0px 0px 3px 1px rgb(31 38 135 / 37%);
}

.api-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 2rem 1rem 2rem;
  width: 24rem;
  height: 2rem;
}
.myapi,
.goback {
  position: relative;
  flex: 1;
  height: 2.5rem;
  border: none;
  outline: none;
  color: white;
  text-indent: 1rem;
  font-size: 1.15rem;
  letter-spacing: 1rem;
  border-radius: 4px;
  background-color: #2ea44f;
  transition: all 0.1s ease-in-out;
  user-select: none;
  overflow: hidden;
}
.goback {
  margin-right: 1rem;
}
.myapi::before,
.goback::before {
  content: "";
  position: absolute;
  top: 100%;
  right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  background: url(../assets/image/inp_c.png) no-repeat;
  background-size: 100% 100%;
}
.goback::before {
  left: 1rem;
  background: url(../assets/image/login.png) no-repeat;
  background-size: 100% 100%;
}
.myapi:hover,
.goback:hover {
  background-color: #289045;
}
.myapi:hover.myapi::before,
.goback:hover.goback::before {
  top: 0;
}
.tips {
  margin: 0 2rem;
  text-align: start;
  font-size: 0.8rem;
}
.tips > p {
  padding-left: 0.8rem;
  text-indent: -0.8rem;
  margin-bottom: 0.4rem;
}
@media screen and (max-width: 600px) {
  .api-box {
    margin: 0 1rem;
  }
  .api-input,
  .api-btn {
    width: 90%;
  }
  .api-title::after {
    right: 1rem;
  }
  .myapi::before {
    right: 0.25rem;
  }
  .goback::before {
    left: 0.25rem;
  }
  .api-box {
    height: 22.5rem;
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
