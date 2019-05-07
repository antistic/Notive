<template>
  <button
    :class="`iconButton ${options}`"
    @click="$emit('click')"
  >
    <slot>
      <WarningIcon />
    </slot>
    <p>{{ text }}</p>
  </button>
</template>

<script>
import WarningIcon from '@icons/md-warning.svg';

export default {
  components: { WarningIcon },
  props: {
    options: {
      type: String,
      default: 'label-below',
    },
    text: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.iconButton {
  padding: 0.3em;
  background: none;
  border: 0;

  svg {
    fill: rgb(72, 146, 136);
    stroke: rgb(72, 146, 136);

    &.ios {
      stroke-width: 4px;
    }

    &.white {
      fill: white;
      stroke: white;
    }
  }

  p {
    font-family: Calibri, sans-serif;
    font-weight: bold;
    color: rgb(72, 146, 136);
  }

  &:hover {

    .hover--move-left {
      transition: transform 0.2s;
      transform: translateX(-2px);
    }

    .hover--twitch {
      animation: twitch 0.5s;
    }
  }
}

@keyframes twitch {

  from {
    transform: rotate(0);
  }

  25% {

    transform: rotate(7deg);
  }

  50% {

    transform: rotate(-7deg);
  }

  75% {

    transform: rotate(5deg);
  }

  to {
    transform: rotate(0);
  }
}

.iconButton.top-left {
  position: absolute;
  top: 2em;
  left: 2em;
  z-index: 20;
}

.iconButton.top-right {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  z-index: 20;
}

.iconButton.label-none {

  svg {
    height: 4em;
  }
}

.iconButton.label-besides {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  svg {
    height: 2em;
  }

  p {
    margin: 0 3px;
    font-size: 1.6em;
  }
}

.iconButton.label-below {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  svg {
    height: 3em;
  }

  p {
    margin: 0;
    font-size: 1.3em;
  }
}
</style>
