import App from "./App.vue";
import { surrenderUntoMeAFileWatcherWithWhichICanWork } from "./api/filewatcher-service";
import { surrenderUntoMeADatabaseWithWhichICanWork } from "./api/database-service";
import { state } from "./api/store";
import { appPaths } from "@/api/appPaths";
import Vue from "vue";
import { FileService } from "./api/file-service";
import { ThumbnailService } from "./api/thumbnail-service";

Vue.config.productionTip = false;

Vue.prototype.$appPaths = appPaths;
Vue.prototype.$store = state;

surrenderUntoMeADatabaseWithWhichICanWork(
  appPaths["database"],
  appPaths["databaseMigrations"]
).then(async databaseService => {
  const fileService = new FileService(appPaths["notebooks"]);
  const thumbnailService = new ThumbnailService(appPaths["thumbnails"], fileService);
  await surrenderUntoMeAFileWatcherWithWhichICanWork(
    databaseService,
    fileService,
    thumbnailService
  );
  state.ready = true;
  Vue.prototype.$databaseService = databaseService;
  Vue.prototype.$fileService = fileService;
  Vue.prototype.$thumbnailService = thumbnailService;
});

new Vue({
  render(h) {
    return h(App);
  }
}).$mount("#app");

// await Promise.all(['root', 'notebooks', 'templates', 'thumbnails']
// .map(asEntryOf(appPaths))
// .map(fs.ensureDir)
// ); make sure these exist !!!!
