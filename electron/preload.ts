import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
});

contextBridge.exposeInMainWorld("myAPI", {
  setStoreValue(key: string, value: any) {
    ipcRenderer.send("setStore", key, value);
  },

  getStoreValue(key: string) {
    const resp = ipcRenderer.sendSync("getStore", key);
    return resp;
  },

  deleteStore(key: string) {
    ipcRenderer.send("deleteStore", key);
  },

  openDevTools() {
    ipcRenderer.send("openDevTools");
  },

  getImageUrl(image: string) {
    const resp = ipcRenderer.sendSync("getImageUrl", image);
    return resp;
  },

  closeAllWindows() {
    ipcRenderer.send("closeAllWindows");
  },

  closeCurrentWindow() {
    ipcRenderer.send("closeCurrentWindow");
  },

  createWindow(windows: string, url: string) {
    ipcRenderer.send("createWindow", windows, url);
  },
});
