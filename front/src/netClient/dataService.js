import http from "@/netClient/config";
const sha256 = require("js-sha256");

export async function login(login, password) {
  try {
    password = sha256(password);
    const responce = await http.post("/auth/login", {
      login,
      password,
    });
    sessionStorage.login = login;
    sessionStorage.password = password;
    sessionStorage.userRole = responce.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function register(
  regLogin,
  regPassword,
  email,
  full_name,
  role,
  phone_number
) {
  try {
    regPassword = sha256(regPassword);
    let login = sessionStorage.login;
    let password = sessionStorage.password;
    const responce = await http.post("/auth/register", {
      login,
      password,
      regLogin,
      regPassword,
      email,
      full_name,
      role,
      phone_number,
    });
    return responce.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

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

export async function fetchUserList() {
  try {
    let responce = "";
    if (sessionStorage.userRole != "Администратор") {
      responce = await http.get("/rest/users", {
        headers: {
          login: sessionStorage.login,
          password: sessionStorage.password,
        },
      });
    } else {
      responce = await http.get("/rest/allusers", {
        headers: {
          login: sessionStorage.login,
          password: sessionStorage.password,
        },
      });
    }
    return responce.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function fetchContactsList() {
  try {
    const responce = await http.get("/rest/contPersons", {
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

export async function fetchUrList() {
  try {
    let responce = await http.get("/rest/orgs", {
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

export async function getReport(left, right) {
  try {
    let responce = await http.get("/rest/report", {
      headers: {
        login: sessionStorage.login,
        password: sessionStorage.password,
        left,
        right,
      },
    });
    return responce.data.result;
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
    sessionStorage.removeItem('id')
    return responce.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
}