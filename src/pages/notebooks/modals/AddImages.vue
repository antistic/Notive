<template>
  <Modal @close="$emit('close')">
    <div>
      <h2>add image(s)</h2>
      <p>
        {{ imagePaths }}
        <button @click="chooseImages">
          choose image(s)
        </button>
      </p>
      <button
        :disabled="imagePaths.length === 0"
        @click="addNewImages"
      >
        add image(s)
      </button>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import notebooks from '@/api/notebooks';
import { showOpenDialog } from '@/utils/extensions';

export default {
  components: { Modal },
  props: {
    parent: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      imagePaths: [],
    };
  },
  methods: {
    chooseImages() {
      showOpenDialog(
        {
          title: 'Choose Image',
          buttonLabel: 'Choose Image',
          properties: ['openFile', 'multiSelections'],
        },
        (filePaths) => {
          if (filePaths) {
            this.imagePaths = filePaths;
          }
        },
      );
    },
    addNewImages() {
      this.imagePaths.forEach((imagePath) => {
        notebooks.addFile(this.parent, imagePath);
      });

      this.$emit('close');
    },
  },
};
</script>
