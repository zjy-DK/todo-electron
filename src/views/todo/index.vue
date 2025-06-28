<template>
  <el-row>
    <!-- 左边栏 -->
    <el-col :sm="7" :xs="7" :md="7" :lg="7" :xl="5">
      <div class="toolbar">
        <el-button
          size="large"
          color="#FFFFFF"
          circle
          :icon="Menu"
          @click="openSetting()"
        />
        <div class="toolbar-right">
          <el-button
            size="large"
            color="#FFFFFF"
            circle
            :icon="Plus"
            @click="clickAdd"
          />
          <el-dropdown
            placement="bottom"
            trigger="click"
            @command="handleCommand"
          >
            <el-button size="large" color="#FFFFFF" :icon="More" circle />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="CircleCheck" command="complete">{{
                  completeStr
                }}</el-dropdown-item>
                <el-dropdown-item :icon="Sort" command="sort"
                  >排序</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <el-scrollbar max-height="90vh" class="scrollbar">
        <el-input
          v-model="searchValue"
          placeholder="请输入查询关键字"
          clearable
          size="large"
          class="search-input"
          @keydown.enter="handleSearchEnter"
          @clear="handleSearchClear"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <div v-if="isSearch">
          <div class="search-result-header">
            <el-icon size="14"><Search color="#1296DB" /></el-icon>
            <el-text size="small" class="search-result-text">{{
              searchTodoList.length !== 0 ? "查询结果" : "无相关结果"
            }}</el-text>
          </div>
          <div
            v-for="item in searchTodoList"
            :key="item"
            class="todo-item grayOnHover"
          >
            <el-checkbox v-model="item.check" disabled />
            <div class="todo-content" @click="todoDetail(item.id)">
              <el-text class="todo-title">{{ item.title }}</el-text>
              <el-icon size="14" class="todo-icon"
                ><Tickets color="#CCCCCC"
              /></el-icon>
            </div>
          </div>
        </div>

        <div v-if="!isSearch">
          <div v-if="topTodoList.length !== 0" class="section-header">
            <el-icon size="14"><Upload color="red" /></el-icon>
            <el-text size="small">已置顶</el-text>
          </div>
          <div
            v-for="item in topTodoList"
            :key="item"
            class="todo-item grayOnHover"
          >
            <el-checkbox
              :class="[getItemClass(item)]"
              v-model="item.check"
              @change="complete(item.id)"
            />
            <div class="todo-content" @click="todoDetail(item.id)">
              <el-text class="todo-title">{{ item.title }}</el-text>
              <el-icon size="14" class="todo-icon"
                ><Tickets color="#CCCCCC"
              /></el-icon>
            </div>
          </div>

          <div class="section">
            <el-text size="small">未置顶</el-text>
            <div
              v-for="item in todoList"
              :key="item"
              class="todo-item grayOnHover"
            >
              <el-checkbox
                :class="[getItemClass(item)]"
                v-model="item.check"
                @change="complete(item.id)"
              />
              <div class="todo-content" @click="todoDetail(item.id)">
                <el-text class="todo-title">{{ item.title }}</el-text>
                <el-icon size="14" class="todo-icon"
                  ><Tickets color="#CCCCCC"
                /></el-icon>
              </div>
            </div>
          </div>

          <div v-if="showComplete" class="section">
            <div class="section-header">
              <el-icon size="14"><FolderChecked /></el-icon>
              <el-text size="small">已完成</el-text>
            </div>
            <div
              v-for="item in completeTodoList"
              :key="item"
              class="todo-item grayOnHover"
            >
              <el-checkbox v-model="item.check" disabled />
              <div class="todo-content" @click="todoDetail(item.id)">
                <el-text class="todo-title">{{ item.title }}</el-text>
                <el-icon size="14" class="todo-icon"
                  ><Tickets color="#CCCCCC"
                /></el-icon>
              </div>
            </div>
            <div class="see-more">
              <el-button text @click="moreCompleteTodo()">查看更多</el-button>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-col>

    <!-- 右边栏 -->
    <el-col :sm="17" :xs="17" :md="17" :lg="17" :xl="19">
      <div class="right-panel">
        <el-row>
          <el-col :span="16">
            <input
              v-model="rightTodo.title"
              placeholder="请输入标题"
              class="right-panel-title"
            />
          </el-col>
          <el-col :span="8" class="right-toolbar">
            <el-dropdown
              placement="bottom"
              trigger="click"
              @command="handlePriorityCommand"
            >
              <el-button :type="priorityColor" circle :icon="Flag" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="t0"
                    >&nbsp;&nbsp;&nbsp;T0&nbsp;&nbsp;&nbsp;</el-dropdown-item
                  >
                  <el-dropdown-item command="t1"
                    >&nbsp;&nbsp;&nbsp;T1&nbsp;&nbsp;&nbsp;</el-dropdown-item
                  >
                  <el-dropdown-item command="t2"
                    >&nbsp;&nbsp;&nbsp;T2&nbsp;&nbsp;&nbsp;</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button
              :type="topColor"
              circle
              :icon="Upload"
              @click="clickTop()"
            />
            <el-button
              v-if="rightTodo.id !== undefined"
              type="danger"
              circle
              :icon="Delete"
              @click="del()"
            />
            <el-button
              type="primary"
              circle
              :icon="Select"
              @click="submitTodoFrom()"
              class="submit-button"
            />
          </el-col>
        </el-row>
        <textarea
          v-model="rightTodo.remark"
          placeholder="描述..."
          class="right-panel-textarea"
        ></textarea>
      </div>
    </el-col>
  </el-row>

  <!-- 排序弹框 -->
  <el-dialog v-model="showSort" width="200px">
    <el-button
      class="sort-dialog-button"
      :icon="Timer"
      @click="sortTodo('time')"
      >时间</el-button
    >
    <el-button
      class="sort-dialog-button"
      :icon="Paperclip"
      @click="sortTodo('title')"
      >标题</el-button
    >
    <el-button
      class="sort-dialog-button"
      :icon="Flag"
      @click="sortTodo('priority')"
      >优先级</el-button
    >
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  More,
  Sort,
  CircleCheck,
  Search,
  Flag,
  FolderChecked,
  Upload,
  Delete,
  Select,
  Plus,
  Paperclip,
  Timer,
  Menu,
  Tickets,
} from "@element-plus/icons-vue";
import {
  homeTodoList,
  getTodoPage,
  addTodo,
  updateTodo,
  completeTodo,
  deleteTodo,
  getTodoById,
} from "../../api/todo";
import { ElMessage, ElMessageBox } from "element-plus";

// 常量定义
const PRIORITY_MAP = {
  t0: "danger",
  t1: "primary",
  t2: "",
};
// 定义优先级顺序映射
const priorityOrder = {
  t0: 0,
  t1: 1,
  t2: 2,
};

type PriorityType = keyof typeof PRIORITY_MAP;

// 左侧数据
const pageQuery = reactive({
  currentPage: 1,
  pageSize: 20,
  query: {
    title: "",
    status: "",
  },
});
const searchValue = ref("");
const isSearch = ref(false);
const topTodoList = ref<any[]>([]);
const todoList = ref<any[]>([]);
const showComplete = ref(false);
const completeStr = ref("显示已完成");
const completeTodoList = ref<any[]>([]);
const showSort = ref(false);
const searchTodoList = ref<any[]>([]);

// 右侧数据
const rightTodoId = ref("");
const rightTodo = ref<{
  id?: string;
  title: string;
  priority: PriorityType;
  remark: string;
  top: boolean;
}>({
  id: undefined,
  title: "",
  priority: "t1",
  remark: "",
  top: false,
});
const priorityColor = ref("primary");
const topColor = ref("");

getHomeTodoList();

// =================== API 请求 ===================
async function getHomeTodoList() {
  try {
    const res = await homeTodoList(true);
    if (res.code === 2001) {
      const { topTodoList: top, unCompleteTodoList: normal } = res.data;
      topTodoList.value = top;
      todoList.value = normal;
    } else {
      throw new Error(res.message);
    }
  } catch (error: any) {
    handleError(error.message);
  }
}

async function getTodoList() {
  try {
    const res = await getTodoPage(pageQuery);
    if (res.code === 2001) {
      completeTodoList.value = [...completeTodoList.value, ...res.data.records];
    } else {
      throw new Error(res.message);
    }
  } catch (error: any) {
    handleError(error.message);
  }
}

// =================== 事件处理 ===================
function handleCommand(command: string | number | object) {
  if (command === "complete") {
    toggleComplete();
  } else if (command === "sort") {
    showSort.value = true;
  }
}

function toggleComplete() {
  showComplete.value = !showComplete.value;
  if (showComplete.value) {
    completeStr.value = "隐藏已完成";
    pageQuery.currentPage = 1;
    pageQuery.query.status = "complete";
    completeTodoList.value = [];
    getTodoList();
  } else {
    completeStr.value = "显示已完成";
    pageQuery.currentPage = 1;
    pageQuery.query.status = "";
    completeTodoList.value = [];
  }
}

function moreCompleteTodo() {
  pageQuery.currentPage += 1;
  getTodoList();
}

function sortTodo(type: string) {
  switch (type) {
    case "time":
      todoList.value = todoList.value.sort((a, b) => {
        // 将日期字符串转换为Date对象进行比较
        return (
          new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
        ); // 降序
      });
      break;
    case "title":
      todoList.value = todoList.value.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      break;
    case "priority":
      todoList.value = todoList.value.sort((a, b) => {
        const aKey = a.priority as keyof typeof priorityOrder;
        const bKey = b.priority as keyof typeof priorityOrder;
        return priorityOrder[aKey] - priorityOrder[bKey];
      });
      break;
  }
  showSort.value = false;
}

function handleSearchEnter(e: KeyboardEvent) {
  if (e.key === "Enter" || e.keyCode === 108) {
    if (!searchValue.value.trim()) {
      ElMessage.warning({ message: "请输入搜索条件", offset: 128 });
      return;
    }

    isSearch.value = true;
    getTodoPage({
      currentPage: 1,
      pageSize: 500,
      query: { title: searchValue.value },
    }).then((res) => {
      if (res.code === 2001) {
        searchTodoList.value = res.data.records;
      } else {
        ElMessage.error({ message: res.message, offset: 128 });
      }
    });
  }
}

function handleSearchClear() {
  isSearch.value = false;
  searchTodoList.value = [];
}

async function todoDetail(todoId: string) {
  rightTodoId.value = todoId;
  try {
    const res = await getTodoById(rightTodoId.value);
    if (res.code === 2001) {
      rightTodo.value = res.data;
      setPriorityColor();
      setTopColor();
    } else {
      throw new Error(res.message);
    }
  } catch (error: any) {
    handleError(error.message);
  }
}

function clickAdd() {
  rightTodoId.value = "";
  rightTodo.value = {
    id: undefined,
    title: "",
    priority: "t1",
    remark: "",
    top: false,
  };
  priorityColor.value = "primary";
  topColor.value = "";
}

function handlePriorityCommand(command: string) {
  const config = {
    t0: { priority: "t0", color: "danger" },
    t1: { priority: "t1", color: "primary" },
    t2: { priority: "t2", color: "" },
  }[command];

  if (config) {
    rightTodo.value.priority = config.priority as "t0" | "t1" | "t2";
    priorityColor.value = config.color;
  }
}

function clickTop() {
  rightTodo.value.top = !rightTodo.value.top;
  topColor.value = rightTodo.value.top ? "danger" : "";
}

async function submitTodoFrom() {
  try {
    if (!rightTodo.value.id) {
      const res = await addTodo(rightTodo.value);
      ElMessage.success({ message: "添加成功", offset: 128 });
      rightTodoId.value = res.data;
    } else {
      await updateTodo(rightTodo.value);
      ElMessage.success({ message: "修改成功", offset: 128 });
    }
    refreshData();
  } catch (error: any) {
    handleError(error.message);
  }
}

async function complete(id: string) {
  try {
    await completeTodo(id);
    ElMessage.success({ message: "操作成功", offset: 128 });
    refreshData();
  } catch (error: any) {
    handleError(error.message);
  }
}

function del() {
  ElMessageBox.confirm("确定要删除这条代办吗", "删除提示", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await deleteTodo(rightTodoId.value);
        ElMessage.success({ message: "删除成功", offset: 128 });
        rightTodo.value = {
          id: undefined,
          title: "",
          priority: "t1",
          remark: "",
          top: false,
        };
        rightTodoId.value = "";
        refreshData();
      } catch (error: any) {
        handleError(error.message);
      }
    })
    .catch(() => {});
}

function refreshData() {
  resetData();
  getHomeTodoList();
  if (rightTodoId.value) {
    todoDetail(rightTodoId.value);
  }
}

function resetData() {
  pageQuery.currentPage = 1;
  pageQuery.query.title = "";
  pageQuery.query.status = "";
  topTodoList.value = [];
  todoList.value = [];
  completeTodoList.value = [];
  searchTodoList.value = [];
  completeStr.value = "显示已完成";
  showComplete.value = false;
  priorityColor.value = "primary";
  topColor.value = "";
}

function setPriorityColor() {
  priorityColor.value = PRIORITY_MAP[rightTodo.value.priority] || "";
}

function setTopColor() {
  topColor.value = rightTodo.value.top ? "danger" : "";
}

function handleError(message: string) {
  ElMessage.error({ message, offset: 128 });
}

function getItemClass(item: any): string {
  let borderColor =
    item.priority === "t0" ? "red" : item.priority === "t1" ? "blue" : "grey";
  return `custom-checkbox-${borderColor}`;
}

function openSetting() {
  window.myAPI.createWindow("setting", "/setting");
}
</script>

<style scoped>
/* 工具栏样式 */
.toolbar {
  display: flex;
  align-items: center;
}

.toolbar-right {
  margin-left: auto;
}

/* 滚动条容器 */
.scrollbar {
  margin-left: 12px;
  padding-right: 12px;
}

/* 搜索样式 */
.search-input {
  box-shadow: 0px 0px 20px 15px rgba(0, 0, 0, 0.02);
  width: 100%;
  margin-bottom: 20px;
}

/* 查询结果头部 */
.search-result-header {
  display: flex;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 5px;
}

.search-result-text {
  margin-left: 5px;
}

/* 待办列表样式 */
.todo-item {
  padding: 3px;
  align-items: center;
  border-bottom: 1px solid #f1f1f1;
  display: flex;
}

.grayOnHover:hover {
  background-color: #f9f9f9;
}

.todo-content {
  display: flex;
  width: 100%;
}

.todo-title {
  margin-left: 5px;
}

.todo-icon {
  margin-left: auto;
}

.section {
  margin-top: 15px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  color: #666;
}

.section-header .el-icon {
  margin-right: 5px;
}

.see-more {
  text-align: center;
  padding-bottom: 10px;
}

/* 右侧面板样式 */
.right-panel {
  height: 100vh;
  border-left: 1px solid #e9e9e9;
  padding: 5px 0px 0px 5px;
}

.right-panel-title {
  width: 90%;
  height: 30px;
  border: none;
  background-color: #ffffff;
  outline: none;
  font-size: 24px;
  font-weight: bold;
}

.right-toolbar {
  display: flex;
  justify-content: flex-end;
}

.right-toolbar .el-button {
  margin-left: 10px;
}

.submit-button {
  margin-right: 10px;
}

.right-panel-textarea {
  font-family: PingFang SC, Microsoft YaHei, sans-serif;
  margin-top: 5px;
  width: 100%;
  border: none;
  outline: none;
  height: 85vh;
  font-size: 14px;
  resize: none;
  border-top: 1px solid #e9e9e9;
  padding-top: 10px;
}

/* 排序弹窗样式 */
.sort-dialog-button {
  width: 95%;
  margin: 10px auto;
}

/* 动态类样式 */
:deep(.custom-checkbox-red .el-checkbox__inner) {
  border-color: red;
}

:deep(.custom-checkbox-blue .el-checkbox__inner) {
  border-color: #79bbff;
}

:deep(.custom-checkbox-grey .el-checkbox__inner) {
  border-color: grey;
}
</style>
