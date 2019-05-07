<template>
  <div>
    <div v-if="!isReady">
      loading
    </div>
    <slot v-if="isReady" />
  </div>
</template>

<script>
export default {
  props: {
    isReady: Boolean,
  },
};
</script>
