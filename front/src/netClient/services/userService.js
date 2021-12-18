import http from "@/netClient/config";

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