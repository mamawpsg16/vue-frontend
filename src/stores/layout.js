import { reactive } from 'vue';
import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('layout', () => {
  const layout = reactive({
    header: true,
    sidebar: true,
    footer: true,
  });

  const setLayout = (payload) => {
    layout.header = payload.header;
    layout.sidebar = payload.sidebar;
    layout.footer = payload.footer;
  };

  return { layout, setLayout };
});
