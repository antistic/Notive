import App from './App.vue';
import fileWatcher from '@/api/fileWatcher';
import database from '@/api/database';
import store from '@/api/store';
import appPaths from '@/api/appPaths';
import Vue from 'vue';

Vue.config.productionTip = false;

Vue.prototype.$appPaths = appPaths;
Vue.prototype.$store = store;

database.setup()
  .then(fileWatcher.setup)
  .then(() => { store.ready = true; });

new Vue({
  render(h) { return h(App); },
}).$mount('#app');
