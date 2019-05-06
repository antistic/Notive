import Vue from 'vue';
import App from './App.vue';
import fileWatcher from '@/api/fileWatcher';
import store from '@/api/store';
import { appPaths } from '@/api/appPaths';

Vue.config.productionTip = false;

Vue.prototype.$appPaths = appPaths;
Vue.prototype.$store = store;

fileWatcher.setup()
  .then(() => { store.ready = true; });

new Vue({
  render(h) { return h(App); },
}).$mount('#app');
