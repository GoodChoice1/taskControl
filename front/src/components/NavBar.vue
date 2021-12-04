<template>
    <div id="nav">
      <router-link class="link" to ="/">
        Список невыполненных заданий
      </router-link>
      <router-link class="link" to ="/done">
        Список выполненных заданий
      </router-link>
      <router-link class="link" to ="/create">
        Создать задание
      </router-link>
      <router-link class="link" to ="/clients">
        Клиенты
      </router-link>
      <router-link class="link" to ="/register">
        Регистрация пользователя
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
                localStorage.removeItem('login');
                localStorage.removeItem('userRole');
                localStorage.removeItem('password');
                this.$router.push('/login');
            } catch (error) {
                console.error({ error });
            }
        }
  }
}
</script>