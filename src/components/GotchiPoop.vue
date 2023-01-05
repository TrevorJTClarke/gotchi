<template>
  <div ref="poop" class="poop-mess">
    <template v-for="p in poopData">
      <div class="item" :style="{left: p.x, bottom: p.y}">
        <i :style="{'font-size': p.scale}">{{ poo }}</i>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

const getRandom = num => {
  return Math.floor(Math.random() * Math.floor(num))
}

export default {
  name: 'GotchiPoop',

  data() {
    return {
      poo: '💩',
      timer: null,
      initialized: 0
    }
  },

  computed: {
    ...mapGetters(['account', 'gotchi', 'health', 'poopData']),
    raw() {
      return this.gotchi.raw && this.gotchi.raw ? this.gotchi.raw : {}
    },
    isOwner() {
      return (
        this.gotchi && this.gotchi.keeper && this.gotchi.keeper === this.account
      )
    }
  },

  methods: {
    ...mapActions(['setGotchi', 'updateHealth', 'updateKeyValue']),
    generatePoop() {
      let scale = getRandom(28)
      if (scale < 10) scale = 10
      const area =
        this.$refs.poop && this.$refs.poop.clientWidth
          ? this.$refs.poop.clientWidth - 60
          : 300

      // max x/y keeping poop within range
      return {
        x: `${getRandom(area)}px`,
        y: `${getRandom(40)}px`,
        scale: `${scale}pt`
      }
    },
    addPoop() {
      const poops = this.poopData
      const newPoop = this.generatePoop()

      poops.push(newPoop)

      this.updateKeyValue({ key: 'poopData', value: poops })
      this.setGotchi({ poops: poops.length })

      // Decrement hygiene if poop is stacking up
      if (poops.length > 20) {
        this.updateHealth({
          key: 'hygiene',
          value: this.health.hygiene - 1
        })
      }
    },
    initPoop() {
      if (this.poopData && this.poopData.length > 0) return
      if (this.gotchi && !this.gotchi.poops) return
      const p = this.gotchi.poops
      const poops = []

      // initialize with starting poop amounts
      for (var i = 0; i < p; i++) {
        const newPoop = this.generatePoop()
        poops.push(newPoop)
      }

      this.updateKeyValue({ key: 'poopData', value: poops })
    },
    randomPoop() {
      const rand = getRandom(30)
      const fire = r => {
        if (this.timer) return
        this.timer = setTimeout(() => {
          if (this.isOwner) this.addPoop()
          this.timer = null
          const c = getRandom(24)
          fire(c)
        }, r * 1000)
      }

      fire(rand)
    },
    checkOwner() {
      if (this.isOwner === true) this.randomPoop()
    }
  },

  beforeDestroy() {
    clearInterval(this.timer)
  },

  mounted() {
    this.initPoop()
  },

  watch: {
    gotchi: ['checkOwner']
  }
}
</script>

<style lang="scss" scoped>
.poop-mess {
  position: absolute;
  bottom: 55px;
  width: 100%;
  height: 140px;
  z-index: 0;

  &.offset {
    bottom: -20px;
  }
}

.item {
  position: absolute;
}

i {
  font-style: normal;
  font-size: 21pt;
  display: block;
  margin: 0;
  width: 60px;
  height: 40px;
  text-align: center;
}
</style>
