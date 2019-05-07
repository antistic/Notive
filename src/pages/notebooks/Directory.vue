<template>
  <div>
    <h1>{{ directory.name }}</h1>

    <IconButton
      v-if="directory.parent"
      title="back"
      position="corner"
      icon="md-arrow-round-back"
      @click="() => showDirectory(directory.parent)"
    />

    <div class="menu">
      <IconButton
        title="new directory"
        icon="md-folder"
        @click="showNewDirectoryModal = true"
      />
      <IconButton
        title="new image from template"
        icon="md-bookmarks"
        @click="showNewImageModal = true"
      />
      <IconButton
        title="add image(s)"
        icon="md-add-circle"
        @click="showAddImagesModal = true"
      />
    </div>

    <NewDirectoryModal
      v-if="showNewDirectoryModal"
      :parent="directory"
      @close="showNewDirectoryModal = false"
    />
    <NewImageFromTemplateModal
      v-if="showNewImageModal"
      :parent="directory"
      @close="showNewImageModal = false"
    />
    <AddImagesModal
      v-if="showAddImagesModal"
      :parent="directory"
      @close="showAddImagesModal = false"
    />

    <Gallery
      v-if="directory.type === 'directory'"
      :contents="directory.contents"
      @showDirectory="showDirectory"
      @showFile="showFile"
    />
  </div>
</template>

<script>
import IconButton from '@/components/IconButton.vue';
import Gallery from './Gallery.vue';
import AddImagesModal from './modals/AddImages.vue';
import NewDirectoryModal from './modals/NewDirectory.vue';
import NewImageFromTemplateModal from './modals/NewImageFromTemplate.vue';

export default {
  components: {
    Gallery,
    NewDirectoryModal,
    NewImageFromTemplateModal,
    AddImagesModal,
    IconButton,
  },
  props: {
    directory: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      showNewDirectoryModal: false,
      showNewImageModal: false,
      showAddImagesModal: false,
    };
  },
  methods: {
    showDirectory(directory) {
      this.$emit('showDirectory', directory);
    },
    showFile(file) {
      this.$emit('showFile', file);
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
