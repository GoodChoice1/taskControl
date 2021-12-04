<template>
    <div class="main">
        <ul>
            <li v-for="taskItem in tasksList" :key="taskItem.id" class="todo">
                    {{taskItem}}
                </li>
        </ul>
    </div>
</template>

<script>
import { fetchTaskListUndone } from '@/netClient/dataService'
export default {
    name: 'HomePage',
    data: () =>({
        tasksList: [],
    }),
    async mounted(){
        this.fetchTaskList(); 
    },
    methods: {
        async fetchTaskList(){
            try {
                this.tasksList = await fetchTaskListUndone()
            } catch (error) {
                console.error({ error });
            }
        }
    }
}
</script>

