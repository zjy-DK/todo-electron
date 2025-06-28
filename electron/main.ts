import { app, BrowserWindow, globalShortcut, Menu, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import Store from "electron-store";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const store = new Store();

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createLoginWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: 336, // 初始宽度
    height: 533, // 初始高度
    minWidth: 336, // 最小宽度
    minHeight: 534, // 最小高度
    resizable: false, // 调整窗口大小
    maximizable: false, // 禁用最大化按钮
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "rgba(0,0,0,0)",
      height: 35,
      symbolColor: "black",
    },
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      //本地测试使用，禁用Web安全设置
      //  webSecurity: false,
    },
  });

  //快捷键打开开发者工具
  app.whenReady().then(() => {
    globalShortcut.register("Ctrl+Shift+I", () => {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      if (focusedWindow) {
        focusedWindow.webContents.toggleDevTools();
      }
    });
  });

  // 移除默认菜单栏
  Menu.setApplicationMenu(null);

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

app.on("will-quit", () => {
  // 解除注册所有快捷键
  globalShortcut.unregisterAll();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createLoginWindow();
  }
});

/**
 * 开启主窗口
 */
function createWindow(url: string) {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: 1024, // 初始宽度
    height: 640, // 初始高度
    minWidth: 717, // 最小宽度
    minHeight: 448, // 最小高度
    // resizable: false, // 禁止调整窗口大小
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "rgba(0,0,0,0)",
      height: 35,
      symbolColor: "black",
    },
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      //本地测试使用，禁用Web安全设置
      //  webSecurity: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL + "#" + url);
  } else {
    // 生产环境加载打包后的本地文件
    win.loadFile(path.join(RENDERER_DIST, "index.html"), { hash: url });
  }
  return win;
}

/**
 * 开启设置窗口
 */
function createSettingWindow(url: string) {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: 400, // 初始宽度
    height: 600, // 初始高度
    resizable: false, // 禁止调整窗口大小
    maximizable: false, // 禁用最大化按钮
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "rgba(0,0,0,0)",
      height: 35,
      symbolColor: "black",
    },
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      //本地测试使用，禁用Web安全设置
      //  webSecurity: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL + "#" + url);
  } else {
    // 生产环境加载打包后的本地文件
    win.loadFile(path.join(RENDERER_DIST, "index.html"), { hash: url });
  }

  return win;
}

//关闭所有窗口
ipcMain.on("closeAllWindows", () => {
  let windows = BrowserWindow.getAllWindows();
  windows.forEach((win) => {
    if (!win.isDestroyed()) {
      win.close(); // 关闭窗口
    }
  });
});

//关闭当前窗口
ipcMain.on("closeCurrentWindow", (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.close();
  }
});

//打开新窗口
ipcMain.on("createWindow", (_, windows, url) => {
  if (windows === "login") {
    createLoginWindow();
  } else if (windows === "main") {
    createWindow(url);
  } else if (windows === "setting") {
    createSettingWindow(url);
  }
});

//向electron-store存入数据
ipcMain.on("setStore", (_, key, value) => {
  store.set(key, value);
});

//读取electron-store数据
ipcMain.on("getStore", (_, key) => {
  let value = store.get(key);
  _.returnValue = value || "";
});

//删除electron-store数据
ipcMain.on("deleteStore", (_, key) => {
  store.delete(key);
});

//获取图片路径地址
ipcMain.on("getImageUrl", (_, image) => {
  _.returnValue = path.join(process.env.VITE_PUBLIC, image);
});

//开启开发者工具
ipcMain.on("openDevTools", () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    focusedWindow.webContents.openDevTools();
  }
});

app.whenReady().then(createLoginWindow);
