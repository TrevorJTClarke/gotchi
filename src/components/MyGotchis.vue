<template>
  <div class="my-gotchis">
    <h1>My Gotchis</h1>
    <div v-if="filteredGotchis && filteredGotchis.length > 0" class="gotchi-items">
      <template v-for="item in filteredGotchis">
        <div>
          <GotchiItem :data="item" :extended="true" />
        </div>
      </template>
    </div>
    <div v-else class="gotchis-prompt">
      <h2>No gotchis yet!</h2>
      <p>Gotchi is a game that requires you to own a crypto-collectible on the Ethereum blockchain. These are mostly called NFTs (Non-fungible tokens), made famous by <a href="https://www.cryptokitties.co/" target="_blank">CryptoKitties</a>.<br><br>To get started, you will need to buy a crypto-collectible from OpenSea, or other asset websites.</p>
      <a href="https://opensea.io/" title="Buy on OpenSea" target="_blank">
        <img style="width:160px; border-radius:5px; box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);" src="https://storage.googleapis.com/opensea-static/opensea-brand/buy-button-white.png" alt="Buy on OpenSea badge">
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GotchiItem from './GotchiItem'

export default {
  name: 'Home',

  components: {
    GotchiItem
  },

  computed: {
    ...mapGetters(['filteredGotchis'])
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import '../scss/mq.scss';

.gotchis-prompt {
  background: $white;
  border: 2px solid $color1;
  border-radius: 12px;
  box-shadow: 0 2px 10px -2px transparentize($black, 0.85);
  color: $black;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 450px;
  padding: 0 20px 20px;

  h2 {
    text-align: left;
  }

  p {
    margin-bottom: 20px;
  }
}

.gotchi-items {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;

  @include bp(mobile) {
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

.my-gotchis {
  display: flex;
  flex-direction: column;
  margin: auto 40px;
  text-align: center;

  @include bp(mobile) {
    margin: auto 0;

    h1 {
      font-size: 18pt;
    }
  }
}
</style>
