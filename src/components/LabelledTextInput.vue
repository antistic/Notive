<template>
  <div class="text-input">
    <label :for="label">{{ label }}</label>
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

  label,
  input {
    display: block;
  }

  label {
    font-weight: bold;
  }

  input {
    width: 100%;
  }
}
</style>
