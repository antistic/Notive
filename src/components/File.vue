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

    <div class="metadata-container">
      <h3>Metadata</h3>

      <p v-if="!showMore && file.metadata.length === 0">
        No metadata here.
      </p>

      <table class="metadata">
        <tbody v-if="file.metadata.length > 0">
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
        </tbody>

        <tbody v-if="showMore">
          <tr
            v-for="attr_name in unusedAttributes"
            :key="attr_name"
            class="attribute attribute--unused"
          >
            <td class="metadata-name">
              {{ attr_name }}:
            </td>
            <td
              class="metadata-data"
            >
              <EditableField
                :name="`${attrName}-data`"
                value=""
                @submit="(value) => { addFileAttribute(attr_name, value) }"
              />
            </td>
            <td class="metadata-actions"/>
          </tr>
        </tbody>

        <tr
          v-if="showMore"
          class="addRow"
        >
          <td colspan="2">
            <LabelledTextInput
              v-model="attrName"
              label="new attribute name"
            />
          </td>
          <td>
            <IconButton
              options="inline-small"
              text=""
              @click="newAttribute"
            >
              <AddIcon class="hover--spin" />
            </IconButton>
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

      <button
        v-if="!showMore"
        class="show-hide"
        @click="showMore = true"
      >
        <MoreIcon />show more<MoreIcon />
      </button>
      <button
        v-if="showMore"
        class="show-hide"
        @click="showMore = false"
      >
        <LessIcon />show less<LessIcon />
      </button>
    </div>
  </div>
</template>

<script>
import IconButton from '@/components/IconButton.vue';
import LabelledTextInput from '@/components/LabelledTextInput.vue';
import EditableField from '@/components/EditableField.vue';
import BackIcon from '@icons/md-arrow-round-back.svg';
import DeleteIcon from '@icons/md-trash.svg';
import AddIcon from '@icons/md-add-circle.svg';
import MoreIcon from '@icons/md-arrow-dropdown.svg';
import LessIcon from '@icons/md-arrow-dropup.svg';
import Modal from '@/components/Modal.vue';
import Preview from '@/components/Preview.vue';
import { isBrowserSupportedImage } from '@/utils/extensions';
import { remote, shell } from 'electron';
import database from '@/api/database';

export default {
  components: {
    IconButton,
    LabelledTextInput,
    EditableField,
    BackIcon,
    DeleteIcon,
    AddIcon,
    MoreIcon,
    LessIcon,
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
      showMore: false,
      attrName: '',
      attrData: '',
      addErrorMessage: '',
    };
  },
  computed: {
    unusedAttributes() {
      const available = this.$store.availableAttributes;
      return available
        .map(obj => obj.name)
        .filter(attr => !this.file.metadata.map(row => row.attr_name).includes(attr));
    },
  },
  methods: {
    editFileAttribute(name, data) {
      this.file.editAttribute(name, data);
    },
    deleteFileAttribute(name) {
      this.file.deleteAttribute(name);
    },
    addFileAttribute(name, data) {
      this.file.addAttribute(name, data);
    },
    newAttribute() {
      database.newAttribute(this.attrName)
        .then(() => {
          this.addErrorMessage = '';
          this.attrName = '';
        })
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
  width: 400px;
  padding: 2em;
  margin-top: 2em;
  background-color: white;

  h3 {
    margin-top: 0;
    text-align: center;
  }

  table {
    width: 100%;
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

tr.attribute--unused {

  .metadata-name {
    font-style: italic;
    font-weight: normal;
  }
}

tr .metadata-actions button {
  opacity: 0;
  transition: 0.2s opacity;
}

tr:hover .metadata-actions button {
  opacity: 1;
}

tr.addRow {

  td {
    padding-top: 2em;
    padding-bottom: 1em;
    vertical-align: bottom;

    .text-input {
      box-sizing: border-box;
      width: 100%;
    }
  }

  button {
    position: relative;
    top: 5px;
    right: 0;
  }
}

.metadata .error {
  font-weight: bold;
  color: red;
  text-align: center;
}

button.show-hide {
  display: block;
  margin: 0 auto;
  color: $grey-mid;
  background: none;
  border: 0;

  svg {
    position: relative;
    top: 3px;
    height: 15px;
    fill: $grey-mid;
  }

  &:hover,
  &:active,
  &:focus {

    color: $grey-dark;
    outline: none;

    svg {
      fill: $grey-dark;
    }
  }
}
</style>
