<template>
  <div class="app">
    <Loader :is-ready="$store.ready">
      <Notebooks :root="$store.state.fileTree" />
    </Loader>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import Notebooks from '@/pages/notebooks';

export default {
  components: { Loader, Notebooks },
};
</script>

<style lang="scss">
.app {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  padding: 3em 2em;
  overflow-y: auto;
  font-family: "Segoe UI",
    Calibri,
    "Noto Sans",
    "Helvetica Neue",
    Helvetica,
    sans-serif;
  color: $text-color;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(black, 0.05);
}

::-webkit-scrollbar-thumb {
  background-color: rgba(black, 0.1);
  background-clip: content-box;
}

html {
  background-color: $background-color;
}

body {
  margin: 0;
}

button {
  cursor: pointer;
}

h1 {
  margin-top: 0;
  font-size: 2.5em;
  text-align: center;
  text-shadow: 3px 3px 0 white;
}

button {
  padding: 0.5em 1em;
  color: white;
  background: $primary-color;
  border: 0;
  border-bottom: 6px solid $primary-dark;
  border-radius: 3px;
  transition: 0.1s all;

  &:hover {
    border-bottom-width: 2px;
    transform: translateY(1px);
  }
}
</style>
