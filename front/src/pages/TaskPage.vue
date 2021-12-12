<template>
  <div v-if="isTaskChosen()" class="main">
    <div>
      <div class="text">Задание: {{ task.task }}</div>
      <div class="text">Приоритет: {{ task.priority }}</div>
      <div class="text">Дата создания: {{ task.creation_date }}</div>
      <div class="text" v-if="task.expiration_date">
        Дата дедлайна: {{ task.expiration_date }}
      </div>
      <div v-else>Бессрочное задание</div>
      <div class="text" v-if="task.completion_date">
        Дата выполнения: {{ task.completion_date }}
      </div>
      <br />
      <div class="text">ФИО контакта: {{ task.full_name }}</div>
      <div class="text">Телефон контакта: {{ task.phone_number }}</div>
      <div class="text">Почта контакта: {{ task.email }}</div>
      <div class="text">Удобное время для связи: {{ task.time_to_call }}</div>
      <br />
      <div class="text">Наименование юр. лица: {{ task.legal_name }}</div>
      <div class="text">Адрес юр. лица: {{ task.physical_addres }}</div>
      <br />
      <div class="text">ФИО автора задания: {{ author.full_name }}</div>
      <div class="text">Должность: {{ author.work_position }}</div>
      <div class="text">Телефон: {{ author.phone_number }}</div>
      <br />
      <div class="text">ФИО исполнителя задания: {{ performer.full_name }}</div>
      <div class="text">Должность: {{ performer.work_position }}</div>
      <div class="text">Телефон: {{ performer.phone_number }}</div>

      <button
        @click="completeTask()"
        class="submit-btn"
        type="submit"
        v-if="!task.completion_date"
      >
        Завершить задачу
      </button>
      <button
        @click="deleteTask()"
        class="submit-btn"
        type="submit"
        v-if="isAdmin()"
      >
        Удалить задачу
      </button>
    </div>
    <div v-if="changeTask()">
      <br />
      Изменить задание
      <form @submit.prevent="onFormSubmit()">
        <div class="form-field">
          <label for="taskName">Задание<br /></label>
          <textarea
            v-model="taskName"
            id="taskName"
            class="input"
            type="message"
            required
          >
          </textarea>
        </div>

        <div class="form-field" v-if="isAdmin()">
          <label for="authorName">Автор<br /></label>
          <select v-model="authorName" class="select" id="authorName">
            <option v-for="userItem in userList" :key="userItem.id">
              {{ userItem.full_name }}
            </option>
          </select>
        </div>

        <div class="form-field">
          <label for="performerName">Исполнитель<br /></label>
          <select
            v-model="performerName"
            class="select"
            id="performerName"
            required
          >
            <option v-for="userItem in userList" :key="userItem.id">
              {{ userItem.full_name }}
            </option>
          </select>
        </div>
        <div class="form-field">
          <label for="contact">Контактное лицо (ID)<br /></label>
          <select v-model="contact" class="select" id="contact">
            <option
              v-for="contPers in contractPersonsList"
              :key="contPers.id"
              required
            >
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
          <select v-model="priority" class="select" id="priority" required>
            <option>Высокий</option>
            <option>Средний</option>
            <option>Низкий</option>
          </select>
        </div>

        <div class="form-field">
          <label for="date">Дата окончания<br /></label>
          <input v-model="date" id="date" type="date" />
        </div>

        <button class="submit-btn" type="submit">Изменить</button>
      </form>
    </div>
  </div>
  <div v-else>Задание не выбрано</div>
</template>

<script>
import {
  fetchUserList,
  fetchContactsList,
  updateTaskById,
  fetchTaskById,
  completeTask,
  isUserAuthor,
  deleteTask,
} from "@/netClient/dataService";
export default {
  name: "HomePage",
  data: () => ({
    task: {},
    author: {},
    performer: {},
    userList: [],
    contractPersonsList: "",
    taskName: "",
    authorName: "",
    performerName: "",
    contact: "",
    contract: "",
    priority: "",
    date: "",
    isAuthor: false,
  }),
  async mounted() {
    if (sessionStorage.id) {
      this.fetchTaskById();
      this.isHeAuthor();
      this.fetchUserList();
      this.fetchContactsList();
    }
  },
  methods: {
    async isHeAuthor() {
      let responce = await isUserAuthor();
      this.isAuthor = responce;
    },
    async fetchTaskById() {
      try {
        let task = "";
        let performer = "";
        let author = "";
        ({ author, performer, task } = await fetchTaskById());
        this.task = task;
        this.performer = performer;
        this.author = author;
      } catch (error) {
        console.error({ error });
      }
    },
    isTaskChosen() {
      return sessionStorage?.id;
    },
    changeTask() {
      if (sessionStorage.userRole == "Администратор") return true;
      if (
        this.task.completion_date == null &&
        sessionStorage.userRole == "Менеджер"
      ) {
        return this.isAuthor;
      } else return false;
    },
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
        var task = {};
        task.task = this.taskName;
        task.contact_person_id = "";
        for (let i = 0; i < this.contractPersonsList.length; i++) {
          console.warn(this.contractPersonsList[i])
          if (
            this.contractPersonsList[i].full_name ==
            String(this.contact).split(",")[0]
          ) {
            console.warn(String(this.contact).split(",")[0])
            task.contact_person_id = this.contractPersonsList[i].id;
            break
          }
        }
        task.priority = this.priority;
        if (this.date) {
          task.date = `'${this.date}'`;
        } else task.date = null;
        if (this.contract) {
          task.contract_number = this.contract;
        } else {
          task.contract_number = null;
        }
        task.person_id_performer = "";
        for (let i = 0; i < this.userList.length; i++) {
          if (this.userList[i].full_name == this.performerName) {
            task.person_id_performer = this.userList[i].id;
            break
          }
        }
        if (sessionStorage.userRole == "Администратор") {
          task.person_id_author = "";
          for (let i = 0; i < this.userList.length; i++) {
            if (this.userList[i].full_name == this.authorName) {
              task.person_id_author = this.userList[i].id;
              break
            }
          }
        }

        await updateTaskById(task);
        window.location.reload();
      } catch (error) {
        console.error({ error });
      }
    },
    isAdmin() {
      return sessionStorage.userRole == "Администратор";
    },
    async completeTask() {
      try {
        await completeTask();
        window.location.reload();
      } catch (error) {
        console.error({ error });
      }
    },
    async deleteTask() {
      try {
        await deleteTask();
        this.$router.push("/");
      } catch (error) {
        console.error({ error });
      }
    },
  },
};
</script>

