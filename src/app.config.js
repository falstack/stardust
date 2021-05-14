export default {
  pages: [
    'pages/index/index',
    'pages/user/home/index',
    'pages/user/profile/index',
    'pages/user/realname/index',
    'pages/user/readme/index',
    'pages/user/public/index',
  ],
  window: {
    navigationBarBackgroundColor: '#f9f9f9',
    navigationBarTitleText: '签约幸福',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f9f9f9',
    backgroundTextStyle: 'dark'
  },
  tabBar: {
    custom: false,
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
