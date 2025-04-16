<template>
  <div id="app" :style="{ height: computedHeight + 'px' }">
    <router-view />
  </div>
</template>

<script>
import { getBaseUrlLocalStorage, setBaseApiUrl } from "@/utils/api"
export default {
  name: "App",
  data() {
    return {
      windowHeight: window.innerHeight,
      theme: 'light',
    }
  },
  computed: {
    computedHeight() {
      return this.windowHeight - 1
    },
  },
  created() {
    if (getBaseUrlLocalStorage()) {
      setBaseApiUrl(getBaseUrlLocalStorage())
    }
  },
  mounted() {
    window.addEventListener("resize", this.handleResize)
    const savedTheme = localStorage.getItem('app-theme') || 'light';
    this.setTheme(savedTheme);
  },
  methods: {
    handleResize() {
      this.windowHeight = window.innerHeight
    },
    setTheme(themeName) {
      if (['light', 'dark', 'pink'].includes(themeName)) {
        this.theme = themeName;
        localStorage.setItem('app-theme', themeName);
        document.documentElement.setAttribute('data-theme', themeName);
      } else {
        console.warn(`Invalid theme name: ${themeName}. Defaulting to light.`);
        this.setTheme('light');
      }
    }
  },
  watch: {
    theme(newTheme) {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize)
  },
  provide() {
    return {
      setAppTheme: this.setTheme
    };
  }
}
</script>

<style>
:root {
  --primary-light: #8abdff;
  --primary: #2ebb96;
  --primary-dark: #238067;
  --white: #ffffff;
  --greyLight-1: #e4ebf5;
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
* {
  margin: 0;
  padding: 0;
}
body {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
a:focus,
input:focus,
p:focus,
div:focus {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
