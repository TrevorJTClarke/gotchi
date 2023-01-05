<template>
  <div :class="{'gotchi-game': true, active: game.active}">
    <div class="wrap">
      <!-- <button class="close" @click="closeMenu">&times;</button> -->
      <div class="title">
        <h5>Catch the mouse!</h5>
      </div>
      <div class="items">
        <div class="item" v-for="(item, idx) in holes" @click="selectHole(idx)">
          <i :class="{visible: item == 1}">{{ animals[0] }}</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
const animals = ['🐭', '🐀']

const getRandom = num => {
  return Math.floor(Math.random() * Math.floor(num))
}

export default {
  name: 'GotchiGame',

  data() {
    return {
      animals,
      holes: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      timer: null
    }
  },

  computed: {
    ...mapGetters(['game', 'health', 'gotchi'])
  },

  methods: {
    ...mapActions(['resetGame', 'updateHealth', 'setGotchi']),
    close() {
      this.active = false
    },
    show() {
      this.active = true
    },
    selectHole(idx) {
      if (this.holes[idx] === 1) {
        this.clearGame()
        this.updateHealth({ key: 'fun', value: this.health.fun + 1 })
        const totalGames = this.gotchi.totalGames
          ? this.gotchi.totalGames + 1
          : 1
        this.setGotchi({ totalGames })
        clearInterval(this.timer)
        this.close()
        this.resetGame()
      }
    },
    clearGame() {
      this.holes = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    redrawGameItem() {
      this.clearGame()
      const r = getRandom(9)
      this.holes[r] = 1
    },
    gameTick() {
      this.timer = setInterval(() => {
        this.redrawGameItem()
      }, 1000)
    },
    initializeGame() {
      if (this.game.active) this.gameTick()
    }
  },

  watch: {
    game: 'initializeGame'
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';

.gotchi-game {
  display: none;
  position: absolute;
  bottom: 75px;
  width: 100%;
  z-index: 19;

  .close {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    background: transparent;
    border: 0;
    font-size: 24pt;
    padding: 10px 20px;
    outline: 0;
    z-index: 10;
  }

  h5 {
    padding-bottom: 5px;
  }

  .wrap {
    background: $white;
    border-radius: 30px;
    box-shadow: 0 7px 20px -4px transparentize($black, 0.85);
    display: flex;
    flex-direction: column;
    width: 85%;
    margin: 0 auto 10px;
    padding: 0 20px 20px;
    position: relative;
  }

  &.active {
    display: flex;
  }
}

.title {
  text-align: left;
}

.items {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .item {
    cursor: pointer;
    border-radius: 50%;
    background: $black;
    border-top: 4px solid grey;
    width: 30%;
    height: 40px;
    margin: 10px auto;
  }
}

i {
  font-style: normal;
  font-size: 36pt;
  display: block;
  margin: -20px auto auto;
  width: 60px;
  height: 40px;
  text-align: center;
  transform: scale(0);
  transform-origin: 50% 100%;
  transition: all 90ms ease-in-out;

  &.visible {
    transform: scale(1);
    transition: all 390ms ease-in-out;
  }
}
</style>
