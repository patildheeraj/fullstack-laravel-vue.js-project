import Router from "vue-router";
import Vue from "vue";
Vue.use(Router);

//admin route
import Home from "./admin/pages/Home.vue";
import Tags from "./admin/pages/Tags.vue";
import Category from "./admin/pages/Category.vue";
import usecmp from "./vuex/usecmp.vue";

const routes = [
    //project route
    {
        path: "/",
        component: Home,
    },
    {
        path: "/tags",
        component: Tags,
    },
    {
        path: "/category",
        component: Category,
    },
    {
        path: "/vuex",
        component: usecmp,
    },
];

export default new Router({
    mode: "history",
    routes,
});
