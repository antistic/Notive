<template>
  <div>
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

    <div class="attributes">
      <p
        v-for="{attr_name, attr_data} in file.metadata"
        :key="attr_name"
      >
        {{ attr_name }}: {{ attr_data }}
      </p>
    </div>

    <div>
      <input
        id="attrName"
        v-model="attrName"
        type="text"
        name="attrName"
      >
      <input
        id="attrData"
        v-model="attrData"
        type="text"
        name="attrData"
      >
      <button @click="setFileAttribute">
        add
      </button>
    </div>
  </div>
</template>

<script>
import IconButton from '@/components/IconButton.vue';
import BackIcon from '@icons/md-arrow-round-back.svg';
import Modal from '@/components/Modal.vue';
import Preview from '@/components/Preview.vue';
import { isBrowserSupportedImage } from '@/utils/extensions';
import { remote, shell } from 'electron';

export default {
  components: {
    IconButton,
    BackIcon,
    Modal,
    Preview,
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
      attrName: '',
      attrData: '',
    };
  },
  methods: {
    setFileAttribute() {
      this.file.setAttribute(this.attrName, this.attrData);
    },
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
