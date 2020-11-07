import Vue from "vue";
import VueRouter from "vue-router";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import VueCookies from "vue-cookies";

import App from "./App.vue";
import keyword_search from './components/keyword_search';

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(require("vue-cookies"));
Vue.use(VueCookies);

Vue.config.productionTip = false;

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: App,
      name: "root",
      metaTags: [
        {
          name: "Throughput",
          content: "Searching connected code and data on the open web."
        },
        {
          property: "og:url",
          contents: "http://throughputdb.com"
        },
        {
          property: "og:type",
          contents: "website"
        },
        {
          property: "og-description",
          contents: "Searching connected code and data on the open web."
        },
        {
          property: "og:image",
          contents: "http://throughputdb.com/throughput_infographic.png"
        }
      ]
    },
    { path: "/search", component: keyword_search, props: true },
    { path: "/#", component: App, props: true }
  ]
});

Vue.use(VueRouter);

new Vue({
  el: "#app",
  router: router,
  render: h => h("router-view")
});
