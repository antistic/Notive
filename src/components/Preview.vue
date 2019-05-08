<template>
  <div
    class="preview"
    :class="[
      $listeners.click ? 'clickable' : '',
      `preview--${itemType}`
    ]"
    tabindex="0"
    @click="$emit('click')"
    @keypress.enter="$emit('click')"
  >
    <div
      :class="[
        'items-preview',
        `items-preview--${Math.min(images.length, 4)}`,
        `${name ? 'has-name' : ''}`,
      ]"
    >
      <img
        v-for="imagePath in images.slice(0, 4)"
        :key="imagePath"
        :src="`notive://${imagePath}`"
        :alt="imageName(imagePath)"
      >
    </div>
    <p
      v-if="name"
      class="name"
    >
      {{ name }}
    </p>
  </div>
</template>

<script>
import path from 'path';

export default {
  props: {
    images: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      default: '',
    },
    itemType: {
      type: String,
      default: '',
    },
  },
  methods: {
    imageName(imagePath) {
      return path.basename(imagePath.split('?m=')[0], '.png');
    },
  },
};
</script>

<style lang="scss">
.preview {
  border-radius: 2px;

  &.clickable {
    cursor: pointer;
    transition: 0.1s ease-in-out all;

    &:hover,
    &:active,
    &:focus {
      outline: none;
      box-shadow: 10px 10px 0 $primary-light;
      transform: translate(-2px, -2px);
    }
  }

  .name {
    width: 100%;
    height: 1.5em;
    padding: 0;
    padding-top: 0.5em;
    margin: 0;
    font-weight: bold;
    line-height: 1.5em;
    text-align: center;
    text-overflow: ellipsis;
  }

  .tags {
    font-style: italic;
  }
}

.preview--directory,
.preview--file {
  box-sizing: border-box;
  width: 180px;
  height: 180px;
}

.preview--directory {
  padding: 15px;
  background-color: white;

  &.clickable:hover {
    border-color: white;
  }

  img {
    border: 1px solid white;
  }
}

.items-preview {
  width: 100%;
  height: 100%;

  &.has-name {
    height: calc(100% - 2em);
  }

  img {
    position: relative;
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;

    &:hover {
      z-index: 10;
    }

    /* styling broken images */
    &::before,
    &::after {
      position: absolute;
      top: 0;
      box-sizing: border-box;
      display: block;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    &::before {
      padding-bottom: 2em;
      font-size: 2em;
      content: "";
      background: linear-gradient($grey-dark, $grey-dark),
        no-repeat 50% 20%/20% url("../assets/ionicons/md-hammer.svg?external")
        $grey-light;
      background-blend-mode: lighten, normal;
      border: 3px dashed rgba(black, 0.3);
    }

    &::after {
      padding: 0 1em;
      padding-top: 2.5em;
      color: $grey-dark;
      text-align: center;
      content: "unable to generate thumbnail for " attr(alt);
    }
  }
}

.items-preview--0::before {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
  content: "no files";
}

.items-preview--2 {
  display: grid;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr);
  font-size: 0.6rem;

  img:nth-child(1) {
    grid-area: 1 / 1 / 3 / 3;
  }

  img:nth-child(2) {
    grid-area: 2 / 2 / 4 / 4;
  }
}

.items-preview--3 {
  display: grid;
  grid-template: repeat(5, 1fr) / repeat(5, 1fr);

  img:nth-child(1) {
    grid-area: 1 / 2 / 4 / 5;
  }

  img:nth-child(2) {
    grid-area: 2 / 1 / 5 / 4;
  }

  img:nth-child(3) {
    grid-area: 3 / 3 / 6 / 6;
  }
}

.items-preview--4 {
  display: grid;
  grid-template: repeat(2, 1fr) / repeat(2, 1fr);
  grid-gap: 5px;
}
</style>
