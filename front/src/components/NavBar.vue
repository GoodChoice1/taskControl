<template>
    <div id="nav">
      <router-link class="link" to ="/">
        Список невыполненных заданий
      </router-link>
      <router-link class="link" to ="/done">
        Список выполненных заданий
      </router-link>
      <router-link class="link" to ="/task">
        Задание
      </router-link>
      <router-link v-if="isManager() || isAdmin()" class="link" to ="/create">
        Создать задание
      </router-link>
      <router-link class="link" to ="/clients">
        Клиенты
      </router-link>
      <router-link v-if="isAdmin()" class="link" to ="/register">
        Регистрация пользователя
      </router-link>
      <router-link class="link" to ="/report">
        Отчёт
      </router-link>
      <a class="link" @click="onLogoutClicked">
        Выход
      </a>
    </div>
</template>

<script>

export default {
  name: "NavBar",
  methods: {
    async onLogoutClicked(){
            try {
                sessionStorage.removeItem('login');
                sessionStorage.removeItem('userRole');
                sessionStorage.removeItem('password');
                sessionStorage.removeItem('id')
                this.$router.push('/login');
            } catch (error) {
                console.error({ error });
            }
    },
    isAdmin(){
      return sessionStorage.userRole == 'Администратор'
    },
    isManager(){
      return sessionStorage.userRole == 'Менеджер'
    },
  }
}
</script>