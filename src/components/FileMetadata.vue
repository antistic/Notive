<template>
  <div class="metadata-container">
    <h3>Metadata</h3>

    <p v-if="!showMore && file.metadata.length === 0">
      No metadata here.
    </p>

    <section class="metadata">
      <ul v-if="file.metadata.length > 0">
        <li
          v-for="{attr_name, attr_data} in file.metadata"
          :key="`${attr_name}-${attrData}`"
          class="attribute"
        >
          <span class="metadata-name">
            {{ attr_name }}:
          </span>
          <span class="metadata-data">
            <EditableField
              :name="`${attrName}-data`"
              :value="attr_data"
              @submit="(value) => { editFileAttribute(attr_name, value) }"
            />
          </span>
          <span class="metadata-actions">
            <IconButton
              options="grey inline-small"
              text=""
              @click="() => deleteFileAttribute(attr_name)"
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </li>
      </ul>

      <button
        v-if="!showMore"
        class="show-more"
        @click="showMore = true"
      >
        <MoreIcon />show more<MoreIcon />
      </button>
      <button
        v-if="showMore"
        class="show-less"
        @click="showMore = false"
      >
        <LessIcon />show less<LessIcon />
      </button>

      <ul
        v-if="showMore"
        class="unused-attributes"
      >
        <li
          v-for="attr_name in unusedAttributes"
          :key="attr_name"
          class="attribute"
        >
          <span class="metadata-name">
            {{ attr_name }}:
          </span>
          <EditableField
            :name="`${attrName}-data`"
            value=""
            class="metadata-data"
            @submit="(value) => { addFileAttribute(attr_name, value) }"
          />
        </li>
      </ul>

      <p
        v-if="showMore"
        class="addRow"
      >
        <LabelledTextInput
          v-model="attrName"
          label="new field"
        />
        <IconButton
          options="inline-small"
          text=""
          @click="newAttribute"
        >
          <AddIcon class="hover--spin" />
        </IconButton>
      </p>

      <p
        v-if="addErrorMessage"
        class="error"
      >
        {{ addErrorMessage }}
      </p>
    </section>
  </div>
</template>

<script>
import DeleteIcon from '@icons/md-trash.svg';
import AddIcon from '@icons/md-add-circle.svg';
import MoreIcon from '@icons/md-arrow-dropdown.svg';
import LessIcon from '@icons/md-arrow-dropup.svg';
import IconButton from '@/components/IconButton.vue';
import LabelledTextInput from '@/components/LabelledTextInput.vue';
import EditableField from '@/components/EditableField.vue';
import database from '@/api/database';

export default {
  components: {
    IconButton,
    LabelledTextInput,
    EditableField,
    DeleteIcon,
    AddIcon,
    MoreIcon,
    LessIcon,
  },
  props: {
    file: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
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
      if (data === '') {
        this.deleteFileAttribute(name);
      } else {
        this.file.editAttribute(name, data);
      }
    },
    deleteFileAttribute(name) {
      this.file.deleteAttribute(name);
    },
    addFileAttribute(name, data) {
      if (data !== '') this.file.addAttribute(name, data);
    },
    newAttribute() {
      database.newAttribute(this.attrName)
        .then(() => {
          this.addErrorMessage = '';
          this.attrName = '';
        })
        .catch((error) => {
          switch (error.message) {
            case 'SQspanTE_CONSTRAINT: UNIQUE constraint failed: Attributes.file_id, Attributes.attr_name':
              this.addErrorMessage = `'${this.attrName}' already exists (maybe you meant to edit?)`;
              break;
            default:
              this.addErrorMessage = error.message;
          }
        });
    },
  },
};
</script>

<style lang="scss">
.metadata-container {
  position: relative;
  top: -5px;
  left: -5px;
  width: 400px;
  padding: 2em;
  margin-top: 2em;
  background-color: white;
  box-shadow: 10px 10px 0 $grey-light;

  h3 {
    margin-top: 0;
    text-align: center;
  }
}

.metadata {
  display: grid;
  grid-template-columns: 1fr 3fr 2em;
  grid-auto-rows: 1fr;
  grid-gap: 5px;
  width: 100%;
  font-size: 12pt;

  ul,
  li {
    display: contents;
  }

  li {
    list-style: none;
  }

  .metadata-name {
    grid-column: 1;
    align-self: baseline;
    justify-self: end;
    font-weight: bold;
  }

  .metadata-data {
    display: block;
    grid-column: 2;
  }

  .metadata-actions {
    grid-column: 3;
    justify-self: end;
  }

  .error {
    grid-column: 1 / 4;
    font-weight: bold;
    color: red;
    text-align: center;
  }
}

ul.unused-attributes .metadata-name {
  font-style: italic;
  font-weight: normal;
}

.metadata li {

  & .metadata-actions button {
    opacity: 0;
    transition: 0.2s opacity;
  }

  &:hover .metadata-actions button {
    opacity: 1;
  }
}

.metadata .addRow {
  display: contents;

  > * {
    grid-row-end: span 2;
    align-self: end;
  }

  :first-child {
    grid-column: 1 / 3;
  }

  :last-child {
    justify-self: end;
  }
}

ul.unused-attributes .metadata-name,
ul.unused-attributes .metadata-data,
.metadata .addRow > * {
  position: relative;
  animation: fade-down 0.2s;
}

@keyframes fade-down {

  from {
    top: -10px;
    opacity: 0;
  }

  to {
    top: 0;
    opacity: 1;
  }
}

.show-more,
.show-less {
  grid-column: 1 / 4;
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
