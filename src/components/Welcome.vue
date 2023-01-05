<template>
  <div class="welcome">
    <div class="featured-gotchi">
      <!-- <img src="https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/881108.svg"> -->
      <div class="egg">
        <img src="/static/gotchi_egg.svg">
      </div>
    </div>

    <div class="action">
      <h1>Can you keep your gotchi alive?!</h1>
      <button class="btn btn-large" @click.prevent="startGotchi">Start</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Welcome',

  computed: {
    ...mapGetters(['ownedGotchis'])
  },

  methods: {
    startGotchi() {
      this.$router.push({ name: 'list' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import '../scss/mq.scss';

.featured-gotchi {
  width: 40vw;
  height: 35vw;
  overflow: hidden;
  position: relative;

  img {
    position: absolute;
    width: 100%;
    height: 30vw;
    bottom: 30px;
    left: 0;
  }

  &:before {
    content: '';
    position: absolute;
    bottom: 10px;
    left: 10%;
    right: 30%;
    background: $lightgrey;
    border-radius: 50%;
    height: 40px;
    filter: blur(4px);
    opacity: 0.3;
    z-index: -1;
  }
}

.action {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: auto 40px auto 0;

  .btn-large {
    animation: floating 4s infinite ease-in-out;
    width: auto;

    &:hover {
      box-shadow: 0 6px 75px -5px transparentize($color1, 0.2);
      animation-play-state: paused;
    }
  }
}

@-webkit-keyframes floating {
  0% {
    box-shadow: 0 2px 15px -2px transparentize($color1, 0.6);
  }
  50% {
    box-shadow: 0 6px 75px -5px transparentize($color1, 0.2);
  }
  100% {
    box-shadow: 0 2px 15px -2px transparentize($color1, 0.6);
  }
}

@keyframes shakeIt {
  0% {
    transform: translate(2px, 1px) rotate(0deg);
  }
  5% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  10% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  15% {
    transform: translate(0px, 2px) rotate(0deg);
  }
  20% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  25% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  30% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  35% {
    transform: translate(2px, 1px) rotate(-1deg);
  }
  40% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  45% {
    transform: translate(2px, 2px) rotate(0deg);
  }
  50% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
  51% {
    transform: translate(2px, 1px) rotate(0deg);
  }
  100% {
    transform: translate(2px, 1px) rotate(0deg);
  }
}

.egg img {
  animation: shakeIt 1.6s 2s infinite ease-in-out;
  transform-origin: 50% 100%;
}

.welcome {
  display: flex;

  @include bp(mobile) {
    flex-direction: column;

    .featured-gotchi {
      width: 100vw;
      height: 60vw;

      img {
        height: 45vw;
      }
    }

    .action {
      margin: auto 0;

      h1 {
        width: 100%;
        font-size: 16pt;
      }
      .btn {
        margin: 10px auto 40px;
        padding: 10px 60px;
      }
    }
  }
}
</style>
