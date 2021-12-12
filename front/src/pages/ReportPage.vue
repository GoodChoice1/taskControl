<template>
  <div id="main">
    <form @submit.prevent="onFormSubmit">
      Введите дату для генерации отчета

      <div class="form-field">
        <label for="leftDate">От<br /></label>
        <input v-model="leftDate" id="leftDate" type="date" required />
      </div>

      <div class="form-field">
        <label for="rightDate">До<br /></label>
        <input v-model="rightDate" id="rightDate" type="date" required />
      </div>

      <button class="submit-btn" type="submit">Сгенерировать отчёт</button>
    </form>
    <div v-if="isReportGot()">
      <ul>
        <li v-for="report in reportInfo" v-bind:key="report">
          {{ report }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getReport } from "@/netClient/dataService";
export default {
  name: "ReportPage",
  data: () => ({
    reportInfo: "",
    leftDate: "",
    rightDate: "",
  }),
  methods: {
    async onFormSubmit() {
      try {
        this.reportInfo = await getReport(this.leftDate, this.rightDate);
      } catch (error) {
        console.error({ error });
      }
    },
    isReportGot() {
      return this.reportInfo != "";
    },
  },
};
</script>