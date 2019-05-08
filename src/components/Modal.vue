<template>
  <div
    class="modal"
    @click.self="hide"
  >
    <div
      :class="[
        'contents',
        modalType ? `contents--${modalType}` : ''
      ]"
    >
      <IconButton
        options="top-right label-none"
        @click="hide"
      >
        <CloseIcon class="closeIcon ios" />
      </IconButton>
      <slot />
    </div>
  </div>
</template>

<script>
import IconButton from '@/components/IconButton.vue';
import CloseIcon from '@icons/ios-close.svg';

export default {
  components: { IconButton, CloseIcon },
  props: {
    modalType: {
      type: String,
      default: '',
    },
  },
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
  background-color: rgba(black, 0.2);

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
  }

  .contents--image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    min-width: 200px;
    height: auto;
    min-height: 200px;
    padding: 0;
    overflow: hidden;
    background-color: transparent;

    img {
      max-width: calc(100vw - 6em);
      max-height: calc(100vh - 6em);
      object-fit: scale-down;
    }
  }
}

.closeIcon {
  background: radial-gradient(circle, white, white 55%, transparent 58%);
}
</style>
