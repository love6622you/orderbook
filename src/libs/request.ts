import ky, { HTTPError } from "ky";

// 創建 ky 實例
const request = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_BASEAPI,
  throwHttpErrors: true, // 默認不拋出 HTTP 錯誤
  retry: 0, // 禁用自動重試
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem("access_token");
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          console.error("Unauthorized request:", request);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user_id");
          localStorage.removeItem("username");
          localStorage.removeItem("roomName");

          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
        }
        return response;
      },
    ],
    beforeError: [
      async (error) => {
        const { response } = error as HTTPError;
        if (response && response.status === 401) {
          console.error("Handled 401 error");
        }
        return error;
      },
    ],
  },
});

export default request;
