export default {
  pages: [
    'pages/index/index',
    'pages/user/home/index',
    'pages/user/about/index',
    'pages/room/live/index'
  ],
  window: {
    navigationBarBackgroundColor: '#f9f9f9',
    navigationBarTitleText: '咔哩吧',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f9f9f9',
    backgroundTextStyle: 'dark'
  },
  tabBar: {
    color: '#9e9e9e',
    selectedColor: '#000',
    backgroundColor: '#f9f9f9',
    borderStyle: 'white',
    position: 'bottom',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
      },
      {
        pagePath: 'pages/user/home/index',
        text: '我的',
      }
    ]
  }
}
