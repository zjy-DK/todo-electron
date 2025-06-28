<template>
  <div class="login-container">
    <text class="welcome-text">欢迎使用Todo</text>
    <br />
    <el-button
      @click="register()"
      text="true"
      size="large"
      class="register-button"
      >没有账号？注册</el-button
    >
  </div>

  <div class="login-form">
    <text class="form-label">用户邮箱</text>
    <el-input
      class="input"
      placeholder="请输入用户邮箱"
      border="none"
      v-model="loginUser.email"
    ></el-input>
    <text class="form-label" style="margin-top: 15px">密码</text>
    <el-input
      class="input"
      placeholder="请输入密码"
      border="surround"
      v-model="loginUser.password"
      type="password"
      @keydown.enter="handleEnter"
    ></el-input>
    <div class="forgot-password">
      <el-button @click="resetPassword()" text="true">
        <text class="forgot-password-text">忘记密码？</text>
      </el-button>
    </div>
    <div>
      <el-button class="login-button" @click="submit()" color="#6C8FF8">
        <text class="button-text">登录</text>
      </el-button>
      <br />
      <el-button
        class="sms-button"
        style="margin-bottom: 20px"
        @click="sms()"
        color="#6C8FF8"
        plain="true"
      >
        验证码登录
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { login, getLoginUserInfo } from "../../api/auth";
import { ElMessage, ElLoading } from "element-plus";
import { setToken, getToken } from "../../utils/auth";
import { transPsw } from "../../utils/passwordUtil";

// 数据定义
const loginUser = ref({
  email: "",
  password: "",
});

// 生命周期钩子
onMounted(() => {
  checkLogin();
});

/**
 * 跳转到首页
 */
function skipHome() {
  // 关闭当前窗口
  window.myAPI.closeCurrentWindow();
  // 打开新窗口并跳转
  window.myAPI.createWindow("main", "/todo");
}

/**
 * 检查用户是否已登录
 */
async function checkLogin() {
  const token = getToken();

  if (!token) {
    return;
  }

  const loadingInstance = ElLoading.service({ text: "登录中，请稍后" });

  try {
    const res = await getLoginUserInfo();

    if (res.code === 2001) {
      if (!res.data) {
        showWarningMessage("登录已失效，请重新登录");
      } else {
        window.myAPI.setStoreValue("userInfo", JSON.stringify(res.data));
        skipHome();
      }
    } else {
      showWarningMessage(res.message || "登录已失效，请重新登录");
    }
  } catch (error) {
    showErrorMessage("检查登录状态时发生错误");
    console.error("Check login error:", error);
  } finally {
    loadingInstance.close();
  }
}

/**
 * 提交登录表单
 */
function submit() {
  if (!validateLoginForm()) {
    return;
  }

  loginUser.value.password = transPsw(loginUser.value.password);

  login(loginUser.value)
    .then(handleLoginSuccess)
    .catch((error) => {
      showErrorMessage("登录过程中发生错误");
      console.error("Login error:", error);
    });
}

/**
 * 验证登录表单数据
 * @returns 表单数据是否有效
 */
function validateLoginForm(): boolean {
  if (!loginUser.value.email || !loginUser.value.password) {
    showErrorMessage("请输入用户邮箱和密码");
    return false;
  }
  return true;
}

/**
 * 处理登录成功响应
 * @param res - 登录接口返回的数据
 */
function handleLoginSuccess(res: any) {
  if (res.code === 2001) {
    showSuccessMessage("登录成功");
    setToken(res.data.token);

    getLoginUserInfo()
      .then(handleGetUserInfoSuccess)
      .catch((error) => {
        showErrorMessage("获取用户信息失败");
        console.error("Get user info error:", error);
      });

    setTimeout(() => {
      skipHome();
    }, 1000);
  } else {
    showErrorMessage(res.message);
  }
}

/**
 * 处理获取用户信息成功响应
 * @param res - 获取用户信息接口返回的数据
 */
function handleGetUserInfoSuccess(res: any) {
  if (res.code === 2001) {
    window.myAPI.setStoreValue("userInfo", JSON.stringify(res.data));
  } else {
    showErrorMessage(res.message);
  }
}

/**
 * 显示警告消息
 * @param message - 要显示的警告消息内容
 */
function showWarningMessage(message: string) {
  ElMessage({
    message,
    type: "warning",
    offset: 128,
  });
}

/**
 * 显示错误消息
 * @param message - 要显示的错误消息内容
 */
function showErrorMessage(message: string) {
  ElMessage({
    message,
    type: "error",
    offset: 128,
  });
}

/**
 * 显示成功消息
 * @param message - 要显示的成功消息内容
 */
function showSuccessMessage(message: string) {
  ElMessage({
    message,
    type: "success",
    offset: 128,
  });
}

// 事件处理函数
function register() {
  showWarningMessage("请前往APP注册");
}

function handleEnter(e: KeyboardEvent) {
  if (e.keyCode === 13 || e.keyCode === 108) {
    // 登录接口逻辑
    submit();
  }
}

function resetPassword() {
  showWarningMessage("暂未开放");
}

function sms() {
  showWarningMessage("暂未开放");
}
</script>

<style scoped>
.login-container {
  text-align: center;
}

.welcome-text {
  display: inline-block;
  font-size: 36px;
  margin-top: 10%;
}

.login-form {
  margin-top: 2%;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.form-label {
  display: inline-block;
  font-size: 16px;
}

.input {
  width: 100%;
  margin-top: 10px;
  height: 50px;
  box-shadow: 0px 0px 20px 15px rgba(0, 0, 0, 0.03);
  border-radius: 30px;
}

.forgot-password {
  text-align: right;
  margin-top: 5px;
}

.forgot-password-text {
  font-size: 14px;
  color: #90aaf9;
}

.login-button,
.sms-button {
  margin-top: 10px;
  border-radius: 12px;
  height: 50px;
  width: 100%;
}

.button-text {
  color: #ffffff;
}
</style>
../../utils/passwprd/passwordUtil
