import dayjs from 'dayjs'
import dayjsPluginUTC from 'dayjs/plugin/utc'
import dayjsPluginTimezone from 'dayjs/plugin/timezone'

dayjs.extend(dayjsPluginUTC)
dayjs.extend(dayjsPluginTimezone)

export default dayjs