import { createApp } from 'vue'
import App from '@/App.vue'
import '@/registerServiceWorker'


// Init app.
const app = createApp(App)
app.config.productionTip = false


// Adding new, vue3 svg inline plugin.
import VueSvgInlinePlugin from 'vue-svg-inline-plugin'
app.use(VueSvgInlinePlugin)


// Init FocusVisible.
import FocusVisible from 'vue-focus-visible'
app.use(FocusVisible)


// Adding global dayjs plugin.
import Dayjs from '@/plugins/Dayjs'
app.config.globalProperties.$date = Dayjs


// Adding new, vue3 <FocusTrap> component.
import { FocusTrap } from 'focus-trap-vue'
app.component('FocusTrap', FocusTrap)


app.mount('#app')