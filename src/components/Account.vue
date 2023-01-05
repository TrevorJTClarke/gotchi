<template>
  <div class="header-account">
    <!-- hasProvider &&  -->
    <div v-if="account" @click="showLoginPrompt = true" class="btn-account not-active" :title="account">
      <img src="static/ios-contact-outline.svg" alt="">
      <span>{{ acct }}</span>
    </div>
    <div v-else @click="showLoginPrompt = true" class="btn-account">
      <img class="lo-icn" src="static/log-in.svg">
      <span>Login</span>
    </div>

    <Modal class="login-prompt" v-if="showLoginPrompt" @close="showLoginPrompt = false">
      <i slot="icon" />
      <div class="modal-header" slot="header">
        <h4>Gotchi Account</h4>
      </div>
      <div slot="body">
        <div v-if="acct" class="accounts-list">
          <div class="account-item" :title="account">
            <img src="static/ios-contact-outline.svg" alt="">
            <span>{{ acctLrg }}</span>
          </div>
          <button class="btn btn-primary" @click.prevent="showLoginPrompt = false">
            <span>Close</span>
          </button>
          <button class="btn btn-logout" @click.prevent="">
            <img src="static/log-out.svg">
            <span>Logout</span>
          </button>
        </div>
        <div v-else class="connection-list">
          <button class="btn btn-social" @click.prevent="signInWithGoogle()">
            <i class="icon">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /><path fill="none" d="M0 0h48v48H0z" /></svg>
            </i>
            <span>Sign in with Google</span>
          </button>
          <small>You will need Web3 account to use Gotchi!<br>Signing in with Google uses <a href="https://tor.us/" target="_blank">tor.us</a>, a Web3 provider simplifying the login process.</small>
          <!-- <a href="https://metamask.io/" target="_blank">
            <img src="/static/metamask.png" alt="MetaMask required!" width="250px">
          </a> -->
        </div>
      </div>
      <div slot="footer" />
    </Modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Modal from './Modal.vue'

export default {
  name: 'Account',

  components: {
    Modal
  },

  data() {
    return {
      showLoginPrompt: false
    }
  },

  computed: {
    ...mapGetters(['hasProvider', 'account']),
    acct() {
      const half = 5
      const str = this.account
      return str ? `${str.substring(0, half)}…${str.slice(-half)}` : null
    },
    acctLrg() {
      const half = 10
      const str = this.account
      return str ? `${str.substring(0, half)}…${str.slice(-half)}` : null
    }
  },

  methods: {
    ...mapActions(['connect', 'checkAccount']),
    trySetAccount() {
      this.checkAccount()
      setTimeout(() => {
        if (!this.account) return
        console.log('No Torus account, trying again')
        this.trySetAccount()
      }, 1000)
    },
    signInWithGoogle() {
      // NOTE: From the torus team, just need to call their method
      if (window.metamaskStream && window.metamaskStream.write) {
        console.log('Torus Web3!')
        window.metamaskStream.write({
          name: 'oauth',
          data: 'test',
          note: 'hello from gotchi'
        })

        // start address connection checker
        // NOTE: Should be changed to callback or promise!!!!!
        this.trySetAccount()
      } else {
        console.log('Standard Web3')
        this.connect()
      }
    }
  },

  mounted() {
    // immediately check if we came back
    this.checkAccount()
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables';
@import '../scss/mq';

.header-account {
  display: flex;
}

.btn-account {
  background: $white;
  border: 2px solid $color1;
  border-radius: 40px;
  cursor: pointer;
  display: flex;
  margin: auto;
  padding: 1px;

  img {
    height: 28px;
    width: 28px;
  }

  span {
    margin: auto 10px auto 5px;
  }

  .lo-icn {
    margin: 3px;
    height: 22px;
    width: 22px;
  }
}

.btn-social {
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

.login-prompt {
  .modal-icon i {
    display: none;
  }

  .modal-header {
    padding: 0;

    h4 {
      margin: 0;
      font-size: 18pt;
      font-weight: 100;
    }
  }
}

.connection-list {
  small {
    display: block;
    font-size: 11pt;
    margin: 40px auto 10px;
    text-align: center;
  }
}

.account-item,
.btn-logout,
.btn-primary {
  display: flex;
  border-radius: 40px;

  img {
    height: 28px;
    width: 28px;
  }

  span {
    display: flex;
    font-size: 12pt;
    margin: auto 10px;
  }
}

.account-item {
  border: 2px solid $color1;

  img {
    height: 40px;
    width: 40px;
  }

  span {
    font-weight: bold;
  }
}

.btn-primary,
.btn-logout {
  background: $lightgrey;
  border: 2px solid $lightgrey;
  color: $black;
  display: flex;
  outline: 0;
  padding: 7px 8px 7px;
  margin: 40px auto 10px;
  width: 150px;

  span {
    margin: auto;
  }
}

.btn-primary {
  background: $color3;
  border: 2px solid $color3;
  padding: 10px 8px;
}
</style>
