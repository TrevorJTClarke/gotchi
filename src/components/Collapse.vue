<template>
  <div :class="{'collapse': true, active}">
    <div class="collapse-header" @click.prevent="active = !active">
      {{ title }}
      <i v-if="active">⬆️</i>
      <i v-else>⬇️</i>
    </div>
    <div class="collapse-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Collapse',
  props: ['title', 'init'],

  data() {
    return {
      active: false
    }
  },

  mounted() {
    if (typeof this.init !== 'undefined') this.active = this.init
  }
}
</script>

<style lang="scss">
@import '../scss/variables.scss';

.collapse {
  background: $white;
  border-radius: 12px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 10px -2px transparentize($black, 0.85);
  margin-bottom: 10px;

  .collapse-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 260ms ease-in-out;

    p {
      padding: 20px;
      max-width: 1000px;
    }
  }

  &.active {
    .collapse-content {
      max-height: 10000px;
    }
  }
}

.collapse-header {
  cursor: pointer;
  padding: 12px 20px;
  display: flex;
  font-size: 21pt;
  word-break: break-word;

  i {
    margin: auto 0 auto auto;
    height: 33px;
    width: 26px;
    font-style: normal;
  }
}
</style>
