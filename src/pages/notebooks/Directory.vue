<template>
  <div>
    <h1>{{directory.name}}</h1>

    <IconButton
      v-if="directory.parent"
      @click="() => showDirectory(directory.parent)"
      title="back"
      position="corner"
      icon="md-arrow-round-back"
    />

    <div class="menu">
      <IconButton @click="showNewDirectoryModal = true" title="new directory" icon="md-folder"/>
      <IconButton
        @click="showNewImageModal = true"
        title="new image from template"
        icon="md-bookmarks"
      />
      <IconButton @click="showAddImagesModal = true" title="add image(s)" icon="md-add-circle"/>
    </div>

    <NewDirectoryModal
      v-if="showNewDirectoryModal"
      @close="showNewDirectoryModal = false"
      :parent="directory"
    />
    <NewImageFromTemplateModal
      v-if="showNewImageModal"
      @close="showNewImageModal = false"
      :parent="directory"
    />
    <AddImagesModal
      v-if="showAddImagesModal"
      @close="showAddImagesModal = false"
      :parent="directory"
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
  props: ['directory'],
  components: {
    Gallery,
    NewDirectoryModal,
    NewImageFromTemplateModal,
    AddImagesModal,
    IconButton,
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
