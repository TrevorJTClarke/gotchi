<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-icon">
            <slot name="icon">
              <i class="icon">🎉</i>
            </slot>
          </div>

          <div class="modal-header">
            <slot name="header"/>
          </div>

          <div class="modal-body">
            <slot name="body"/>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="btn btn-large btn-modal" @click="$emit('close')">OK</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',

  data() {
    return {
      showModal: false
    }
  }
}
</script>

<style lang="scss">
@import '../scss/variables.scss';

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    141deg,
    rgba(0, 102, 22, 0.63),
    rgba(13, 80, 71, 0.71)
  );
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: $white;
  border-radius: 50px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 40px 36px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.5s ease;
}

.modal-icon {
  text-align: center;

  i {
    font-size: 120pt;
    font-style: normal;
    display: block;
    height: 210px;
  }
}

.modal-header {
  text-align: center;
  padding: 0 0 10px;

  h3 {
    font-size: 30pt;
    font-family: Arial Black, Arial, sans-serif;
    text-transform: uppercase;
    transform: scale(1, 2);
    margin: 0;
  }
}

.modal-body {
  margin: 0;

  p {
    padding: 12px 0;
    font-size: 14pt;
    font-weight: bold;
    text-align: center;
  }
}

.modal-footer {
  .btn-modal {
    border-radius: 50px;
  }
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
