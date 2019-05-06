<template>
    <button
      :class="position"
      @click="$emit('click')"
      :title="title"
    >
      <i :class="`icon ion-${icon}`" />
    </button>
</template>

<script>
export default {
  props: ['icon', 'title', 'position'],
};
</script>

<style lang="scss" scoped>
  button {
    padding: 0.3em;
    font-size: 2em;
    color: rgb(72, 146, 136);
    background: none;
    border: none;

    &:hover {
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }

    &.corner {
      position: absolute;
      top: 1em;
      left: 1em;
      z-index: 20;
    }

    &.corner-of-box {
      position: absolute;
      top: 0.5em;
      right: 0.5em;
      z-index: 20;
    }
  }
</style>
