
#  To-Do List Application

## 🧩 Giới thiệu
Dự án **To-Do List** là một ứng dụng giúp người dùng **xem,thêm, chỉnh sửa, và xóa công việc**.  
Ứng dụng được xây dựng với mục tiêu giúp quản lý thời gian và công việc hằng ngày một cách dễ dàng.

---

## ⚙️ Công nghệ sử dụng
- **Frontend:** React, Router chuyển trang,Bootstrap. 
- **Backend:**  Java (Spring Boot)  
- **Database:**  PostgreSQL  
- **Version Control:** Git & GitHub
---
  ## Chức năng chính
- **Thêm công việc mới
- **Chỉnh sửa nội dung công việc
- **Xóa công việc
- **Tìm kiếm công việc theo từ khóa
- **Phân quyền người dùng** (User / Admin)  
  - Người dùng chỉ xem và quản lý công việc của riêng mình  
  - Quản trị viên (Admin) có thể xem và quản lý toàn bộ  

---
| Trang                         | Mô tả                         |
| ----------------------------- | ----------------------------- |
| 🏠 Trang chủ                  | Hiển thị danh sách công việc  |
| 🔐 Trang đăng nhập            | Người dùng đăng nhập hệ thống |
| 📝 Trang thêm / sửa công việc | Form CRUD công việc           |
| 👤 Trang tài khoản            | Hiển thị thông tin người dùng |


## 🚀 Cài đặt và chạy ứng dụng
### 1.Git Clone project
```bash
git clone https://github.com/lethitruclinh363/ToDoList.git
cd todolist
### 2.Backend (Spring Boot)
run project or./mvnw spring-boot:run
Server chạy tại: 👉 http://localhost:8080
### 3.Frontend (React)
cd frontend
npm install
npm start
Server http://localhost:3000



