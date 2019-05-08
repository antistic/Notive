<template>
  <div class="edit-text-input">
    <input
      :id="name"
      v-model="valueData"
      type="text"
      :name="name"
      @enter="$emit('submit', valueData)"
      @blur="$emit('submit', valueData)"
    >
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'name',
    },
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      valueData: this.value,
    };
  },
};
</script>

<style lang="scss">
.edit-text-input {
  position: relative;

  &:hover:after {
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    width: 16px;
    height: 16px;
    pointer-events: none;
    content: "";
    background: linear-gradient($grey-mid, $grey-mid),
      url("../assets/ionicons/md-create.svg?external")
      white;
    background-blend-mode: lighten, normal;
  }

  &:focus:hover:after,
  &:focus-within:hover:after,
  &:active:hover:after {
    background: none;
  }

  input {
    box-sizing: border-box;
    width: 100%;
    padding: 3px;
    padding-right: 16px;
    font-size: 12pt;
    color: $text-color;
    background: transparent;
    border: 0;
    border-bottom: 1px solid transparent;
    transition: 0.3s all;

    &:active,
    &:hover,
    &:focus {
      color: $grey-dark;
      border-bottom-color: $primary-color;
      outline: none;
    }
  }
}
</style>
