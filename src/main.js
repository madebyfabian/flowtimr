import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'


// <inline-svg>
import InlineSvg from 'vue-inline-svg'
Vue.component('inline-svg', InlineSvg)


// FocusVisible
import FocusVisible from 'vue-focus-visible'
Vue.use(FocusVisible)


// dayjs
import '@/plugins/Dayjs'


Vue.config.productionTip = false


new Vue({
  render: h => h(App)
}).$mount('#app')
