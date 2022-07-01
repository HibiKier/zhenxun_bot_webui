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
:root {
    --primary-light: #8abdff;
    --primary: #2ebb96;
    --primary-dark: #238067;
    --white: #FFFFFF;
    --greyLight-1: #E4EBF5;
    --greyLight-2: #c8d0e7;
    --greyLight-3: #bec8e4;
    --greyDark: #9baacf;
    --titleH1: 1.5rem;
    --titleH2: 1.2rem;
    --contentP: 1.15rem;
    --contentBtn: 1.3rem;
    --content: 1rem;
    --contentHeight: 2rem;
}
*{
  margin: 0;
  padding: 0;
  /* touch-action: none; */
}
body{ 
   -webkit-tap-highlight-color:rgba(0,0,0,0); 
}
a:focus,input:focus,p:focus,div:focus{
    -webkit-tap-highlight-color:rgba(0,0,0,0);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
