import Taro from '@tarojs/taro'
import cache from '~/utils/cache'

const systemInfo = Taro.getSystemInfoSync()

const DPR = Math.max(parseInt(systemInfo.pixelRatio || 2), 2)

export const resize = (path, { width, height } = {}) => {
  if (!path) {
    return ''
  }

  const url = trimHttp(path)
  const w = width ? `,w_${(width * DPR) | 0}` : ''
  const h = height ? `,h_${(height * DPR) | 0}` : ''
  const m = w && h ? ',m_fill' : ''
  const r = w || h ? '/resize' : ''

  return `${url}?x-oss-process=image/auto-orient,1${r}${w}${h}${m}`
}

export const trimHttp = (url) => (url ? url.replace(/^http:/, '') : '')

export const getMenuRect = () => {
  if (cache.get('MENU-RECT')) {
    return
  }

  const menuRect = Taro.getMenuButtonBoundingClientRect()
  const margin = menuRect.top - systemInfo.statusBarHeight
  const height = menuRect.height
  const width = menuRect.left

  const rect = {
    width,
    height,
    margin
  }
  cache.set('MENU-RECT', rect)

  return rect
}

export const debounce = (wait, func1, func2) => {
  let lastTime
  let timeout
  return function () {
    if (lastTime && Date.now() - lastTime < wait) {
      lastTime = Date.now()
      timeout && clearTimeout(timeout)
      timeout = setTimeout(() => {
        func1()
      }, wait)
      return
    }
    lastTime = Date.now()
    func2 ? func2() : func1()
  }
}

export const throttle = (fn, gapTime) => {
  if (gapTime === null || gapTime === undefined) {
    gapTime = 1500
  }
  let _lastTime = null
  return function () {
    let _nowTime = new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      _lastTime = _nowTime
      fn.apply(this, arguments)
    }
  }
}

export const number = (num) => {
  return num > 1000 ? `${Math.floor((num / 1000) * 10) / 10}k` : num
}

export const pad = (number) => {
  return number < 10 ? '0' + number : number
}

export const timeAgo = (time) => {
  if (!time) {
    return ''
  }
  const date = adjustDate(time)
  const today = new Date().setHours(0, 0, 0, 0)
  const obj = parseDateProps(time)
  if (today < date) {
    return `今天${pad(obj.hour)}:${pad(obj.minutes)}`
  }
  if (today - 86400000 < date) {
    return `昨天${pad(obj.hour)}:${pad(obj.minutes)}`
  }
  if (today - 172800000 < date) {
    return `前天${pad(obj.hour)}:${pad(obj.minutes)}`
  }
  const delta = Date.now() - date.getTime()
  if (delta > 86400000 * 365) {
    return `${delta / (86400000 * 365) | 0}年前`
  }
  if (delta > 86400000 * 30) {
    return `${delta / (86400000 * 30) | 0}个月前`
  }
  return `${delta / (86400000) | 0}天前`
}

export const adjustDate = (time) => {
  if (!time) {
    return null
  }
  if (/^\d+$/.test(time)) {
    if (time.toString().length === 10) {
      return new Date(time * 1000)
    }
    return new Date(+time)
  }
  let result = new Date(time)
  if (result.toString() === 'Invalid Date') {
    result = new Date(time.replace(/-/g, '/'))
  }
  return result
}

export const parseDateProps = (time) => {
  if (!time) {
    return null
  }
  const date = adjustDate(time)
  if (!date) {
    return null
  }

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds()
  }
}

export const formatTime = (ts, type = 'ymd') => {
  const obj = parseDateProps(ts)
  if (!obj) {
    return ''
  }
  if (type === 'ymd') {
    return `${obj.year}-${obj.month}-${obj.day}`
  }

  if (type === 'md') {
    return `${obj.month}-${obj.day}`
  }

  return obj.year
}

export const webview = (url) => {
  let result
  const token = cache.get('JWT_TOKEN', 'LOGOUT')
  const link = /\?/.test(url) ? '&' : '?'
  result = `${url}${link}token=${token}`

  if (!/^http/.test(url)) {
    // result = process.env.NODE_ENV === 'development' ? `http://localhost:3001/${result}` : `https://app.calibur.tv/${result}`
    result = `https://app.calibur.tv/${result}`
  }

  return result
}

export const calculate = (val) => {
  return val ? parseFloat(val).toFixed(2) : '0.00'
}

export const back = (url = '/pages/index/index') => {
  if (Taro.getCurrentPages().length <= 1) {
    Taro.switchTab({ url })
    return
  }
  Taro.navigateBack({
    delta: 1
  }).then(() => {}).catch(() => {
    Taro.switchTab({ url })
  })
}

export const maskTel = (tel) => {
  if (!tel) {
    return tel
  }
  return tel.substring(0, 3) + '****' + tel.substr(tel.length - 4)
}

export const colors = [
  { bg: '#ffd43b', text: '#fff' },
  { bg: '#12b7f5', text: '#fff' },
  { bg: '#ff8eb3', text: '#fff' },
  { bg: '#20c997', text: '#fff' },
  { bg: '#adb5bd', text: '#fff' },
  { bg: '#cc5de8', text: '#fff' }
]
