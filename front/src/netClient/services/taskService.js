import http from "@/netClient/config";

export async function fetchTaskListUndone() {
    try {
      let responce = await http.get("/task/", {
        headers: {
          login: sessionStorage.login,
          password: sessionStorage.password,
        },
      });
      for (let i = responce.data.length - 1; i > -1; i--) {
        if (responce.data[i].completion_date) responce.data.splice(i, 1);
      }
      return responce.data;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
  
  export async function fetchTaskListDone() {
    try {
      let responce = await http.get("/task/", {
        headers: {
          login: sessionStorage.login,
          password: sessionStorage.password,
        },
      });
      for (let i = responce.data.length - 1; i > -1; i--) {
        if (!responce.data[i].completion_date) responce.data.splice(i, 1);
      }
      return responce.data;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  export async function createTask(
    person_id_performer,
    contact_person_id,
    contract_number,
    task,
    priority,
    expiration_date
  ) {
    try {
      let responce = await http.post(
        "/task/",
        {
          person_id_performer,
          contact_person_id,
          contract_number,
          task,
          priority,
          expiration_date,
        },
        {
          headers: {
            login: sessionStorage.login,
            password: sessionStorage.password,
          },
        }
      );
      return responce.data;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  
export async function fetchTaskById() {
    try {
      let responce = await http.get("/task/" + sessionStorage.id, {
        headers: {
          login: sessionStorage.login,
          password: sessionStorage.password,
        },
      });
      return responce.data;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
  
  export async function updateTaskById(task) {
    try {
      let responce = await http.patch(
        "/task/" + sessionStorage.id,
        {
          ...task,
        },
        {
          headers: {
            login: sessionStorage.login,
            password: sessionStorage.password,
          },
        }
      );
      return responce.data;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
  
  export async function completeTask() {
    try {
      let responce = await http.patch(
        "/task/complete/" + sessionStorage.id,
        {},
        {
          headers: {
            login: sessionStorage.login,
            password: sessionStorage.password,
          },
        }
      );
      return responce.data;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
  
  export async function isUserAuthor() {
    try {
      let responce = await http.get("/task/isAuthor/" + sessionStorage.id, {
        headers: {
          login: sessionStorage.login,
          password: sessionStorage.password,
        },
      });
      return responce.data;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
  
  export async function deleteTask() {
    try {
      let responce = await http.delete("/task/" + sessionStorage.id, {
        headers: {
          login: sessionStorage.login,
          password: sessionStorage.password,
        },
      });
      sessionStorage.removeItem("id");
      return responce.data;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }