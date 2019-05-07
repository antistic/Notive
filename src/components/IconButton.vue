<template>
  <button
    :class="[
      'iconButton',
      position ? `iconButton--${position}` : ''
    ]"
    :title="title"
    @click="$emit('click')"
  >
    <i :class="`icon ion-${icon}`" />
  </button>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: 'Warning',
    },
    title: {
      type: String,
      default: 'iconButton',
    },
    position: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.iconButton {
  padding: 0.3em;
  font-size: 2em;
  color: rgb(72, 146, 136);
  background: none;
  border: 0;

  &:hover {
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }
}

.iconButton--corner {
  position: absolute;
  top: 1em;
  left: 1em;
  z-index: 20;
}

.iconButton--corner-of-box {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  z-index: 20;
}
</style>
