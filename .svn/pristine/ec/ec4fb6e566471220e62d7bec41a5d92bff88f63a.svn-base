import Vue from "vue";
import Router from "vue-router";
import mentorDisciple from "./mentorDisciple";
import LivingCulture from "./LivingCulture";

Vue.use(Router);

let routes = new Set([...LivingCulture, ...mentorDisciple]);

export default new Router({
  routes,
  mode: "history",
  base: process.env.NODE_ENV === "production" ? "/ui/phone/" : ""
});
