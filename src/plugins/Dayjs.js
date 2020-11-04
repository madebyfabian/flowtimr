import Vue from 'vue'
import dayjs from 'dayjs'
import dayjsPluginUTC from 'dayjs/plugin/utc'
import dayjsPluginTimezone from 'dayjs/plugin/timezone'

dayjs.extend(dayjsPluginUTC)
dayjs.extend(dayjsPluginTimezone)

Object.defineProperties(Vue.prototype, {
  $date: {
    get() {
      return dayjs
    }
  }
})