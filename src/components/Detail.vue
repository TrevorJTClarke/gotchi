<template>
  <div class="detail-page">
    <div class="detail-main">
      <div class="card-wrap" v-if="gotchi">
        <Card>
          <GotchiBody slot="content" :data="gotchi" />
          <CardFooter slot="footer" :data="gotchi" />
        </Card>
      </div>
    </div>
    <div class="about-wrap" v-if="gotchi">
      <GotchiInfo slot="header" :data="gotchi" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Card from './Card.vue'
import CardFooter from './CardFooter.vue'
import GotchiBody from './GotchiBody.vue'
import GotchiInfo from './GotchiInfo.vue'

export default {
  name: 'Home',

  components: {
    Card,
    GotchiInfo,
    CardFooter,
    GotchiBody
  },

  data() {
    return {}
  },

  computed: {
    ...mapGetters(['gotchi', 'connected'])
  },

  methods: {
    ...mapActions(['getGotchi', 'resetGotchi']),
    getData() {
      this.resetGotchi()
      const contract = this.$route.params.contract
      const idx = this.$route.params.id
      if (!idx || !contract) return
      this.getGotchi({ contract, idx })
    }
  },

  mounted() {
    if (this.connected) this.getData()
  },

  watch: {
    $route: ['getData'],
    connected: ['getData']
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import '../scss/mq.scss';

.about-wrap {
  display: flex;
  margin: 40px;
}

.card-header {
  position: relative;
  z-index: 10;
  padding: 0 15px;
}

.card-wrap {
  display: flex;
  flex-direction: column;
  margin: 40px auto;
  max-width: 450px;
  min-width: 300px;
  width: 30vw;

  @include bp(mobile) {
    margin: 10px auto 40px;
  }
}

.detail-page {
  display: flex;
  margin: auto;
  min-width: 1024px;

  .detail-main {
    width: 40%;
  }
  .about-wrap {
    width: 55%;
  }

  @include bp(mobile) {
    min-width: 100%;
    flex-direction: column;

    .detail-main {
      width: 100%;
    }
    .about-wrap {
      width: 100%;
      margin: 0;
    }
  }
}
</style>
