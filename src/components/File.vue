<template>
  <div>
    <IconButton
      v-if="file.parent"
      title="back"
      position="corner"
      icon="md-arrow-round-back"
      @click="$emit('showDirectory', file.parent)"
    />

    <Preview
      :images="[file.thumbnailPath]"
      :preview-type="file.type"
      @click="openFile"
    />

    <Modal
      v-if="showImageModal"
      modal-type="image"
      @close="showImageModal = false"
    >
      <img
        :src="`file:///${file.path}`"
        :alt="file.path"
      >
    </Modal>
  </div>
</template>

<script>
import IconButton from '@/components/IconButton.vue';
import Modal from '@/components/Modal.vue';
import Preview from '@/components/Preview.vue';
import { isBrowserSupportedImage } from '@/utils/extensions';
import { remote, shell } from 'electron';

export default {
  components: { IconButton, Modal, Preview },
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
</style>
