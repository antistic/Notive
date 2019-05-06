<template>
  <Modal @close="$emit('close')">
      <div>
        <h2>new image</h2>
        <input
          type="text"
          name="imageName"
          id="imageName"
          v-model="newImageName"
          @keyup.enter="createNewImage"
          :placeholder="placeholderName"
        >
        <p>
          {{ templatePath }}
          <button @click="chooseTemplate">choose template</button>
        </p>
        <button :disabled="templatePath === ''"  @click="createNewImage">new image</button>
      </div>
    </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import notebooks from '@/api/notebooks';
import { showOpenDialog } from '@/utils/extensions';

export default {
  props: ['parent'],
  components: { Modal },
  data() {
    return {
      newImageName: '',
      templatePath: '',
      placeholderName: 'Untitled',
    };
  },
  methods: {
    chooseTemplate() {
      showOpenDialog(
        {
          title: 'Choose template',
          defaultPath: this.$appPaths.templates,
          buttonLabel: 'Use Template',
        },
        (filePaths) => {
          if (filePaths) {
            this.templatePath = filePaths[0];
          }
        },
      );
    },
    createNewImage() {
      notebooks.newFileFromTemplate(
        this.parent,
        this.newImageName || this.placeholderName,
        this.templatePath,
      );
      this.$emit('close');
    },
  },
};
</script>
