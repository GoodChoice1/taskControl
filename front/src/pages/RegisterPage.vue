<template>
    <form @submit.prevent="onFormSubmit">

    <div class="form-field">
        <label for="login">Логин<br/></label>
        <input v-model="regLogin" id="login" type="text" required>
    </div>

    <div class="form-field">
        <label for="password">Пароль<br/></label>
        <input v-model="regPassword" id="password" type="text" required>
    </div>

    <div class="form-field">
        <label for="email">Email<br/></label>
        <input v-model="email" id="email" type="text" required>
    </div>

    <div class="form-field">
        <label for="full_name">ФИО<br/></label>
        <input v-model="full_name" id="full_name" type="text" required>
    </div>

    <div class="form-field">
        <label for="role">Роль<br/></label>
        <select id="role" v-model="role" required>
            <option>Менеджер</option>
            <option>Рядовой сотрудник</option>
        </select>
    </div>

    <div class="form-field">
        <label for="phone">Телефонный номер<br/></label>
        <input v-model="phone" id="phone" type="number" required>
    </div>

    <button class="submit-btn" type="submit">
        Зарегистрировать
    </button>
</form>
</template>

<script>
import { register } from "@/netClient/dataService"
export default {
    name: 'HomePage',
    methods: {
        async onFormSubmit(){
            try {
                const msg = await register(
                    this.regLogin.trim(),
                    this.regPassword.trim(),
                    this.email.trim(),
                    this.full_name.trim(),
                    this.role.trim(),
                    this.phone.trim()
                );
                document.getElementById("login").value = '';
                document.getElementById("password").value = '';
                document.getElementById("email").value = '';
                document.getElementById("full_name").value = '';
                document.getElementById("role").value = '';
                document.getElementById("phone").value = '';
                alert(msg);
            } catch (error) {
                console.error({ error });
            }
        }
    }
}
</script>

