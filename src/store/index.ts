import { createStore } from 'vuex';

const modulesFiles = import.meta.globEager('./modules/*.ts');

const modules = {};
for (const key in modulesFiles) {
  modules[key.substring(key.lastIndexOf('/') + 1, key.lastIndexOf('.'))] = modulesFiles[key].default;
}

export default createStore({
  modules,
});
