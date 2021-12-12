<template>
  <form @submit.prevent="onFormSubmit">
    <div class="form-field">
      <label for="task">Задание<br /></label>
      <textarea v-model="task" id="task" class="input" type="message" required>
      </textarea>
    </div>

    <div class="form-field">
      <label for="performer">Исполнитель<br /></label>
      <select v-model="performer" class="select" id="performer">
        <option v-for="userItem in userList" :key="userItem.id">
          {{ userItem.full_name }}
        </option>
      </select>
    </div>

    <div class="form-field">
      <label for="contact">Контактное лицо (ID)<br /></label>
      <select v-model="contact" class="select" id="contact">
        <option v-for="contPers in contractPersonsList" :key="contPers.id">
          {{ contPers.full_name }}, {{ contPers.legal_name }}
        </option>
      </select>
    </div>

    <div class="form-field">
      <label for="contract">Номер контракта (ID)<br /></label>
      <input v-model="contract" class="input" id="contract" type="number" />
    </div>

    <div class="form-field">
      <label for="priority">Приоритет<br /></label>
      <select v-model="priority" class="select" id="priority">
        <option>Высокий</option>
        <option>Средний</option>
        <option>Низкий</option>
      </select>
    </div>

    <div class="form-field">
      <label for="date">Дата истечения срока<br /></label>
      <input v-model="date" id="date" class="input" type="date" />
    </div>

    <button class="submit-btn" type="submit">Создать</button>
  </form>
</template>

<script>
import {
  fetchUserList,
  fetchContactsList,
  createTask,
} from "@/netClient/dataService";
export default {
  name: "HomePage",
  data: () => ({
    userList: [],
    contractPersonsList: [],
    task: "",
    performer: "",
    contact: "",
    contract: "",
    priority: "",
    date: "",
  }),
  async mounted() {
    this.fetchUserList();
    this.fetchContactsList();
  },
  methods: {
    async fetchUserList() {
      try {
        this.userList = await fetchUserList();
      } catch (error) {
        console.error({ error });
      }
    },
    async fetchContactsList() {
      try {
        this.contractPersonsList = await fetchContactsList();
      } catch (error) {
        console.error({ error });
      }
    },
    async onFormSubmit() {
      try {
        for (let i = 0; i < this.userList.length; i++) {
          if (this.userList[i].full_name == this.performer) {
            this.performer = this.userList[i].id;
            break;
          }
        }
        for (let i = 0; i < this.contractPersonsList.length; i++) {
          if (
            this.contractPersonsList[i].full_name ==
            String(this.contact).split(",")[0]
          ) {
            this.contact = this.contractPersonsList[i].id;
            break;
          }
        }
        let date = null;
        if (this.date) date = "'" + this.date + "'";
        let contractId = null;
        if (this.contract) contractId = this.contract;
        let result = await createTask(
          this.performer,
          this.contact,
          contractId,
          this.task.trim(),
          this.priority,
          date
        );
        document.getElementById("task").value = "";
        document.getElementById("performer").value = "";
        document.getElementById("contact").value = "";
        document.getElementById("contract").value = "";
        document.getElementById("priority").value = "";
        document.getElementById("date").value = "";
        alert(result);
      } catch (error) {
        console.error({ error });
      }
    },
  },
};
</script>
