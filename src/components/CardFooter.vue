<template>
  <div class="card-footer">
    <GotchiPoop :class="{offset: !isOwner}" />

    <template v-if="isOwner">
      <div :class="{'card-menu': true, active: menuActive}">
        <div class="menu-wrap">
          <button class="close" @click="closeMenu">&times;</button>
          <div class="menu-title">
            <h5>Food</h5>
          </div>
          <div class="menu-items">
            <div class="menu-item" v-for="(item, idx) in foods" @click="selectFood(idx)">
              <i>{{ item }}</i>
            </div>
          </div>
        </div>
      </div>

      <GotchiGame />

      <div class="card-buttons">
        <div class="button-item" @click="showMenu()">
          <i>🍕</i>
          <span>Feed</span>
        </div>
        <div class="button-item" @click="goSleep()">
          <i :class="{inverted: sleeping}">💡</i>
          <span>Sleep</span>
        </div>
        <div class="button-item" @click="goClean()">
          <i>🚽</i>
          <span>Clean</span>
        </div>
        <div class="button-item" @click="playGame()">
          <i>🎮</i>
          <span>Game</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import GotchiGame from './GotchiGame'
import GotchiPoop from './GotchiPoop'

const foods = [
  '🥩',
  '🍖',
  '🍤',
  '🍕',
  '🥞',
  '🥒',
  '🥛',
  '🍺',
  '🍦',
  '🍰',
  '🥧',
  '🍬'
]

export default {
  name: 'CardFooter',
  props: ['data'],

  components: {
    GotchiGame,
    GotchiPoop
  },

  data() {
    return {
      foods,
      menuActive: false
    }
  },

  computed: {
    ...mapGetters(['account', 'gotchi', 'game', 'health']),
    sleeping() {
      return this.gotchi && typeof this.gotchi.sleeping !== 'undefined'
        ? this.gotchi.sleeping
        : false
    },
    raw() {
      return this.gotchi.raw && this.gotchi.raw ? this.gotchi.raw : {}
    },
    isOwner() {
      return this.data && this.data.keeper && this.data.keeper === this.account
    },
    isStarted() {
      return typeof this.data.lastSleep !== 'undefined'
    }
  },

  methods: {
    ...mapActions(['startGame', 'setGotchi', 'updateHealth', 'updateKeyValue']),
    hasActiveAction() {
      return this.game.active
    },
    closeMenu() {
      this.menuActive = false
    },
    selectFood(idx) {
      console.log('TODO: Food idx', idx)
      this.menuActive = false
      this.updateHealth({ key: 'hunger', value: this.health.hunger + 1 })
      this.setGotchi({ totalFood: this.data.totalFood + 1 })
    },
    showMenu() {
      if (this.hasActiveAction()) return
      this.menuActive = !this.menuActive
    },
    goSleep() {
      if (this.hasActiveAction()) return
      const bool =
        this.gotchi && typeof this.gotchi.sleeping !== 'undefined'
          ? this.gotchi.sleeping
          : false
      this.setGotchi({ sleeping: !bool })
      this.updateHealth({ key: 'energy', value: this.health.energy + 1 })
    },
    goClean() {
      if (this.hasActiveAction()) return
      this.updateKeyValue({ key: 'poopData', value: [] })
      this.setGotchi({ poops: 0 })
      this.updateHealth({
        key: 'hygiene',
        value: this.health.hygiene + 1
      })
    },
    playGame() {
      if (this.hasActiveAction()) return
      this.startGame()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';

.card-footer {
  z-index: 10;
  position: relative;
  margin: -20px 0;
}

.card-buttons {
  background: $white;
  border-radius: 50px;
  box-shadow: 0 7px 20px -4px transparentize($black, 0.85);
  display: flex;
  justify-content: space-around;
  width: 90%;
  margin: 0 auto;
  padding: 0 10px;

  .button-item {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    position: relative;
    text-align: center;

    &:hover {
      span {
        opacity: 1;
        bottom: 2px;
      }
    }

    span {
      color: $color1;
      text-transform: uppercase;
      font-weight: 900;
      font-size: 6pt;
      letter-spacing: 2px;
      position: absolute;
      bottom: 5px;
      opacity: 0;
      width: 100%;
      transition: all 250ms ease-in-out;
    }

    i {
      font-style: normal;
      font-size: 22pt;
      display: block;
      margin: auto;
      width: 60px;
      height: 36px;
    }
  }
}

.card-menu {
  display: none;
  position: absolute;
  bottom: 75px;
  width: 100%;
  z-index: 20;

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

  h6 {
    display: block;
    text-align: center;
  }

  .menu-wrap {
    background: $white;
    border-radius: 30px;
    box-shadow: 0 7px 20px -4px transparentize($black, 0.85);
    display: flex;
    flex-direction: column;
    width: 85%;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
  }

  &.active {
    display: flex;
  }
}

.menu-title {
  text-align: center;
}

.menu-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .menu-item {
    cursor: pointer;
  }

  i {
    font-style: normal;
    font-size: 36pt;
    display: block;
    margin: 0 10px 20px;
    width: 60px;
    height: 60px;
  }
}

.inverted {
  filter: invert(1);
}
</style>
