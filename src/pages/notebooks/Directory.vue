<template>
  <div>
    <h1>{{ directory.name || 'Notebooks' }}</h1>

    <IconButton
      v-if="directory.parent"
      options="top-left label-besides"
      text="Back"
      @click="() => showDirectory(directory.parent)"
    >
      <BackIcon class="hover--move-left" />
    </IconButton>

    <div class="menu">
      <IconButton
        text="New Folder"
        @click="showNewDirectoryModal = true"
      >
        <FolderIcon class="hover--twitch" />
      </IconButton>
      <IconButton
        text="Use Template"
        @click="showNewImageModal = true"
      >
        <TemplateIcon class="hover--twitch ios" />
      </IconButton>
      <IconButton
        text="Add Images"
        @click="showAddImagesModal = true"
      >
        <ImagesIcon class="hover--twitch" />
      </IconButton>
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
      @showItem="showItem"
    />
  </div>
</template>

<script>
import IconButton from '@/components/IconButton.vue';
import BackIcon from '@icons/md-arrow-round-back.svg';
import FolderIcon from '@icons/md-folder-open.svg';
import TemplateIcon from '@icons/ios-flask.svg';
import ImagesIcon from '@icons/md-images.svg';
import Gallery from './Gallery.vue';
import NewImageFromTemplateModal from './modals/NewImageFromTemplate.vue';
import AddImagesModal from './modals/AddImages.vue';
import NewDirectoryModal from './modals/NewDirectory.vue';

export default {
  components: {
    Gallery,
    NewDirectoryModal,
    NewImageFromTemplateModal,
    AddImagesModal,
    IconButton,
    BackIcon,
    FolderIcon,
    TemplateIcon,
    ImagesIcon,
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
