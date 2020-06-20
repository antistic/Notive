<template>
  <div class="gallery">
    <Modal
      v-if="showImageModal"
      modal-type="image"
      @close="showImageModal = false"
    >
      <img :src="currentImage.path">
    </Modal>

    <Preview
      v-for="item in sortedContents"
      :key="item.path"
      :images="getImagePaths(item)"
      :name="item.type === 'directory' ? item.name : ''"
      :item-type="item.type"
      @click="$emit('showItem', item)"
    />
  </div>
</template>

<script>
import Preview from '@/components/Preview.vue';
import Modal from '@/components/Modal.vue';

export default {
  components: { Preview, Modal },
  props: {
    contents: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showImageModal: false,
      currentImage: {},
    };
  },
  computed: {
    sortedContents() {
      // need slice to create a copy to avoid infinite loop
      return this.contents.slice().sort((a, b) => {
        if (a.type === 'directory' && b.type !== 'directory') return -1;
        if (b.type === 'directory' && a.type !== 'directory') return 1;

        return a.name < b.name;
      });
    },
  },
  methods: {
    getImagePaths(item) {
      if (item.type === 'directory') {
        return item.contents
          .filter(child => child.type === 'file')
          .map(child => child.thumbnailPath);
      }

      return [item.thumbnailPath];
    },
  },
};
</script>

<style>
.gallery {
  display: grid;
  grid-template-rows: repeat(auto-fit, 182px);
  grid-template-columns: repeat(auto-fill, 182px);
  grid-gap: 24px;
  justify-content: center;
  padding: 3em 1em;
}
</style>
