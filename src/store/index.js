import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
var sessionState = JSON.parse(window.sessionStorage.getItem("state"));

export default new Vuex.Store({
  state: sessionState
    ? sessionState
    : {
      //当前用户对象
        userInfo: {},
        //通用后端地址
        baseUrl: "http://localhost:8081/",
        //文件上传的类型限制
        uploadFileTypeLimits: {
          box: ".c, .cpp, .cs, .css, .excel, .exe, .html, .java, .jif, .jpeg, .jpg, .png, .js, .md, .mp3, .mp4, .php, .png, .ppt , .pptx, .ps, .ps1, .py, .rar, .sql, .txt, .vue, .webp, .xml, .zip, .pdf, .doc, .docx, .xls, .xlsx",
          image: " .jif, .jpeg, .jpg, .webp, .png",
        },
      },
  mutations: {
    setUserInfo(state, value) {
      state.userInfo = value;
    },
  },
  getters: {},
  actions: {},
  modules: {},
});
