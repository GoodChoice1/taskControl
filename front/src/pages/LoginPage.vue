<template>
    <form @submit.prevent="onFormSubmit"> 
        <div class="form-field">
            <label for="login"></label>
            Логин
            <br/>
            <input v-model="login" id="login" type="text" required>
        </div>
        <div class="form-field">
            <label for="password"></label>
            Пароль
            <br/>
            <input v-model="password" id="password" type="text" required>
        </div>
        <button class="submit-btn" type="submit">
            Войти
        </button>
    </form>
</template>

<script>
import { login } from '@/netClient/dataService';

export default {
    name: 'LoginPage',
    methods: {
        async onFormSubmit(){
            try {
                await login(
                    this.login.trim(),
                    this.password.trim()
                );
                this.$router.push('/');
            } catch (error) {
                console.error({ error });
            }
        }
    }
}
</script>

