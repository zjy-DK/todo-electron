<template>
  <div class="setting-container">
    <el-scrollbar max-height="90vh">
      <el-form label-position="top" class="user-form">
        <el-form-item label="用户名称">
          <el-input v-model="userInfo.userName" clearable disabled />
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="userInfo.sexStr" clearable disabled />
        </el-form-item>
        <el-form-item label="注册邮箱">
          <el-input v-model="userInfo.email" clearable disabled />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userInfo.phoneNumber" clearable disabled />
        </el-form-item>
        <el-form-item label="注册日期">
          <el-input v-model="userInfo.createTime" clearable disabled />
        </el-form-item>
        <el-form-item label="最后登录IP">
          <el-input v-model="userInfo.loginIp" clearable disabled />
        </el-form-item>
        <el-form-item label="最后登录时间">
          <el-input v-model="userInfo.loginDate" clearable disabled />
        </el-form-item>

        <!-- <el-form-item>
          <el-button
            size="large"
            class="action-button devtools-btn"
            @click="openDevTools()"
            :icon="Setting"
            >开启开发者工具</el-button
          >
        </el-form-item> -->
        <el-form-item>
          <el-button
            size="large"
            class="action-button password-btn"
            @click="updatePassword()"
            :icon="Edit"
            >修改密码</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            size="large"
            class="action-button logout-btn"
            @click="logoutUser()"
            :icon="SwitchButton"
            >退出登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { SwitchButton, Edit } from "@element-plus/icons-vue";
import { getLoginUserInfo, logout } from "../../api/auth";
import { ElMessage } from "element-plus";
import { removeToken } from "../../utils/auth";

const initializeUserInfo = () => {
  return {
    userName: "",
    nickName: "",
    email: "",
    phoneNumber: "",
    sex: "",
    sexStr: "",
    createTime: "",
    loginDate: "",
    loginIp: "",
  };
};

var userInfo = reactive(initializeUserInfo());

const getLoginUser = () => {
  let user = window.myAPI.getStoreValue("userInfo");
  if (user) {
    const parsedUser = JSON.parse(user);
    updateUserInfo(parsedUser);
  } else {
    getLoginUserInfo().then((res) => {
      if (res.code === 2001) {
        window.myAPI.setStoreValue("userInfo", JSON.stringify(res.data));
        updateUserInfo(res.data);
      } else {
        ElMessage({
          message: res.message,
          type: "error",
          offset: 128
        });
      }
    });
  }
};

const updateUserInfo = (user: any) => {
  Object.assign(userInfo, user);
  userInfo.sexStr = userInfo.sex === "man" ? "男" : "女";
};

const updatePassword = () => {
  ElMessage({
    message: "请前往APP修改密码",
    type: "warning",
    offset: 128,
  });
};

const logoutUser = () => {
  logout().then((res) => {
    if (res.code === 2001) {
      ElMessage({
        message: "登出成功",
        type: "success",
        offset: 128,
      });
      setTimeout(() => {
        removeToken();
        window.myAPI.deleteStore("userInfo");
        //关闭所有窗口
        window.myAPI.closeAllWindows();
        //打开新窗口并跳转
        window.myAPI.createWindow("login", "");
      }, 1000);
    } else {
      ElMessage({
        message: res.message,
        type: "error",
        offset: 128,
      });
    }
  });
};

// const openDevTools = () => {
//   window.myAPI.openDevTools();
// };

getLoginUser();
</script>

<style scoped>
.setting-container {
  width: 90%;
  margin: auto;
  margin-top: 15px;
}

.user-form .el-form-item__label {
  font-weight: bold;
}

.action-button {
  width: 100%;
}

.devtools-btn {
  background-color: #e6a23c;
  color: white;
}

.devtools-btn:hover {
  background-color: #cf9236;
}

.password-btn {
  background-color: #409eff;
  color: white;
}

.password-btn:hover {
  background-color: #337ecc;
}

.logout-btn {
  background-color: #f56c6c;
  color: white;
}

.logout-btn:hover {
  background-color: #e05b5b;
}
</style>
