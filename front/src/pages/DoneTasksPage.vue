<template>
  <div class="main">
    <ul>
      <li v-for="taskItem in taskList" :key="taskItem.id" class="todo">
        <a @click="redirect(taskItem.id)">
          Задание - {{ taskItem.task }}, было выполнено
          {{ taskItem.completion_date }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { fetchTaskListDone } from "@/netClient/dataService";
export default {
  name: "HomePage",
  data: () => ({
    taskList: [],
  }),
  async mounted() {
    this.fetchTaskList();
  },
  methods: {
    async fetchTaskList() {
      try {
        this.taskList = await fetchTaskListDone();
      } catch (error) {
        console.error({ error });
      }
    },
    async redirect(id) {
      sessionStorage.setItem("id", id);
      this.$router.push("/task");
    },
  },
};
</script>

