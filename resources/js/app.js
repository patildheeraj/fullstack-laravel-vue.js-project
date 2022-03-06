require("./bootstrap");
import Vue from "vue";
import router from "./router.js";
import ViewUI from "view-design";
import "view-design/dist/styles/iview.css";
import store from "./store";

Vue.use(ViewUI);
import common from "./common";

Vue.mixin(common);

Vue.component("mainapp", require("./components/MainApp.vue").default);

const app = new Vue({
    el: "#app",
    router,
    store,
});
