import http from "@/netClient/config";
const sha256 = require('js-sha256');

export async function login(login,password) {
  try {
    password = sha256(password);
    const responce =await http.post('/auth/login',{
        login,
        password
    })
    localStorage.login = login;
    localStorage.password = password;
    localStorage.userRole = responce.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function register(regLogin,regPassword,email,full_name,role,phone_number) {
  try {
    regPassword = sha256(regPassword);
    let login = localStorage.login;
    let password = localStorage.password;
    const responce =await http.post('/auth/register',
    {
      login,
      password,
      regLogin,
      regPassword,
      email,
      full_name,
      role,
      phone_number,
    })
    return responce.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function fetchTaskListUndone() {
  try {
    const responce =await http.get('/task/',{
      headers: {
        login: localStorage.login,
        password: localStorage.password
      }
    })
    for (let i =0;i<responce.data.length;i++){
      if (responce.data[i].completion_date) responce.data.splice(i,1);
    }
    return responce.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function fetchTaskListDone() {
  try {
    const responce =await http.get('/task/',{
      headers: {
        login: localStorage.login,
        password: localStorage.password
      }
    })
    for (let i =0;i<responce.data.length;i++){
      if (!responce.data[i].completion_date) responce.data.splice(i,1);
    }
    return responce.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function fetchUserList() {
  try {
    const responce =await http.get('/rest/users',{
      headers: {
        login: localStorage.login,
        password: localStorage.password
      }
    })
    return responce.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function fetchContactsList() {
  try {
    const responce =await http.get('/rest/contPersons',{
      headers: {
        login: localStorage.login,
        password: localStorage.password
      }
    })
    return responce.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function fetchUrList() {
  try {
    let responce =await http.get('/rest/orgs',{
      headers: {
        login: localStorage.login,
        password: localStorage.password
      }
    });
    return responce.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
}