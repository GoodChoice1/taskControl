<template>
    <div v-if="isTaskChosen()" class="main">
        <div class="text">Задание: {{task.task}}</div>
        <div class="text">Приоритет: {{task.priority}}</div>
        <div class="text">Дата создания: {{task.creation_date}}</div>
        <div class="text" v-if="task.expiration_date">Дата дедлайна: {{task.expiration_date}}</div>
        <div v-else>Бессрочное задание</div>
        <div class="text" v-if="task.completion_date">Дата выполнения: {{task.completion_date}}</div>
        <br/>
        <div class="text">ФИО контакта: {{task.full_name}}</div>
        <div class="text">Телефон контакта: {{task.phone_number}}</div>
        <div class="text">Почта контакта: {{task.email}}</div>
        <div class="text">Удобное время для связи: {{task.time_to_call}}</div>
        <br/>
        <div class="text">Наименование юр. лица: {{task.legal_name}}</div>
        <div class="text">Адрес юр. лица: {{task.physical_addres}}</div>
        <br/>
        <div class="text">ФИО автора задания: {{author.full_name}}</div>
        <div class="text">Должность: {{author.work_position}}</div>
        <div class="text">Телефон: {{author.phone_number}}</div>
        <br/>
        <div class="text">ФИО исполнителя задания: {{performer.full_name}}</div>
        <div class="text">Должность: {{performer.work_position}}</div>
        <div class="text">Телефон: {{performer.phone_number}}</div>
        
    </div>
</template>

<script>
import { fetchTaskById } from '@/netClient/dataService'
export default {
    name: 'HomePage',
    data: () =>({
        task: {},
        author: {},
        performer: {}
    }),
    async mounted(){
        if(sessionStorage.id) this.fetchTaskById();
    },
    methods: {
        async fetchTaskById(){
            try {
                let task ='';
                let performer ='';
                let author= '';
                ({author,performer,task} = await fetchTaskById());
                this.task = task;
                this.performer = performer;
                this.author = author;
                console.warn(task)
            } catch (error) {
                console.error({ error });
            }
        },
        isTaskChosen(){
            return sessionStorage?.id
        }
    }
}
</script>

