package com.example.todolist1.event.repository;

import com.example.todolist1.common.entity.Task;
import com.example.todolist1.common.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUser(Users user); // lấy task theo user

    List<Task> findByTitleContainingIgnoreCase(String keyword); // admin tìm kiếm tất cả

    List<Task> findByUserAndTitleContainingIgnoreCase(Users user, String keyword); // user tìm kiếm
}
