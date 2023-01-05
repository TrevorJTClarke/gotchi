<template>
  <div class="gotchi-item" @click.prevent="goTo(data)">
    <div class="avatar" :style="{ background: getColor }">
      <img v-if="imageUrl" :src="imageUrl">
    </div>
    <div class="gotchi-desc">
      <h3>{{ raw.name || raw.token_id }}</h3>
      <p>{{ owner.name }}</p>
    </div>
    <div class="gotchi-action" v-if="extended == true">
      <button class="btn btn-small" @click.prevent="action(data)">{{ actionTitle }}</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'GotchiItem',
  props: ['data', 'extended'],

  computed: {
    ...mapGetters(['account']),
    raw() {
      return this.data.raw && this.data.raw ? this.data.raw : {}
    },
    imageUrl() {
      return this.data.raw && this.data.raw.image_url
        ? this.data.raw.image_url
        : null
    },
    getColor() {
      return this.raw.background_color ? `#${this.raw.background_color}` : null
    },
    owner() {
      return this.raw.asset_contract ? this.raw.asset_contract : {}
    },
    isOwner() {
      return this.data.keeper === this.account
    },
    actionTitle() {
      return this.isOwner ? 'Play' : 'Start'
    }
  },

  methods: {
    ...mapActions(['newGotchi']),
    goTo(data) {
      this.$router.push({
        name: 'detail',
        params: {
          id: data.raw.token_id,
          contract: data.raw.asset_contract.address
        }
      })
    },
    action(data) {
      if (!this.isOwner && this.extended == true)
        this.newGotchi({
          idx: data.raw.token_id,
          contract: data.raw.asset_contract.address
        })
      else
        this.$router.push({
          name: 'detail',
          params: {
            id: data.raw.token_id,
            contract: data.raw.asset_contract.address
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import '../scss/mq.scss';

.avatar {
  background: $color3;
  border-radius: 5px;
  overflow: hidden;

  img {
    width: 100%;
  }
}

.gotchi-desc {
  color: $color1;
  margin: auto 5px;

  h3 {
    margin: 0;
    text-align: left;
  }
}

.gotchi-action {
  display: flex;
  margin: auto 20px auto auto;

  @include bp(mobile) {
    margin: 5px;
  }
}

.gotchi-item {
  background: $white;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  box-shadow: 0 2px 10px -2px transparentize($black, 0.85);
  cursor: pointer;
  display: flex;
  margin: 0 0 10px 0;
  transition: all 220ms ease;

  .avatar {
    width: 60px;
    height: 60px;
    margin: 8px;
  }

  &:hover {
    box-shadow: 0 2px 40px -2px transparentize($black, 0.75);
  }

  @include bp(mobile) {
    .avatar {
      border-radius: 10px;
      max-height: 45vw;
      width: 100%;
      height: 100%;
      margin: 0;
    }

    .gotchi-desc {
      margin: 5px;

      h3 {
        font-size: 9pt;
      }

      p {
        font-size: 8pt;
      }
    }
  }
}
</style>
