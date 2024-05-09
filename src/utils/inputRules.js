export const rules = {
  name: {
    regex: /^[a-zA-Z0-9_.\u4e00-\u9fa5-]{3,16}$/,
    prompt: '3-16個字元，中文、英文、數字、符號(_-.)不能含有空白',
    min: 3,
    max: 16
    //非捕獲組的用意為優化性能
  },
  email: {
    regex: /^(?:\w+(?:[.-]?\w+)*@\w+(?:[.-]?\w+)*(\.\w{2,3})+)$/,
    prompt: '請輸入正確信箱格式',
    min: 6,
    max: 64
  },
  phone: {
    regex: /^(?:\d{9}|\d{10})$/,
    prompt: "必須是9-10位數字",
    min: 9,
    max: 10
  },
  county: {
    regex: /^(?:[\u4e00-\u9fa5a-zA-Z\x20\-']+)$/,
    prompt: "2-16字元，只能輸入中文、英文、符號",
    min: 2,
    max: 16
  }
};