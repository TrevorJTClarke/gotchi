<template>
  <div>
    &copy; Gotchi {{ year }} - <span>by <a href="https://twitter.com/trevorjtclarke" target="_blank">@trevorjtclarke</a></span>
  </div>
</template>

<script>
export default {
  name: 'Footer',

  data() {
    return {
      year: new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  font-size: 11pt;
  margin: 40px 0px 20px;
  text-align: center;
}

a {
  text-decoration: none;
}
</style>
