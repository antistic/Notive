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
import Directory from './Directory.vue';
import File from '@/components/File.vue';

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
    showItem(item) {
      switch (item.type) {
        case 'directory':
          this.showDirectory(item);
          break;
        case 'file':
          this.showFile(item);
          break;
        default:
      }
    },
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
