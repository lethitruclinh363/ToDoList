import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8082/api", 
});


// 🔑 INTERCEPTOR CẦN THIẾT NHẤT: GỬI TOKEN LÊN SERVER
API.interceptors.request.use((req) => {
    // 1. Lấy token
    const token = localStorage.getItem("token");

    // 2. Nếu có token VÀ request không phải là login/register
    // (Lưu ý: Bạn có thể bỏ qua phần kiểm tra URL nếu tất cả các API khác đều cần token)
    if (token && !req.url.includes("/auth/login") && !req.url.includes("/auth/register")) {
        // Gắn token vào header Authorization
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});


// 🚨 RESPONSE INTERCEPTOR CŨ (Giữ lại để xử lý lỗi 401)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Nếu server trả về 401, xóa token và chuyển hướng
      alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/"; // redirect về login
    }
    return Promise.reject(error);
  }
);


export default API;