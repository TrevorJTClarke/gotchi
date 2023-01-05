<template>
  <div class="progress-wrap">
    <div class="progress">
      <div v-for="(i, idx) in progress" class="progress-item" :style="{ width: i.w, background: colors[idx] }" />
    </div>
    <div class="tags">
      <div v-for="(i, idx) in progress" class="tag" :style="{ background: colors[idx] }">
        <span>{{ i.p }}</span>
        <span>{{ i.title }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'HealthBar',

  data() {
    return {
      colors: ['#4c598c', '#20a83a', '#d66e19', '#ba1774']
    }
  },

  computed: {
    ...mapGetters(['health', 'gotchi', 'expOffset']),
    stage() {
      return this.$store.state.gotchi && this.$store.state.gotchi.stage
        ? this.$store.state.gotchi.stage
        : 1
    },
    exponent() {
      return this.stage * this.stage
    },
    multiplier() {
      return this.exponent * this.expOffset
    },
    progress() {
      const calc = []
      for (let k in this.health) {
        const i = Math.round((this.health[k] / this.multiplier / 4) * 100)
        const p = Math.round((this.health[k] / this.multiplier) * 100)
        calc.push({
          w: `${i}%`,
          p: `${p}%`,
          title: k
        })
      }
      return calc
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';

$height: 30px;

.progress-wrap {
  position: relative;
}

.progress {
  border-radius: 7px;
  background: transparentize($lightgrey, 0.9);
  box-shadow: inset 0 -1px 5px rgba(0, 0, 0, 0.15);
  display: flex;
  position: relative;
  height: $height;
  width: 100%;
  overflow: hidden;

  &:after {
    content: '';
    background: $white;
    border-radius: 8px;
    position: absolute;
    height: 5px;
    opacity: 0.2;
    width: 100%;
    top: 4px;
    right: 5px;
    left: 5px;
  }

  .progress-item {
    background: $color1;
    height: $height;
    transition: all 250ms ease;
  }
}

.tag {
  background: $color2;
  border-radius: 3px;
  color: $white;
  display: inline-block;
  font-size: 8pt;
  font-weight: 500;
  margin: 12px 7px 0 0;
  vertical-align: top;
  overflow: hidden;
  text-transform: uppercase;

  span {
    display: inline-block;
    padding: 3px 5px;

    &:first-of-type {
      background: transparentize($black, 0.9);
    }
  }
}
</style>
