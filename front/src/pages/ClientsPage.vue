<template>
    <div class="main">
        <ul>
            <li v-for="urItem in urList" :key="urItem.id" class="todo">
                        {{urItem}}
                </li>
        </ul>
    </div>
</template>

<script>
import { fetchUrList } from '@/netClient/dataService'
export default {
    name: 'HomePage',
    data: () =>({
        urList: [],
    }),
    async mounted(){
        this.fetchLists(); 
    },
    methods: {
        async fetchLists(){
            try {
                this.urList = await fetchUrList();

            } catch (error) {
                console.error({ error });
            }
        }
    }
}
</script>

