<template>
  <div :class="['egg',stateClass]">
    <div class="egg-visible">
      <img class="egg0" src="/static/gotchi_egg_c0.svg">
      <img class="egg1" src="/static/gotchi_egg_c1.svg">
      <img class="egg2" src="/static/gotchi_egg_c2.svg">
    </div>
  </div>
</template>

<script>
export default {
  name: 'EggModes',
  props: ['state'],

  computed: {
    stateClass() {
      return `st${this.state}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';

.egg0,
.egg1,
.egg2 {
  opacity: 0;
}

.egg {
  display: flex;
  position: absolute;
  top: 0px;
  height: 100%;
  width: 100%;

  .egg-visible {
    position: relative;
    height: 80%;
    width: 80%;
    margin: auto;

    img {
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
    }

    &:before {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0%;
      right: 30%;
      background: $lightgrey;
      border-radius: 50%;
      height: 40px;
      filter: blur(4px);
      opacity: 0.3;
      z-index: -1;
    }
  }

  &.st0 .egg0 {
    opacity: 1;
  }

  &.st1 .egg1 {
    opacity: 1;
  }

  &.st2 .egg2 {
    opacity: 1;
  }

  &.st3 .egg-visible:before {
    opacity: 0;
  }
}
</style>
