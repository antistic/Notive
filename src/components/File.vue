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
      :item-type="file.type"
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

    <h3>Metadata</h3>
    <table class="metadata">
      <tr
        v-for="{attr_name, attr_data} in file.metadata"
        :key="`${attr_name}-${attrData}`"
      >
        <td class="metadata-name">
          {{ attr_name }}
        </td>
        <td class="metadata-data">
          {{ attr_data }}
        </td>
      </tr>

      <tr>
        <td>
          <LabelledTextInput
            v-model="attrName"
            label="Name"
          />
        </td>
        <td>
          <LabelledTextInput
            v-model="attrData"
            label="Data"
          />
        </td>
        <td>
          <button @click="setFileAttribute">
            add
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import IconButton from '@/components/IconButton.vue';
import LabelledTextInput from '@/components/LabelledTextInput.vue';
import BackIcon from '@icons/md-arrow-round-back.svg';
import Modal from '@/components/Modal.vue';
import Preview from '@/components/Preview.vue';
import { isBrowserSupportedImage } from '@/utils/extensions';
import { remote, shell } from 'electron';

export default {
  components: {
    IconButton,
    LabelledTextInput,
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
.file {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
}

.metadata-name {
  font-weight: bold;
  text-align: right;

  &:after {
    content: ":";
  }
}

.metadata td {
  padding: 0 0.5em;
}

.metadata tr:last-child {
  height: 4em;

  td {
    vertical-align: bottom;
  }
}
</style>
