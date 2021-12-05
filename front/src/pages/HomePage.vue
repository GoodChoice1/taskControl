<template>
    <div class="main">
        <ul>
            <li v-for="taskItem in taskList" :key="taskItem.id" class="todo">
                <a @click="redirect(taskItem.id)">
                    <div>
                        Задача: {{taskItem.task}}
                    </div>
                    <div v-if="taskItem.expiration_date">
                        истекает {{taskItem.expiration_date}}
                    </div>
                    <div v-else>
                        бессрочное
                    </div>
                    <div>
                        Приоритет: {{taskItem.priority}}
                    </div>
                    <br/>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { fetchTaskListUndone } from '@/netClient/dataService'
export default {
    name: 'HomePage',
    data: () =>({
        taskList: [],
    }),
    async mounted(){
        this.fetchTaskList(); 
    },
    methods: {
        async fetchTaskList(){
            try {
                this.taskList = await fetchTaskListUndone()
            } catch (error) {
                console.error({ error });
            }
        },
        async redirect(id){
            sessionStorage.setItem('id',id)
            this.$router.push('/task');
        }
    }
}
</script>

