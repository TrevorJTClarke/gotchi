<template>
  <div id="app">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',

  components: {
    Header,
    Footer
  }

  // TODO: MATOMO!!!
  // watch: {
  //   $route(to) {
  //     if (!window.gtag) return
  //     // update google analytics
  //     window.gtag('config', 'UA-124568499-1', {
  //       page_title: to.name,
  //       page_path: to.fullPath
  //     })
  //   }
  // }
}
</script>

<style lang="scss">
@import './scss/main.scss';

body {
  background: #f9f9f9;
  padding: 0;
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $primary;
  margin: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
}
</style>
