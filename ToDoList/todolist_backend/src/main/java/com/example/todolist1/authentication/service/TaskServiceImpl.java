package com.example.todolist1.authentication.service;

import com.example.todolist1.common.entity.Task;
import com.example.todolist1.common.entity.Users;
import com.example.todolist1.event.repository.TaskRepository;
import com.example.todolist1.event.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
@AllArgsConstructor
// business logic
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Override
    public List<Task> getAllTasksForUser(String username, Collection<? extends GrantedAuthority> authorities) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = user.getRole().equalsIgnoreCase("ADMIN");

        if (isAdmin) {
            return taskRepository.findAll();
        }
        return taskRepository.findByUser(user);
    }

    @Override
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id " + id));
    }

    @Override
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Long id, Task task, String username, boolean isAdmin) {
        Task existing = getTaskById(id);

        if (!isAdmin && !existing.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("Bạn không có quyền sửa task này");
        }

        existing.setTitle(task.getTitle());
        existing.setStatus(task.getStatus());
        return taskRepository.save(existing);
    }

    @Override
    public void deleteTask(Long id, String username, boolean isAdmin) {
        Task existing = getTaskById(id);

        if (!isAdmin && !existing.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("Bạn không có quyền xóa task này");
        }

        taskRepository.delete(existing);
    }

    //  Tìm kiếm task theo từ khóa
    @Override
    public List<Task> searchTasks(String keyword, String username, boolean isAdmin) {
        // Nếu keyword rỗng, trả tất cả task
        if (keyword == null || keyword.trim().isEmpty()) {
            Users user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return isAdmin ? taskRepository.findAll() : taskRepository.findByUser(user);
        }

        if (isAdmin) {
            return taskRepository.findByTitleContainingIgnoreCase(keyword);
        } else {
            Users user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return taskRepository.findByUserAndTitleContainingIgnoreCase(user, keyword);
        }
    }
}