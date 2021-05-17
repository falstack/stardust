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
    navigationBarTitleText: '单身码',
    backgroundColor: '#f9f9f9',
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#fb7299',
    navigationBarTextStyle: 'white'
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
        text: 'TA',
        iconPath: 'assets/tab_1.png',
        selectedIconPath: 'assets/tab_1_selected.png'
      },
      {
        pagePath: 'pages/user/home/index',
        text: '我',
        iconPath: 'assets/tab_3.png',
        selectedIconPath: 'assets/tab_3_selected.png'
      }
    ]
  }
}
