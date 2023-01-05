<template>
  <div class="hello">
    <Welcome />

    <div class="all-gotchis">
      <div class="half-gotchis">
        <h5>Latest Gotchis</h5>
        <div class="gotchi-items">
          <template v-for="item in latestGotchis">
            <GotchiItem :data="item" :key="item.id" />
          </template>
        </div>
      </div>
      <div class="half-gotchis">
        <h5>My Gotchis</h5>
        <div v-if="hasProvider && account" class="gotchi-items">
          <template v-if="limitedGotchis && limitedGotchis.length > 0">
            <template v-for="item in limitedGotchis">
              <GotchiItem :data="item" :key="item.id" :extended="true" />
            </template>
          </template>
          <template v-else>
            <div class="gotchis-prompt">
              <h2>No gotchis yet!</h2>
              <p>Gotchi is a game that requires you to own a crypto-collectible on the Ethereum blockchain. These are mostly called NFTs (Non-fungible tokens), made famous by <a href="https://www.cryptokitties.co/" target="_blank">CryptoKitties</a>.<br><br>To get started, you will need to buy a crypto-collectible from OpenSea, or other asset websites.</p>
              <a href="https://opensea.io/" title="Buy on OpenSea" target="_blank">
                <img style="width:160px; border-radius:5px; box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);" src="https://storage.googleapis.com/opensea-static/opensea-brand/buy-button-white.png" alt="Buy on OpenSea badge">
              </a>
            </div>
          </template>
        </div>
        <button v-if="limitedGotchis && limitedGotchis.length > 0" class="btn btn-large btn-grey" @click.prevent="goTo('list')">See All</button>
        <div id="noAcct" v-else class="provider-prompt">
          <h2>Oops! Web3 required to play!</h2>
          <p>You will need an Ethereum Account to use Gotchi!<br>Web3 is a bridge that allows you to visit the distributed web of tomorrow in your browser today.</p>
          <button class="btn btn-social" @click.prevent="signInWithGoogle()">
            <i class="icon">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /><path fill="none" d="M0 0h48v48H0z" /></svg>
            </i>
            <span>Sign in with Google</span>
          </button>
          <!-- <a href="https://metamask.io/" target="_blank">
            <img src="/static/metamask.png" alt="MetaMask required!" width="250px">
          </a> -->
        </div>
      </div>
    </div>

    <div id="faqs" class="faqs-section">
      <h2>About gotchi</h2>
      <Collapse title="What is gotchi?" :init="true">
        <p>A "gotchi" is a re-imagined <a href="https://en.wikipedia.org/wiki/Tamagotchi" target="_blank">Tamagotchi</a>, built for Web3!</p>
      </Collapse>
      <Collapse title="Will this destroy my NFT?" :init="true">
        <p>Absolutely not! While it is possible to die if you don't take care of your gotchi, the NFT will remain fully intact.<br>Gotchi smart contract code interacts indirectly with the data. All logic is <strong>read only</strong> meaning it will never make changes, destroy, transfer or change the core NFT. All logic in this game is build as a side-layer, keeping your real NFT safe and sound!</p>
      </Collapse>
      <Collapse title="Why did you create this?">
        <p>It's a sooper sekret! shhh...</p>
        <p>JK! This is a project built for Consensys Academy 2018 final project.</p>
      </Collapse>
      <Collapse title="How do I play?">
        <p>Open MetaMask, get an NFT, load in gotchi, play!</p>
      </Collapse>
      <Collapse title="How does this work?">
        <p>Gotchi scans your address to find any NFT's associated with your account within the Ethereum blockchain. If any found, you can start playing gotchi! 🐣</p>
      </Collapse>
      <Collapse title="Is this free?">
        <p><strong>Short answer:</strong><br>No, but its very inexpensive!</p>
        <p><strong>Long answer:</strong><br>Gotchi needs minor transaction fees to operate gameplay within the Ethereum blockchain. The smart contracts that run within Ethereum usually cost $.25 <small>USD</small> or less, keeping gotchi fun, cheap & enjoyable!</p>
      </Collapse>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Collapse from './Collapse'
import GotchiItem from './GotchiItem'
import Welcome from './Welcome'

export default {
  name: 'Home',

  components: {
    Collapse,
    GotchiItem,
    Welcome
  },

  computed: {
    ...mapGetters([
      'filteredGotchis',
      'latestGotchis',
      'hasProvider',
      'account'
    ]),
    limitedGotchis() {
      return this.filteredGotchis && this.filteredGotchis.length > 0
        ? this.filteredGotchis.slice(0, 4)
        : []
    }
  },

  methods: {
    goTo(name) {
      this.$router.push({ name })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import '../scss/mq.scss';

.hello {
  text-align: center;
  margin: auto;
}
.half-gotchis {
  width: 48%;
}

.provider-prompt {
  background: $white;
  border: 2px solid $color1;
  border-radius: 12px;
  box-shadow: 0 2px 10px -2px transparentize($black, 0.85);
  color: $black;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0 20px 20px;

  h2 {
    text-align: left;
  }

  p {
    margin-bottom: 20px;
  }

  .btn-social {
    background: $white;
    border: 2px solid #4285f4;
    border-radius: 40px;
    display: flex;
    margin: auto;
    padding: 9px 12px 7px;
    outline: 0;

    span {
      font-size: 12pt;
      margin: 0 10px;
    }
  }
}

.gotchis-prompt {
  background: $white;
  border: 2px solid $color1;
  border-radius: 12px;
  box-shadow: 0 2px 10px -2px transparentize($black, 0.85);
  color: $black;
  display: flex;
  flex-direction: column;
  margin: 0;
  max-width: 450px;
  padding: 0 20px 20px;

  h2 {
    text-align: left;
  }

  p {
    margin-bottom: 20px;
  }
}

.faqs-section {
  margin: 40px;

  @include bp(mobile) {
    margin: 40px 10px;
  }
}

.all-gotchis {
  display: flex;
  margin: auto 40px;
  justify-content: space-between;

  @include bp(mobile) {
    margin: auto 10px;
    flex-direction: column;

    .half-gotchis {
      width: 100%;
    }

    h5 {
      font-size: 10pt;
      margin: 24px 0 10px;
    }

    .gotchi-items {
      margin: auto 0;
      max-width: 100%;
      display: grid;
      grid-template-columns: 50% 50%;

      .gotchi-item {
        flex-direction: column;
        margin: 10px 5px 0;
      }
    }
  }
}
</style>
