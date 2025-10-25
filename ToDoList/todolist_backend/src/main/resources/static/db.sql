
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY, 
    username VARCHAR(255), 
    password VARCHAR(255) NOT NULL, 
    role VARCHAR(50) NOT NULL 
);

-- TÀI KHOẢN 1: DÙNG CHO PHÂN QUYỀN CƠ BẢN (ADMIN)
-- "username": "admin"
-- "password": "123",
--
-- TÀI KHOẢN 2: DÙNG CHO PHÂN QUYỀN CƠ BẢN (USER)
--     "username": "user"
--     "password": "12345"

INSERT INTO users (username, password, role) 
VALUES ('testuser', '$2a$10$L0J4D.y9f8dC3p2qW7G6N.w0Xv4Y1e7H0S.aV1c4B0F.z7T1k5m9', 'ROLE_USER');
SELECT id, username, role FROM users;


INSERT INTO users(username, password, role)
VALUES ('admin', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8hRheFqvZ1yPZxFQq6E8JxT6qfQH9K', 'ADMIN');
UPDATE users
SET role = 'ADMIN'
WHERE username = 'admin';

CREATE TABLE tasks (
     id BIGSERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     status VARCHAR(50) NOT NULL DEFAULT 'INCOMPLETE',
     user_id BIGINT NOT NULL, 
    

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE -- Nếu User bị xóa, Task của họ cũng bị xóa
);

INSERT INTO tasks (title, status, user_id) 
VALUES ('Hoàn thành Assignment Spring Boot', 'INCOMPLETE', 1);

INSERT INTO tasks (title, status, user_id) 
VALUES ('Kiểm tra lỗi database PostgreSQL', 'COMPLETED', 1);

INSERT INTO tasks (title, status, user_id)
VALUES ('Task mới sau khi đăng nhập', 'INCOMPLETE', 2);

select * from tasks
SELECT * FROM tasks WHERE title ILIKE '%Money%';

