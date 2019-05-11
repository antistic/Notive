<template>
  <div class="text-input">
    <label
      :for="label"
      :class="value !== '' ? 'filled' : ''"
    >{{ label }}</label>
    <input
      :id="label"
      type="text"
      :name="label"
      :value="value"
      @input="$emit('input', $event.target.value)"
    >
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'label',
    },
    value: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.text-input {
  position: relative;
  display: inline-block;

  label,
  input {
    display: block;
  }

  label {
    position: absolute;
    bottom: 0.5em;
    left: 3px;
    color: $grey-mid;
    pointer-events: none;
    transition: 0.3s all;
  }

  &:active label,
  &:focus-within label,
  label.filled {
    bottom: 2em;
    font-weight: bold;
    color: $grey-dark
  }

  input {
    box-sizing: border-box;
    width: 100%;
    padding: 0.5em 3px;
    font-size: 12pt;
    color: $text-color;
    border: 0;
    border-bottom: 1px solid $primary-color;

    &:focus {
      outline: none;
    }
  }
}
</style>
