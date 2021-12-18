import http from "@/netClient/config";

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
  