package com.example.todolist1.authentication.controller;

import com.example.todolist1.authentication.model.request.TaskRequest;
import com.example.todolist1.authentication.service.TaskService;
import com.example.todolist1.common.entity.Status;
import com.example.todolist1.common.entity.Task;
import com.example.todolist1.common.entity.Users;
import com.example.todolist1.event.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@AllArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;


    @GetMapping
    //lấy all task
    public ResponseEntity<List<Task>> getAllTasks(Authentication authentication) {
        String username = authentication.getName();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();//phân biệt quyền truy cập

        List<Task> tasks = taskService.getAllTasksForUser(username, authorities);//để lấy danh sách task phù hợp
        return ResponseEntity.ok(tasks);
    }
//tìm task
@GetMapping("/search")
public ResponseEntity<List<Task>> searchTasks(
        @RequestParam(required = false) String keyword,
        Authentication authentication) {

    String username = authentication.getName();
    boolean isAdmin = authentication.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ADMIN"));

    List<Task> tasks = taskService.searchTasks(keyword, username, isAdmin);
    return ResponseEntity.ok(tasks);
}



    //createTask
    @PostMapping("/add")
    public ResponseEntity<Task> createTask(@RequestBody TaskRequest request, Authentication authentication) {
        String username = authentication.getName();
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setStatus(Status.valueOf(request.getStatus().toUpperCase()));
        task.setUser(user);

        Task saved = taskService.createTask(task);
        return ResponseEntity.ok(saved);
    }

    //updateTask
    @PutMapping("/update/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @RequestBody TaskRequest request,
            Authentication authentication) {

        String username = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));

        Task updatedTask = new Task();
        updatedTask.setTitle(request.getTitle());
        updatedTask.setStatus(Status.valueOf(request.getStatus().toUpperCase()));

        Task saved = taskService.updateTask(id, updatedTask, username, isAdmin);
        return ResponseEntity.ok(saved);
    }

   //deleteTask
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));

        taskService.deleteTask(id, username, isAdmin);
        return ResponseEntity.ok("Task deleted successfully");
    }
}
