import { createStore } from 'vuex';

export default createStore({
  state: {
    counter: '0',
    isAssetsLoad: false,
  },
  mutations: {
    incrementCounter(state) {
      state.counter = `${Number(state.counter) + 1}`;
    },

    cleanCounter(state) {
      state.counter = '0';
    },

    loadAssets(state) {
      state.isAssetsLoad = true;
    },
  },
});
