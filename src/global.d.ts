// global.d.ts

declare global {
  interface Window {
    myAPI: {
      // 定义你暴露给渲染进程的方法和属性
      openDevTools: () => void;
      getStoreValue: (key: string) => string; // 返回值可能是 undefined 如果 key 不存在
      setStoreValue: (key: string, value: string) => void; // 确保参数类型明确
      deleteStore: (key: string) => void;
      getImageUrl: (image: string) => string;
      createWindow: (windows: string, url: string) => string;
      closeCurrentWindow: () => void;
      closeAllWindows: () => void;
    };
  }
}

export {}; // 确保这是一个模块，而不是命名空间
