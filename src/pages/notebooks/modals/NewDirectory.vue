<template>
  <Modal @close="$emit('close')">
      <div>
        <h2>New directory name</h2>
        <input
          type="text"
          ref="directoryNameInput"
          name="directoryName"
          id="directoryName"
          v-model="newDirectoryName"
          @keyup.enter="createNewDirectory"
          :placeholder="placeholderName"
        >
        <button @click="createNewDirectory">Create directory</button>
      </div>
    </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import notebooks from '@/api/notebooks';

export default {
  props: ['parent'],
  components: { Modal },
  data() {
    return {
      newDirectoryName: '',
      placeholderName: 'New Folder',
    };
  },
  methods: {
    createNewDirectory() {
      notebooks.newDirectory(this.parent, this.newDirectoryName || this.placeholderName);
      this.$emit('close');
    },
  },
};
</script>
