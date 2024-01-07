<template>
  <div class="button r" id="button-1">
    <input
      v-model="myValue"
      @input="() => $emit('input', myValue)"
      type="checkbox"
      class="checkbox"
    />
    <div class="knobs"></div>
    <div class="layer"></div>
  </div>
</template>

<script>
export default {
  name: "MySwitch",
  props: ["value"],
  data() {
    return {
      myValue: true,
    }
  },
  mounted() {
    this.myValue = !this.value
  },
}
</script>
<!-- @input="$emit('input', $event.target.value)" -->
<style lang="scss" scoped>
* {
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

*:focus {
  outline: none;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
  background-color: #f1f9f9;
}

#app-cover {
  display: table;
  width: 600px;
  margin: 40px auto;
  counter-reset: button-counter;
}

.row {
  display: table-row;
}

.toggle-button-cover {
  display: table-cell;
  position: relative;
  width: 200px;
  height: 140px;
  box-sizing: border-box;
}

.button-cover {
  height: 100px;
  margin: 20px;
  background-color: #fff;
  box-shadow: 0 10px 20px -8px #c5d6d6;
  border-radius: 4px;
}

.button-cover:before {
  counter-increment: button-counter;
  content: counter(button-counter);
  position: absolute;
  right: 0;
  bottom: 0;
  color: #d7e3e3;
  font-size: 12px;
  line-height: 1;
  padding: 5px;
}

.button-cover,
.knobs,
.layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.button {
  position: relative;
  // top: 50%;
  width: 76px;
  height: 36px;
  // margin: -20px auto 0 auto;
  overflow: hidden;
}

.button.r,
.button.r .layer {
  border-radius: 100px;
}

.button.b2 {
  border-radius: 2px;
}

.checkbox {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 3;
}

.knobs {
  z-index: 2;
}

.layer {
  width: 100%;
  background-color: #ebf7fc;
  transition: 0.3s ease all;
  z-index: 1;
}

/* Button 1 */
#button-1 .knobs:before {
  content: "YES";
  position: absolute;
  top: 4px;
  left: 4px;
  width: 22px;
  height: 10px;
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  padding: 9px 4px;
  background-color: #03a9f4;
  border-radius: 50%;
  transition: 0.3s cubic-bezier(0.18, 0.89, 0.35, 1.15) all;
}

#button-1 .checkbox:checked + .knobs:before {
  content: "NO";
  left: 42px;
  background-color: #f44336;
}

#button-1 .checkbox:checked ~ .layer {
  background-color: #fcebeb;
}

#button-1 .knobs,
#button-1 .knobs:before,
#button-1 .layer {
  transition: 0.3s ease all;
}
</style>
