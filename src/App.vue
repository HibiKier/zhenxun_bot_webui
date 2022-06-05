<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { getBaseUrlLocalStorage , setBase } from "@/utils/api";
export default {
  name: "App",
  created(){
    if(getBaseUrlLocalStorage()){
      setBase(getBaseUrlLocalStorage());
    }
  },
  components: {},
};
</script>

<style>
/* 清除浏览器默认样式 */
*{
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
