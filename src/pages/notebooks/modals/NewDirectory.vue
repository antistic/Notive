<template>
  <Modal @close="$emit('close')">
    <div>
      <h2>New directory name</h2>
      <input
        id="directoryName"
        ref="directoryNameInput"
        v-model="newDirectoryName"
        type="text"
        name="directoryName"
        :placeholder="placeholderName"
        @keyup.enter="createNewDirectory"
      >
      <button @click="createNewDirectory">
        Create directory
      </button>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import notebooks from '@/api/notebooks';

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
