<template>
    <form @submit.prevent="onFormSubmit">

    <div class="form-field">
        <label for="phone">Задание<br/></label>
        <textarea v-model="phone" id="phone" type="message" required> </textarea>
    </div>

    <div class="form-field">
        <label for="password">Исполнитель<br/></label>
        <select v-model="userId">
        <option v-for="userItem in userList" :key="userItem.id" class="todo">
            {{userItem.full_name}},{{userItem.id}}
        </option>
        </select>
    </div>

    <div class="form-field">
        <label for="email">Контактное лицо (ID)<br/></label>
        <select v-model="userId">
        <option v-for="contPers in contractPersonsList" :key="contPers.id" class="todo">
            {{contPers}}
        </option>
        </select>
    </div>

    <div class="form-field">
        <label for="full_name">Номер контракта (ID)<br/></label>
        <input v-model="email" id="email" type="number">
    </div>

    <div class="form-field">
        <label for="phone">Приоритет<br/></label>
        <select v-model="contract" class="todo">
                <option>Высокий</option>
                <option>Средний</option>
                <option>Низкий</option>
        </select>
    </div>

    <div class="form-field">
        <label for="phone">Дата истечения срока<br/></label>
        <input v-model="phone" id="phone" type="date" required>
    </div>

    <button class="submit-btn" type="submit">
        Создать
    </button>
</form>
</template>

<script>
import { fetchUserList } from '@/netClient/dataService'
import { fetchContactsList } from '@/netClient/dataService'
export default {
    name: 'HomePage',
    data: () =>({
        userList: [],
        contractPersonsList: [],
    }),
    async mounted(){
        this.fetchUserList(); 
        this.fetchContactsList();
    },
    methods: {
        async fetchUserList(){
            try {
                this.userList = await fetchUserList()
            } catch (error) {
                console.error({ error });
            }
        },
        async fetchContactsList(){
            try {
                this.contractPersonsList = await fetchContactsList()
            } catch (error) {
                console.error({ error });
            }
        },
    }
}
</script>
