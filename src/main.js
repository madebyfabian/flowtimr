import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'


// FocusVisible
import FocusVisible from 'vue-focus-visible'
Vue.use(FocusVisible)


// dayjs
import '@/plugins/Dayjs'


Vue.config.productionTip = false


new Vue({
  render: h => h(App)
}).$mount('#app')
