import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    meta: {
      title: "Список дел",
      layout: "main-layout",
    },
    component: () => import("@/pages/HomePage.vue"),
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "Авторизация",
      layout: "auth-layout",
    },
    component: () => import("@/pages/LoginPage.vue"),
  },
  {
    path: "/register",
    name: "register",
    meta: {
      title: "Регистрация",
      layout: "main-layout",
    },
    component: () => import("@/pages/RegisterPage.vue"),
  },
  {
    path: "/done",
    name: "done",
    meta: {
      title: "Выполненные задания",
      layout: "main-layout",
    },
    component: () => import("@/pages/DoneTasksPage.vue"),
  },
  {
    path: "/create",
    name: "creation",
    meta: {
      title: "Создание задания",
      layout: "main-layout",
    },
    component: () => import("@/pages/CreateTaskPage.vue"),
  },
  {
    path: "/clients",
    name: "clients",
    meta: {
      title: "Просмотр юр лиц, их контрактов и контактных лиц",
      layout: "main-layout",
    },
    component: () => import("@/pages/ClientsPage.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const { userRole } = localStorage;
  if (userRole || to.name == "login") {
    if ( to.name == "login"){
      next();
    }
    else if (userRole == "Администратор"){
      next();
    }
    else if (to.name != "register" && userRole == "Менеджер"){
    next();
    }
    else if (to.name != "register" && to.name !="creation" && userRole == "Рядовой сотрудник"){
      next();
    }
    else{
      alert("Доступ запрещен");
      next("/")
    }
  }
   else {
    next("/login");
  }
});

export default router;
