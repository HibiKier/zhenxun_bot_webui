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
    border: 2px solid #ffb6c1;
    outline: none;
    border-radius: 16px;
    box-sizing: border-box;
    background: #fff5f7;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .my-switch.is-checked & {
      border-color: #c4b5fd;
      background: #f5f3ff;
    }

    .my-switch.is-disabled & {
      opacity: 0.6;
    }
  }

  &__button {
    position: absolute;
    top: 2px;
    left: 2px;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    background: linear-gradient(145deg, #ffb6c1, #ff8fab);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    .my-switch.is-checked & {
      left: calc(100% - 26px);
      background: linear-gradient(145deg, #c4b5fd, #a78bfa);
      transform: scale(1.1);
    }
  }

  &__emoji {
    font-size: 14px;
    transition: all 0.3s;
    transform: scale(1);

    .my-switch.is-checked & {
      transform: scale(1.2);
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
</style>
