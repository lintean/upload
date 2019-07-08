import Vue from 'vue'
import App from './App.vue'
import uploader from 'vue-simple-uploader'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Antd from 'ant-design-vue'
import "ant-design-vue/dist/antd.css";

Vue.config.productionTip = false
Vue.use(uploader);
Vue.use(ElementUI);

Vue.use(Antd);

new Vue({
  render: h => h(App),
}).$mount('#app')
