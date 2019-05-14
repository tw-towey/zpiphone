// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import axios from 'axios'
import utils from './util/index'
import webApp from './webApp/index'
import api from './api/index'

import { Button, Toast, Loading, Dialog, Row, Col, Popup, DatetimePicker, Picker, Field, RadioGroup, Radio, Search, Uploader, List, NavBar, Tab, Tabs, Cell, Progress, SwipeCell, CellGroup, Icon, Checkbox, CheckboxGroup, PullRefresh } from 'vant'

import 'vant/lib/index.css'
import './assets/css/common.css'
import AMap from 'vue-amap'
import vConsole from './assets/js/vConsole'
import {
    AppCallBacks,
    AppCommendBackHandlers,
    AppCommendKeyboardBounceUp,
    AppMsgHandlers
} from './webApp/AppMsgHandlers'

Vue.config.productionTip = false;

Vue.prototype.$ajax = axios;
Vue.prototype.api = api;
Vue.prototype.utils = utils;
Vue.prototype.webApp = webApp;
Vue.prototype.Toast = Toast;
Vue.prototype.Dialog = Dialog;
Vue.prototype.WebBack = AppCommendBackHandlers;
Vue.prototype.Keyboar = AppCommendKeyboardBounceUp;


Vue.use(Button).use(Row).use(Col).use(Popup).use(DatetimePicker).use(Field).use(RadioGroup).use(Radio).use(Search).use(Uploader).use(List).use(NavBar).use(Tab).use(Tabs).use(Picker).use(Cell).use(Progress).use(Loading).use(AMap).use(SwipeCell).use(Icon).use(CellGroup).use(Checkbox).use(CheckboxGroup).use(Dialog).use(PullRefresh);


AMap.initAMapApiLoader({
    key: '3f975c9c5cf32a9f0b4434befbbd9d81',
    plugin: ['Geolocation']
});

router.beforeEach((to, from, next) => {
    if (to.name === "GraduateSummary" || to.name === "RegistrationManual") {
        if (!store.state.currentDepartment) {
            Toast("当前没有轮转科室");
            return;
        }
    }
    next();
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store: store,
    components: { App },
    template: '<App/>'
});