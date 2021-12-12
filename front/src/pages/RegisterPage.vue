<template>
    <form @submit.prevent="onFormSubmit">

    <div class="form-field">
        <label for="login">Логин<br/></label>
        <input v-model="regLogin" id="login" class="input" type="text" required>
    </div>

    <div class="form-field">
        <label for="password">Пароль<br/></label>
        <input v-model="regPassword" id="password" class="input" type="text" required>
    </div>

    <div class="form-field">
        <label for="email">Email<br/></label>
        <input v-model="email" id="email" class="input" type="text" required>
    </div>

    <div class="form-field">
        <label for="full_name">ФИО<br/></label>
        <input v-model="full_name" id="full_name" class="input" type="text" required>
    </div>

    <div class="form-field">
        <label for="role">Роль<br/></label>
        <select id="role" class="select" v-model="role" required>
            <option>Менеджер</option>
            <option>Рядовой сотрудник</option>
        </select>
    </div>

    <div class="form-field">
        <label for="phone">Телефонный номер<br/></label>
        <input v-model="phone" id="phone" class="input" type="number" required>
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
    data: () =>({
        regLogin: '',
        regPassword: '',
        email: '',
        full_name: '',
        role: '',
        phone: '',
    }),
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

