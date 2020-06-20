import Modal from '@/components/Modal';
import { mount } from '@vue/test-utils';

describe('modal', () => {
  const testCases = [
    {},
    {
      propsData: {
        modalType: 'image',
      },
    },
  ];

  it.each(testCases)('closes when button is clicked (#%#)', options => {
    const wrapper = mount(Modal, options);
    const button = wrapper.find('button');
    button.trigger('click');

    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it.each(testCases)('closes when background is clicked (#%#)', options => {
    const wrapper = mount(Modal, options);
    const background = wrapper.find('.modal');
    background.trigger('click');

    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it.each(testCases)('does not close when content is clicked', options => {
    const wrapper = mount(Modal, options);
    const contents = wrapper.find('.contents');
    contents.trigger('click');

    expect(wrapper.emitted('close')).toBeFalsy();
  });
});
