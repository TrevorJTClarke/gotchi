<template>
  <div class="card">
    <slot name="header" />
    <slot name="content" />
    <slot name="footer" />
  </div>
</template>

<script>
// import { mapGetters, mapActions } from 'vuex'
export default { name: 'Card' }
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';

.card {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  z-index: 10;
}
</style>
