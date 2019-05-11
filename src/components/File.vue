<template>
  <div class="file">
    <IconButton
      v-if="file.parent"
      options="top-left label-besides"
      text="Back"
      @click="$emit('showDirectory', file.parent)"
    >
      <BackIcon class="hover--move-left" />
    </IconButton>

    <Preview
      :images="[file.thumbnailPath]"
      item-type="full"
      @click="openFile"
    />

    <Modal
      v-if="showImageModal"
      modal-type="image"
      @close="showImageModal = false"
    >
      <img
        :src="`notive://${file.path}`"
        :alt="file.path"
      >
    </Modal>

    <FileMetadata :file="file" />
  </div>
</template>

<script>
import IconButton from '@/components/IconButton.vue';
import BackIcon from '@icons/md-arrow-round-back.svg';
import Modal from '@/components/Modal.vue';
import Preview from '@/components/Preview.vue';
import FileMetadata from '@/components/FileMetadata.vue';
import { isBrowserSupportedImage } from '@/utils/extensions';
import { remote, shell } from 'electron';

export default {
  components: {
    IconButton,
    BackIcon,
    Modal,
    Preview,
    FileMetadata,
  },
  props: {
    file: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      showImageModal: false,
    };
  },
  methods: {
    openFile() {
      if (isBrowserSupportedImage(this.file.path)) {
        this.showImageModal = true;
      } else {
        remote.dialog.showMessageBox(
          {
            type: 'question',
            message: 'Open in default app?',
            buttons: ['Cancel', 'Open'],
          },
          (response) => {
            switch (response) {
              case 0:
                // cancel
                break;
              case 1:
                // open
                shell.openItem(this.file.path);
                break;
              default:
            }
          },
        );
      }
    },
  },
};
</script>

<style lang="scss">
.file {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
}
</style>
