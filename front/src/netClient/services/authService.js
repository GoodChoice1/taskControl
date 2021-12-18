import http from "@/netClient/config";
const sha256 = require("js-sha256");

export async function login(login, password) {
  try {
    password = sha256(password);
    const responce = await http.post(
      "/auth/login",
      {},
      {
        headers: {
          login: login,
          password: password,
        },
      }
    );
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
      regLogin,
      regPassword,
      email,
      full_name,
      role,
      phone_number,
    },
    {
      headers: {
        login: login,
        password: password,
      },
    });
    return responce.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
}