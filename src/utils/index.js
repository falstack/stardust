import cache from '~/utils/cache'
import Taro from '@tarojs/taro'

const systemInfo = Taro.getSystemInfoSync()

const DPR = Math.max(parseInt(systemInfo.pixelRatio || 2), 2)

export const resize = (url, options = {}) => {
  if (!url) {
    return ''
  }

  if (/imageMogr2/.test(url)) {
    return url
  }

  const link = /^http/.test(url) ? url : `https://m1.calibur.tv/${url}`

  const format = '/format/png'
  const mode = options.mode === undefined ? 1 : options.mode

  if ((mode === 1 && !options.width) || (!options.width && !options.height)) {
    return `${link}?imageMogr2/auto-orient/strip${format}`
  }

  let width
  let height

  if (mode === 1) {
    width = `/w/${options.width * DPR | 0}`
    height = options.height ? `/h/${options.height * DPR | 0}` : `/h/${options.width * DPR | 0}`
  } else {
    width = options.width ? `/w/${options.width * DPR | 0}` : ''
    height = options.height ? `/h/${options.height * DPR | 0}` : ''
  }

  return `${link}?imageMogr2/auto-orient/strip|imageView2/${mode}${width}${height}${format}`
}

export const getMenuRect = () => {
  const cacheData = cache.get('capsule-rect')
  if (cacheData) {
    return cacheData
  }
  const menuRect = Taro.getMenuButtonBoundingClientRect()
  if (!menuRect.height) {
    return null
  }
  Taro.getSystemInfo({
    success: res => {
      menuRect.right = (res.screenWidth - menuRect.right) || 8
      menuRect.header = menuRect.top + menuRect.right + menuRect.height
      cache.set('capsule-rect', menuRect, false)
      return menuRect
    }
  })
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
  const date = this.adjustDate(time)
  const today = new Date().setHours(0, 0, 0, 0)
  const obj = this.parseDateProps(time)
  if (today < date) {
    return `今天${this.pad(obj.hour)}:${this.pad(obj.minutes)}`
  }
  if (today - 86400000 < date) {
    return `昨天${this.pad(obj.hour)}:${this.pad(obj.minutes)}`
  }
  if (today - 172800000 < date) {
    return `前天${this.pad(obj.hour)}:${this.pad(obj.minutes)}`
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
  const date = this.adjustDate(time)
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
  const obj = this.parseDateProps(ts)
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
