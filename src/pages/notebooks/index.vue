<template>
  <div>
    <Directory
      v-if="active === 'directory'"
      :directory="currentDirectory"
      @showDirectory="showDirectory"
      @showFile="showFile"
    />
    <File
      v-if="active === 'file'"
      :file="currentFile"
      @showDirectory="showDirectory"
      @showFile="showFile"
    />
  </div>
</template>

<script>
import File from '@/components/File.vue';
import Directory from './Directory.vue';

export default {
  components: {
    Directory,
    File,
  },
  props: {
    root: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      active: 'directory',
      currentDirectory: this.root,
      currentFile: null,
    };
  },
  methods: {
    showDirectory(directory) {
      this.currentDirectory = directory;
      this.active = 'directory';
    },
    showFile(file) {
      this.currentFile = file;
      this.active = 'file';
    },
  },
};
</script>

<style lang="scss">
.menu {
  display: flex;
  justify-content: center;

  button {
    margin: 0 0.5em;
  }
}
</style>
