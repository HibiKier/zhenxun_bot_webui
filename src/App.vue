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
      theme: "light",
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
    const savedTheme = localStorage.getItem("app-theme") || "light"
    this.setTheme(savedTheme)
  },
  methods: {
    handleResize() {
      this.windowHeight = window.innerHeight
    },
    setTheme(themeName) {
      if (["light", "dark", "pink", "one-dark"].includes(themeName)) {
        this.theme = themeName
        localStorage.setItem("app-theme", themeName)
        document.documentElement.setAttribute("data-theme", themeName)
      } else {
        console.warn(`Invalid theme name: ${themeName}. Defaulting to light.`)
        this.setTheme("light")
      }
    },
  },
  watch: {
    theme(newTheme) {
      document.documentElement.setAttribute("data-theme", newTheme)
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize)
  },
  provide() {
    return {
      setAppTheme: this.setTheme,
    }
  },
}
</script>

<style lang="scss">
// Import theme variables FIRST
@import "@/styles/theme.scss";

// Then apply global resets and base styles using variables

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box; // Apply box-sizing globally
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0); // Prevent tap highlight
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color); // Use variable for base text color
  height: 100%;
  background-color: var(--bg-color); // Use variable for base background
  transition: background-color 0.3s ease, color 0.3s ease; // Add color transition
}

a:focus,
input:focus,
p:focus,
div:focus {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  outline: none; // Remove default focus outline if needed, ensure accessibility alternatives
}

/* Global scrollbar styling using variables */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.05); // Keep subtle track or use a variable
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb-color, #c1c1c1);
  border-radius: 10px;
  transition: background-color 0.3s ease;
}
::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover-color, #a8a8a8);
}

// Removed the conflicting :root definition and font size variables from here
// Removed the duplicate #app styling block
</style>
