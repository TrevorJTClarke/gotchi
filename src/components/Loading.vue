<template>
  <div class="box-loading" />
</template>

<script>
export default { name: 'Loading' }
</script>

<style lang="scss" scoped>
$size: 100px;

.box-loading {
  width: $size;
  height: $size;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  &:before {
    content: '';
    width: $size;
    height: 5px;
    background: #000;
    opacity: 0.1;
    position: absolute;
    top: 119px;
    left: 0;
    border-radius: 50%;
    animation: shadow 0.5s linear infinite;
  }

  &:after {
    content: '';
    width: $size;
    height: $size;
    background: #1a6844;
    animation: animate 0.5s linear infinite;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 10px;
  }
}

@keyframes animate {
  17% {
    border-bottom-right-radius: 1px;
  }
  25% {
    transform: translateY(9px) rotate(22.5deg);
  }
  50% {
    transform: translateY(18px) scale(1, 0.9) rotate(45deg);
    border-bottom-right-radius: 40px;
  }
  75% {
    transform: translateY(9px) rotate(67.5deg);
  }
  100% {
    transform: translateY(0) rotate(90deg);
  }
}

@keyframes shadow {
  0%,
  100% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.2, 1);
  }
}
</style>
