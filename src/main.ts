import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import App from "./App.vue";
import router from "./router";

createApp(App)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .use(router)
  .mount("#app")
  .$nextTick(() => {
    // Use contextBridge
    window.ipcRenderer.on("main-process-message", (_event, message) => {
      console.log(message);
    });
  });
