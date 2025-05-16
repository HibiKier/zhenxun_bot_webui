<template>
  <div
    class="my-switch"
    :class="{
      'is-disabled': disabled,
      'is-checked': myValue,
    }"
    @click="toggleSwitch"
  >
    <input
      v-model="myValue"
      type="checkbox"
      class="my-switch__input"
      :disabled="disabled"
    />
    <span class="my-switch__core">
      <span class="my-switch__button">
        <span v-if="myValue" class="my-switch__emoji">🌸</span>
        <span v-else class="my-switch__emoji">🌼</span>
      </span>
    </span>
  </div>
</template>

<script>
export default {
  name: "MySwitch",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      myValue: this.value,
    }
  },
  watch: {
    value(newVal) {
      this.myValue = newVal
    },
  },
  methods: {
    toggleSwitch() {
      if (!this.disabled) {
        this.myValue = !this.myValue
        this.$emit("input", this.myValue)
        this.$emit("change", this.myValue)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.my-switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  font-size: 14px;
  line-height: 1;
  height: 32px;
  vertical-align: middle;
  cursor: pointer;

  &.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &__input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0;
  }

  &__core {
    margin: 0;
    display: inline-block;
    position: relative;
    width: 60px;
    height: 32px;
    border: 2px solid var(--border-color);
    outline: none;
    border-radius: 16px;
    box-sizing: border-box;
    background: var(--bg-color-secondary);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: var(--el-box-shadow-lighter);

    .my-switch.is-checked & {
      border-color: var(--primary-color);
      background: var(--primary-color-light-9);
    }

    .my-switch.is-disabled & {
      opacity: 0.6;
      background: var(--el-fill-color-light);
      border-color: var(--border-color-light);
    }
  }

  &__button {
    position: absolute;
    top: 2px;
    left: 2px;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    background: linear-gradient(
      145deg,
      var(--primary-color-light),
      var(--primary-color)
    );
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--el-box-shadow-lighter);

    .my-switch.is-checked & {
      left: calc(100% - 26px);
      background: linear-gradient(
        145deg,
        var(--primary-color),
        var(--primary-color-light)
      );
      transform: scale(1.1);
    }

    .my-switch.is-disabled & {
      background: var(--el-fill-color);
      box-shadow: none;
    }
  }

  &__emoji {
    font-size: 14px;
    transition: all 0.3s;
    transform: scale(1);
    color: var(--text-color);

    .my-switch.is-checked & {
      transform: scale(1.2);
      color: var(--primary-color);
    }

    .my-switch.is-disabled & {
      color: var(--text-color-disabled);
    }
  }

  &:active:not(.is-disabled) {
    .my-switch__button {
      width: 28px;

      .my-switch.is-checked & {
        left: calc(100% - 30px);
      }
    }
  }
}

/* 响应式调整 */
@media (max-width: 640px) {
  .my-switch {
    height: 28px;

    &__core {
      width: 52px;
      height: 28px;
    }

    &__button {
      width: 20px;
      height: 20px;
    }

    &__emoji {
      font-size: 12px;
    }
  }
}
</style>
