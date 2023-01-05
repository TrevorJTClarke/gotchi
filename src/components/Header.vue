<template>
  <div class="header-bar">
    <div id="bgRef" class="background-art">
      <canvas id="bgArt" />
    </div>

    <div class="header-wrap">
      <div class="header-menu">
        <div class="btn-menu" @click.prevent="menuActive = !menuActive">
          <span>
            <i v-if="!menuActive">▼</i>
            <i v-if="menuActive">▲</i> Menu
          </span>
        </div>
        <div :class="{'dropdown': true, active: menuActive}">
          <router-link :to="{name: 'Home'}" tag="a">
            <span @click="menuActive = false">🏠 Home</span>
          </router-link>
          <router-link :to="{name: 'list'}" tag="a">
            <span @click="menuActive = false">🐣 My Gotchis</span>
          </router-link>
        </div>
      </div>

      <div class="logo">
        <router-link :to="{name: 'Home'}" tag="a">
          <img src="/static/logo.svg" alt="gotchi">
        </router-link>
      </div>

      <Account />
    </div>

  </div>
</template>

<script>
import paper from 'paper'
import Account from './Account'

export default {
  name: 'Header',

  components: {
    Account
  },

  data() {
    return {
      menuActive: false,
      bgWrap: null,
      bgCanvas: null,
      view: null,
      pathHeight: 0,
      path: null,
      points: 5,
      width: 0,
      height: 0,
      center: {
        x: 0,
        y: 0
      },
      mousePos: {
        x: 0,
        y: 0
      }
    }
  },

  methods: {
    initializePath() {
      this.center = this.view.center
      this.width = this.view.size.width
      this.height = this.view.size.height - 100
      this.path.segments = []
      this.path.add(this.view.bounds.topLeft)
      this.path.add(this.view.bounds.bottomLeft)

      for (var i = 1; i < this.points; i++) {
        var point = new paper.Point(
          (this.width / this.points) * i,
          this.center.y
        )
        this.path.add(point)
      }

      this.path.add(this.view.bounds.bottomRight)
      this.path.add(this.view.bounds.topRight)
      this.path.fullySelected = true
    },
    mouse(e) {
      if (!e) return
      this.mousePos = e.point
    },
    frame(event) {
      this.pathHeight +=
        (this.center.y - this.mousePos.y - this.pathHeight) / 10

      // Static points
      this.path.segments[1].point = { x: 0, y: this.height }
      this.path.segments[6].point = { x: this.width, y: this.height - 100 }

      // Dynamic points
      for (var i = 2; i < this.points - 1; i++) {
        // const f = i === 0 ? 11 : i
        const sinSeed = event.count + ((i + (i % 100)) * 100) / 3
        const sinHeight = Math.sin(sinSeed / 100) * (this.pathHeight / 5)
        const yPos = Math.sin(sinSeed / 100) * sinHeight + this.height
        this.path.segments[i].point.y = yPos
      }

      this.path.fullySelected = false
      this.path.smooth({ type: 'continuous' })
    }
  },

  mounted() {
    this.bgWrap = document.getElementById('bgRef')
    this.bgCanvas = document.getElementById('bgArt')
    this.bgCanvas.width = this.bgWrap.clientWidth
    this.bgCanvas.height = this.bgWrap.clientHeight / 2 + 100
    if (this.bgCanvas.height < 400)
      this.bgCanvas.height = this.bgWrap.clientHeight

    // start
    paper.setup(this.bgCanvas)
    this.view = paper.view
    this.view.onFrame = this.frame
    this.view.onMouseMove = this.mouse
    this.path = new paper.Path()
    this.path.fillColor = 'rgb(243, 251, 217)'
    // Night mode
    // this.path.fillColor = '#31323d'
    this.path.style = {
      strokeWidth: 0
    }

    this.initializePath()
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables';
@import '../scss/mq';

.header-bar {
  color: $color1;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 0px;
  position: relative;
  width: 100%;
}

.background-art {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  min-height: 100vh;
}

.logo {
  position: relative;
  font-family: monospace, sans-serif;

  a {
    display: block;
    padding: 10px 0 0;
  }

  img {
    width: 120px;
  }

  span {
    background: $color2;
    border: 1px solid $color1;
    color: $color1;
    position: absolute;
    right: -60px;
    top: 22px;
    padding: 0px 6px 2px;
    border-radius: 14px;
    font-size: 10pt;
    font-weight: 600;
  }
}

.header-menu {
  display: flex;
  position: relative;
  user-select: none;

  .btn-menu {
    cursor: pointer;
    flex-direction: column;
    margin: auto;
    font-weight: 900;
    font-size: 11pt;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
}

.dropdown {
  background: $white;
  border-radius: 40px;
  display: none;
  position: absolute;
  padding: 20px 0;
  left: 0;
  top: 55px;
  width: 300px;
  z-index: 9999;

  &.active {
    display: block;
    box-shadow: 0 2px 20px -4px rgba(0, 0, 0, 0.2);
  }

  a {
    color: $color1;
    display: flex;
    align-items: center;
    padding: 10px 25px;
    font-weight: 900;
    font-size: 11pt;
    letter-spacing: 2px;
    margin: 0;
    text-transform: uppercase;
    text-decoration: none;
    text-align: center;

    &:hover {
      color: $primary;
      cursor: pointer;
    }

    &.not-active {
      cursor: default;
    }
  }
}

.header-wrap {
  display: flex;
  justify-content: space-between;
  padding: 0 15vw;
  margin: 0;
  width: 100%;

  @include bp(mobile) {
    padding: 0 12px;
    width: 100%;

    .header-menu {
      position: unset;

      .dropdown {
        width: 100vw;
      }
    }

    .logo {
      margin: 5px auto;

      a {
        padding: 0;
      }

      img {
        width: 30vw;
        max-height: 40px;
      }
    }
  }
}
</style>
