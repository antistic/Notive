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
          class="attribute"
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
          <td class="metadata-actions">
            <IconButton
              options="grey inline-small"
              text=""
              @click="() => deleteFileAttribute(attr_name)"
            >
              <DeleteIcon />
            </IconButton>
          </td>
        </tr>

        <tr class="addRow">
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
            <button @click="addFileAttribute">
              add
            </button>
          </td>
        </tr>

        <tr>
          <td
            colspan="3"
            class="error"
          >
            {{ addErrorMessage }}
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
import DeleteIcon from '@icons/md-trash.svg';
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
    DeleteIcon,
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
      addErrorMessage: '',
    };
  },
  methods: {
    editFileAttribute(name, data) {
      this.file.editAttribute(name, data);
    },
    deleteFileAttribute(name) {
      this.file.deleteAttribute(name);
    },
    addFileAttribute() {
      this.file.addAttribute(this.attrName, this.attrData)
        .then(() => { this.addErrorMessage = ''; })
        .catch((error) => {
          switch (error.message) {
            case 'SQLITE_CONSTRAINT: UNIQUE constraint failed: Attributes.file_id, Attributes.attr_name':
              this.addErrorMessage = `'${this.attrName}' already exists (maybe you meant to edit?)`;
              break;
            default:

              this.addErrorMessage = error.message;
          }
        });
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

  td {
    font-size: 12pt;
  }

  .metadata-name {
    padding-bottom: 6px;
    font-weight: bold;
    text-align: right;
  }

  .metadata-data {
    min-width: 300px;
  }

  .metadata-actions {
    padding-bottom: 3px;
  }
}

tr .metadata-actions button {
  opacity: 0;
  transition: 0.2s opacity;
}

tr:hover .metadata-actions button {
  opacity: 1;
}

.metadata .addRow {
  height: 4em;

  td {
    vertical-align: bottom;

    .text-input {

      box-sizing: border-box;
      width: 100%;
    }
  }

  button {
    padding: 0.5em 1em;
    color: white;
    background: $primary-color;
    border: 0;
    border-bottom: 6px solid $primary-dark;
    border-radius: 3px;
    transition: 0.1s all;

    &:hover,
    &:active,
    &:focus {
      border-bottom-width: 2px;
      outline: none;
      transform: translateY(1px);
    }
  }
}

.metadata .error {
  font-weight: bold;
  color: red;
  text-align: center;
}
</style>
