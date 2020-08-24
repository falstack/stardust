import { createApp } from 'vue'
import store from './store'
import utils from '~/utils'
import toast from '~/utils/toast'
import './app.scss'

const app = createApp({
  onShow (options) {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

app.use(store)

app.config.devtools = true
app.config.errorHandler = (err, vm, info) => {
  console.log(err)
  console.log(info)
}
app.config.globalProperties.$utils = utils


export default app
