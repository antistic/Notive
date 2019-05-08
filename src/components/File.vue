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
        :src="`notive://${file.path}`"
        :alt="file.path"
      >
    </Modal>

    <div class="metadata-container">
      <h3>Metadata</h3>
      <table class="metadata">
        <tr
          v-for="{attr_name, attr_data} in file.metadata"
          :key="`${attr_name}-${attrData}`"
        >
          <td class="metadata-name">
            {{ attr_name }}:
          </td>
          <td class="metadata-data">
            <EditableField
              :name="`${attrName}-data`"
              :value="attr_data"
              @submit="(value) => { editFileAttribute(attr_name, value) }"
            />
          </td>
        </tr>

        <tr>
          <td>
            <LabelledTextInput
              v-model="attrName"
              label="name"
            />
          </td>
          <td>
            <LabelledTextInput
              v-model="attrData"
              label="data"
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
  </div>
</template>

<script>
import IconButton from '@/components/IconButton.vue';
import LabelledTextInput from '@/components/LabelledTextInput.vue';
import EditableField from '@/components/EditableField.vue';
import BackIcon from '@icons/md-arrow-round-back.svg';
import Modal from '@/components/Modal.vue';
import Preview from '@/components/Preview.vue';
import { isBrowserSupportedImage } from '@/utils/extensions';
import { remote, shell } from 'electron';

export default {
  components: {
    IconButton,
    LabelledTextInput,
    EditableField,
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
    editFileAttribute(name, data) {
      this.file.setAttribute(name, data);
    },
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

.metadata-container {
  padding: 2em;
  margin-top: 2em;
  background-color: white;

  h3 {
    margin-top: 0;
    text-align: center;
  }
}

.metadata-name {
  font-weight: bold;
  text-align: right;
}

.metadata td {
  font-size: 12pt;

  &:nth-child(2) {
    min-width: 300px;
  }
}

.metadata tr:not(:last-child) td:nth-child(1) {
  padding-bottom: 6px;
}

.metadata tr:last-child {
  height: 4em;

  td {
    vertical-align: bottom;

    .text-input {

      box-sizing: border-box;
      width: 100%;
    }
  }
}
</style>
