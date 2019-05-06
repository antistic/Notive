<template>
  <div class="modal" @click.self="hide">
    <div :class="`contents ${modalType}`">
      <IconButton @click="hide" position="corner-of-box" icon="md-close-circle" />
      <slot/>
    </div>
  </div>
</template>

<script>
import IconButton from '@/components/IconButton.vue';

export default {
  props: ['modalType'],
  components: { IconButton },
  methods: {
    hide() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.2);

  .contents {
    position: relative;
    width: 400px;
    max-width: calc(100vw - 6em);
    height: 300px;
    max-height: calc(100vh - 6em);
    padding: 2em;
    overflow-y: auto;
    cursor: default;
    background-color: white;

    &.image {
      width: auto;
      min-width: 200px;
      min-height: 200px;
      height: auto;
      padding: 0;
      overflow: hidden;
      background-color: transparent;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        max-width: calc(100vw - 6em);
        max-height: calc(100vh - 6em);
        object-fit: scale-down;
      }
    }
  }
}
</style>
