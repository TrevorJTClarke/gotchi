<template>
  <div class="card-header">
    <div class="gotchi-about">

      <div class="gotchi-stats">
        <div class="gotchi-state">
          <div class="about-name">
            <h2>{{ data.name || data.id }} <small class="tag"><span>{{ stageName }}</span><span>{{ percentage }} Complete</span></small> </h2>
            <h4>&mdash; <a :href="ownerHref" target="_blank">{{ owner.name }}</a></h4>
          </div>
          <button @click.prevent="gotchiAction()" class="btn btn-small">{{ actionTitle }}</button>
        </div>
        <template v-if="isStarted">
          <HealthBar />
        </template>
      </div>
      <hr>
      <p>{{ raw.description }}</p>
    </div>
    <template v-if="relatedGotchis && relatedGotchis.length > 0">
      <h6>Related Gotchi's</h6>
      <div class="owner-tmg">
        <div v-for="item in relatedGotchis" class="avatar" :style="{ background: getColor(item) }">
          <router-link :to="gotchiLink(item)">
            <img :src="imageUrl(item)">
          </router-link>
        </div>
      </div>
    </template>

    <!-- <button id="show-modal" @click="showSuccess = true">Show Success</button> -->
    <Modal v-if="showWelcome" @close="showWelcome = false">
      <i slot="icon">🐣</i>
      <h3 slot="header">Hatched!</h3>
      <p slot="body">Your gotchi has hatched!<br>Keep your gotchi alive and there will be a reward!</p>
      <div slot="footer">
        <button class="btn btn-large btn-modal" @click="showWelcome = false">Okay!</button>
      </div>
    </Modal>

    <Modal v-if="showSuccess" @close="showSuccess = false">
      <i slot="icon">🎉</i>
      <h3 slot="header">Success!</h3>
      <p slot="body">Your gotchi achieved a new level!</p>
      <div slot="footer">
        <button class="btn btn-large btn-modal" @click="updateGotchi()">Save</button>
        <button class="btn btn-large btn-modal btn-grey" @click="showSuccess = false">Don't Save</button>
      </div>
    </Modal>

    <!-- <button id="show-modal" @click="showDied = true">Show Fail</button> -->
    <Modal v-if="showDied" @close="showDied = false">
      <i slot="icon">💀</i>
      <h3 slot="header">Gotchi Died</h3>
      <p slot="body">Your gotchi has passed away.</p>
      <div slot="footer">
        <button class="btn btn-large btn-modal" @click="showDied = false">Cure 💉</button>
        <button class="btn btn-large btn-modal btn-grey" @click="showDied = false">Stay Dead</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HealthBar from './HealthBar.vue'
import Modal from './Modal.vue'

const getCurrentStageName = stage => {
  if (!stage) return 'Baby'
  let name

  switch (stage) {
    case 0:
      name = 'Dead'
      break
    case 1:
      name = 'Baby'
      break
    case 2:
      name = 'Child'
      break
    case 3:
      name = 'Teenager'
      break
    case 4:
      name = 'Adult'
      break
    case 5:
      name = 'Senior'
      break
    case 6:
      name = 'Immortal'
      break
    default:
      name = 'dead'
  }

  return name
}

export default {
  name: 'GotchiInfo',
  props: ['data'],

  data() {
    return {
      relatedGotchis: [],
      showWelcome: false,
      showSuccess: false,
      showDied: false
    }
  },

  components: {
    HealthBar,
    Modal
  },

  computed: {
    ...mapGetters(['health', 'account', 'connected', 'eggState', 'expOffset']),
    raw() {
      return this.data.raw && this.data.raw ? this.data.raw : {}
    },
    ownerHref() {
      return this.raw.external_link
    },
    isOwner() {
      return this.data && this.data.keeper && this.data.keeper === this.account
    },
    owner() {
      return this.raw.asset_contract && this.raw.asset_contract
        ? this.raw.asset_contract
        : {}
    },
    ownedGotchis() {
      return this.raw.children && this.raw.children ? this.raw.children : {}
    },
    isStarted() {
      return typeof this.data.lastSleep !== 'undefined'
    },
    actionTitle() {
      if (this.eggState !== 3 && this.eggState !== 0) {
        return this.eggState === 1 ? 'Hatching...' : 'Growing...'
      }
      return this.isStarted ? 'Save' : 'Start'
    },
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
    percent() {
      let num = 0
      for (let k in this.health) {
        const p = Math.round((this.health[k] / 4) * 100)
        num += p
      }

      return Math.round(num / this.multiplier)
    },
    percentage() {
      return `${this.percent}%`
    },
    stageName() {
      return this.data && this.data.stage
        ? getCurrentStageName(this.data.stage)
        : 'Baby'
    }
  },

  methods: {
    ...mapActions([
      'newGotchi',
      'setGotchi',
      'updateGotchiById',
      'getRelatedNfts'
    ]),
    imageUrl(data) {
      return data.raw && data.raw.image_url ? data.raw.image_url : null
    },
    getColor(data) {
      return data.raw && data.raw.background_color
        ? `#${data.raw.background_color}`
        : null
    },
    startNewGotchi() {
      this.newGotchi({
        idx: this.raw.token_id,
        contract: this.raw.asset_contract.address
      }).then(() => {
        setTimeout(() => {
          this.showWelcome = true
        }, 3000)
      })
    },
    updateGotchi() {
      if (!this.data.uuid) return
      this.updateGotchiById({
        idx: this.raw.token_id,
        data: this.data,
        contract: this.raw.asset_contract.address
      })
      this.showWelcome = false
      this.showSuccess = false
      this.showDied = false
    },
    gotchiAction() {
      if (this.isStarted) this.updateGotchi()
      else this.startNewGotchi()
    },
    gotchiLink(item) {
      return {
        name: 'detail',
        params: {
          id: item.raw.token_id,
          contract: item.raw.asset_contract.address
        }
      }
    },
    getRelated() {
      if (!this.raw.owner || !this.raw.owner.address) return
      const idx = this.raw.owner.address
      this.relatedGotchis = []
      this.getRelatedNfts(idx).then(res => {
        this.relatedGotchis = res
          .filter(a => a.raw.token_id !== this.data.raw.token_id)
          .slice(0, 4)
      })
    },
    assessProgress() {
      const percent = this.percent
      if (percent >= 100) {
        this.showSuccess = true
      }
    }
  },

  mounted() {
    if (this.relatedGotchis.length <= 0) {
      setTimeout(() => {
        this.getRelated()
      }, 2000)
    }
  },

  watch: {
    gotchi: ['getRelated'],
    $route: ['getRelated'],
    health: ['assessProgress']
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import '../scss/mq.scss';

h2 {
  font-size: 28pt;
  margin: 12px 0;
}

h4 {
  margin: 10px 0 20px;
}

p {
  padding: 0 20px 12px;
}

hr {
  margin: 15px 20px;
  width: 25%;
}

.tag {
  background: $color2;
  border-radius: 3px;
  color: $white;
  display: inline-block;
  font-size: 10pt;
  margin-top: 12px;
  vertical-align: top;
  overflow: hidden;

  span {
    display: inline-block;
    padding: 3px 7px;

    &:first-of-type {
      background: transparentize($black, 0.9);
    }
  }
}

.gotchi-stats {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
}

.gotchi-state {
  display: flex;
  justify-content: space-between;

  h3 {
    margin: 20px;
  }

  .btn-small {
    width: initial;
    margin: auto 0;
  }
}

.avatar {
  background: $color2;
  border-radius: 3px;
  height: 96px;
  width: 96px;
  overflow: hidden;
  margin: 0 15px 15px 0;

  img {
    width: 100%;
  }
}

.btn-grey {
  background: lightgrey;
  box-shadow: 0 0;
}

.gotchi-about {
  background: transparentize($white, 0.5);
  border-radius: 12px;
  border: 4px solid $white;
  box-shadow: 0 2px 10px -2px transparentize($black, 0.85);
  max-width: 550px;
}

.owner-tmg {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  @include bp(mobile) {
    .avatar {
      height: 48px;
      width: 48px;
    }
  }
}
</style>
