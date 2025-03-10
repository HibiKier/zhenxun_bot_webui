<template>
  <div class="neon-input-container">
    <!-- 粒子动画层 -->
    <div class="particle-canvas" ref="canvas"></div>

    <!-- 主输入框 -->
    <div class="input-wrapper" @mouseenter="playHoverAnim">
      <el-input
        v-model="innerValue"
        :placeholder="placeholder"
        class="neon-input"
        :class="{ activated: isFocused }"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="input"
      >
        <i slot="suffix" class="el-input-icon" v-if="suffixIcon">
          <svg-icon :icon-class="suffixIcon" class="input-icon" />
        </i>
      </el-input>
      <div class="holographic-overlay"></div>
      <div class="glowing-border">
        <div class="light-bar"></div>
      </div>
      <transition name="icon-bounce">
        <i v-if="isFocused" class="el-icon-connection icon-float"></i>
      </transition>
    </div>
  </div>
</template>

<script>
import { TweenMax } from "gsap"
import SvgIcon from "../SvgIcon/SvgIcon.vue"

export default {
  props: {
    value: [String, Number],
    placeholder: String,
    suffixIcon: String,
  },
  data() {
    return {
      isFocused: false,
      particles: [],
      canvas: null,
      ctx: null,
      innerValue: this.value,
    }
  },
  mounted() {
    console.log("suffixIcon", this.suffixIcon)

    this.initParticleCanvas()
    window.addEventListener("resize", this.resetCanvas)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resetCanvas)
  },
  methods: {
    input(value) {
      this.innerValue = value
      this.$emit("input", value)
    },

    initParticleCanvas() {
      this.canvas = this.$refs.canvas
      this.ctx = this.canvas.getContext("2d")
      this.resetCanvas()
      this.animateParticles()
    },
    resetCanvas() {
      this.canvas.width = this.$el.offsetWidth
      this.canvas.height = this.$el.offsetHeight
    },
    createParticle(x, y) {
      return {
        x,
        y,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        life: 1,
      }
    },
    animateParticles() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      // 只在激活状态显示粒子
      if (this.isFocused) {
        // 添加新粒子
        if (Math.random() < 0.3) {
          this.particles.push(
            this.createParticle(
              Math.random() * this.canvas.width,
              this.canvas.height
            )
          )
        }

        this.particles.forEach((p, index) => {
          p.x += p.speedX
          p.y += p.speedY
          p.life -= 0.02

          // 绘制粒子
          this.ctx.beginPath()
          this.ctx.fillStyle = `rgba(110, 230, 255, ${p.life})`
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          this.ctx.fill()

          // 移除失效粒子
          if (p.life < 0) {
            this.particles.splice(index, 1)
          }
        })
      }

      requestAnimationFrame(this.animateParticles)
    },
    handleFocus(e) {
      this.isFocused = true
      this.$emit("focus", e)
      TweenMax.to(".icon-float", 0.6, {
        y: "-=20",
        opacity: 1,
        ease: "Bounce.easeOut",
      })
    },
    handleBlur(e) {
      this.isFocused = false
      this.$emit("blur", e)
    },
    playHoverAnim() {
      if (!this.isFocused) {
        TweenMax.to(".glowing-border", 0.5, {
          opacity: 0.8,
          yoyo: true,
          repeat: 1,
        })
      }
    },
  },
  computed: {
    // 保持原有computed属性
  },
}
</script>

<style lang="scss" scoped>
.neon-input-container {
  position: relative;
  perspective: 1000px;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.input-wrapper {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.input-wrapper:hover {
  transform: rotateX(1deg) rotateY(1deg) translateZ(10px);
}

.neon-input.activated .input-wrapper {
  transform: translateZ(20px);
}

.neon-input ::v-deep .el-input__inner {
  padding: 20px 30px;
  font-size: 15px;
  letter-spacing: 1px;
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid transparent;
  border-radius: 5px;
  color: #000;
  /* text-shadow: 0 0 8px rgba(251, 228, 228, 0.5); */
  transition: all 0.4s ease;
}

.glowing-border {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 14px;
  /* background: linear-gradient(45deg, #6ee6ff 0%, #a966ff 50%, #ff76d0 100%); */
  opacity: 0;
  z-index: -1;
  filter: blur(15px);
  transition: opacity 0.3s;
}

.holographic-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    120deg,
    rgba(110, 230, 255, 0.1) 0%,
    rgba(169, 102, 255, 0.1) 50%,
    rgba(255, 118, 208, 0.1) 100%
  );
  border-radius: 12px;
  mix-blend-mode: overlay;
  opacity: 0.5;
  z-index: -1;
}

.icon-float {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #6ee6ff;
  font-size: 24px;
  opacity: 0;
  filter: drop-shadow(0 0 8px rgba(255, 173, 210, 0.5));
}

/* 图标入场动画 */
.icon-bounce-enter-active {
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
.icon-bounce-enter {
  opacity: 0;
  transform: translateY(20px) scale(0.5);
}

/* 输入框激活状态 */
.neon-input.activated ::v-deep .el-input__inner {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 30px rgba(255, 173, 210, 0.2),
    inset 0 0 10px rgba(255, 255, 255, 0.1);
}

/* 悬浮微交互 */
.neon-input ::v-deep .el-input__inner:hover {
  transform: translateY(-2px);
}

.neon-input ::v-deep .el-input__inner:hover + .el-input__suffix {
  transform: translateY(-2px);
}

::v-deep .el-input__suffix {
  right: 10px;
  top: 3px;
}
</style>
