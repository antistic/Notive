// eslint-disable-next-line import/no-extraneous-dependencies
import vueJest from 'vue-jest/lib/template-compiler';

export function process(content) {
  const { render } = vueJest({
    content,
    attrs: {
      functional: false,
    },
  });
  return `module.exports = { render: ${render} }`;
}
