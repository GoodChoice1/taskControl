<template>
    <div class="main">
        <div>Клиенты: </div>
        <ul>
            <li v-for="urItem in urList" :key="urItem.id">
                {{urItem.legal_name}},{{urItem.director_full_name}}
                <ul>
                    <li v-for="person in urItem.contactPersList" :key="person.id">
                        {{person.full_name}},{{person.phone_number}},{{person.work_position}}
                    </li>
                </ul>
                <ul>
                    <li v-for="contract in urItem.contractList" :key="contract.contract_number">
                        {{contract.description}}
                        <br/>
                        Номер контракта: {{contract.contract_number}}, 
                        <ul>
                            <li v-for="equipment in contract.eqList" :key="equipment.id">
                                {{equipment.name}},{{equipment.serial_number}}
                            </li>
                            <br/>
                        </ul>
                    </li>
                </ul>
                <div id="text" v-if="urItem.ispotential">Клиент потенциальный</div>
                <br/>
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

