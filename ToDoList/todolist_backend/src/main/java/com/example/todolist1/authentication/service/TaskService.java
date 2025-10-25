package com.example.todolist1.authentication.service;

import com.example.todolist1.common.entity.Task;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.List;

public interface TaskService {

    List<Task> getAllTasksForUser(String username, Collection<? extends GrantedAuthority> authorities);

    Task getTaskById(Long id);
    Task createTask(Task task);
    Task updateTask(Long id, Task task, String username, boolean isAdmin);
    void deleteTask(Long id, String username, boolean isAdmin);
    List<Task> searchTasks(String keyword, String username, boolean isAdmin);
}
