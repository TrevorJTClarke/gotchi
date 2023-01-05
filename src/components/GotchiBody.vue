<template>
  <div class="gotchi-wrap" :class="[sleeping, stage]" :style="{ background: getColor }">
    <template v-if="imageUrl">
      <i v-if="sleeping" class="zzz">💤</i>
      <img v-if="imageUrl" :src="imageUrl">
      <EggModes :state="eggState" />
    </template>
    <Loading v-else />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Loading from './Loading'
import EggModes from './EggModes'

export default {
  name: 'GotchiBody',
  props: ['data'],

  components: {
    EggModes,
    Loading
  },

  computed: {
    ...mapGetters(['gotchi', 'eggState']),
    imageUrl() {
      return this.data && this.data.raw && this.data.raw.image_url
        ? this.data.raw.image_url
        : null
    },
    getColor() {
      return this.data.raw && this.data.raw.background_color
        ? `#${this.data.raw.background_color}`
        : null
    },
    sleeping() {
      return this.gotchi && typeof this.gotchi.sleeping !== 'undefined'
        ? this.gotchi.sleeping
          ? 'sleeping'
          : null
        : false
    },
    stage() {
      return `stage${this.eggState}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import '../scss/mq.scss';

.gotchi-wrap {
  background: $white;
  background: $color3;
  border: 4px solid rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  box-shadow: 0 2px 10px -2px transparentize($black, 0.85);
  overflow: hidden;
  position: relative;
  max-height: 400px;
  height: 30vw;
  transition: box-shadow 220ms ease, background 2s ease;
  z-index: 9;

  img {
    width: 100%;
    transition: transform 220ms ease;
  }

  .zzz {
    display: none;
    position: absolute;
    top: 10%;
    right: 20%;
    font-size: 72pt;
    font-style: normal;
    z-index: 15;
    animation: fadeInOut 4s infinite ease-in-out;
    transition: opacity 220ms ease;
  }

  &.sleeping {
    background: #181058 !important;

    .zzz {
      display: block;
    }

    img {
      opacity: 0.3;
    }
  }

  &.stage0 {
    img {
      transform: scale(0.5);
      transform-origin: 50% 30%;
    }
  }

  &.stage1 {
    img {
      transform: scale(0.1);
      transform-origin: 50% 50%;
    }
  }

  &.stage2 {
    img {
      transform: scale(0.3);
      transform-origin: 50% 50%;
    }
  }

  &.stage3 {
    img {
      transform: scale(1);
      transform-origin: initial;
    }
  }

  @include bp(mobile) {
    max-height: 100%;
    height: 55vh;
  }
}

@-webkit-keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  40% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
</style>
