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
  color: rgb(95, 103, 110);
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background-color: #dfdfdf;
  background-clip: content-box;
  border: 2px solid transparent;
  border-radius: 20px;
}

html {
  background-color: #fdfdfd;
}

body {
  margin: 0;
}

button {
  cursor: pointer;
}

h1 {
  margin-top: 0;
  text-align: center;
}
</style>
