import {createApp} from 'vue'
import store from './store'
import * as utils from '~/utils'
import cache from '~/utils/cache'
import { getUserInfo } from '~/utils/login'
import './app.scss'

const app = createApp({
  onShow(options) {
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

app.use(store)

app.config.devtools = true
app.config.errorHandler = (err, vm, info) => {
  console.log(err)
  console.log(info)
}
app.config.globalProperties.$utils = utils
app.config.globalProperties.$env = process.env.TARO_ENV

if (cache.get('JWT_TOKEN')) {
  store.commit('UPDATE_USER_INFO', cache.get('USER_INFO'))
  getUserInfo()
    .then(user => {
      store.commit('UPDATE_USER_INFO', user)
    })
    .catch(() => {
      cache.remove('JWT_TOKEN')
      cache.remove('USER_INFO')
    })
}

export default app
