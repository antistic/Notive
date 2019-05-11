<template>
  <div
    @dragenter="startDrop"
    @dragover="e => e.preventDefault()"
  >
    <div
      :class="{droptarget: true, dragging: dragging}"
      @dragenter="startDrop"
      @dragover="e => e.preventDefault()"
      @dragleave="stopDrop"
      @drop="drop"
    />
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
import notebooks from '@/api/notebooks';

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
      dragging: false,
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
    startDrop(event) {
      event.preventDefault();
      this.dragging = true;
    },
    stopDrop(event) {
      event.preventDefault();
      this.dragging = false;
    },
    drop(event) {
      event.preventDefault();
      this.dragging = false;

      for (let i = 0; i < event.dataTransfer.items.length; i += 1) {
        const item = event.dataTransfer.items[i];

        if (item.kind === 'file') {
          const file = item.getAsFile();
          notebooks.addFile(this.directory, file.path);
        }
      }
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

.droptarget {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

  display: none;
  width: 100vw;
  height: 100vh;
}

.droptarget.dragging {
  display: block;

  &:before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100vw;
    height: 100vh;
    content: "";
    background: rgba($primary-color, 0.5);
  }

  &:after {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 100;
    padding: 0.5em 1em;
    font-size: 2.5em;
    content: "drop here!";
    background: white;
    border: 5px dashed $primary-color;
    border-radius: 10px;
    transform: translate(-50%, -50%);
  }
}
</style>
