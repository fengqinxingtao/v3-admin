import { createStore } from 'vuex';

const store = createStore({
  state: {
    name: 'Vincent',
  },
  getters: {
    name: (state) => state.name,
  },
});

export default store;
