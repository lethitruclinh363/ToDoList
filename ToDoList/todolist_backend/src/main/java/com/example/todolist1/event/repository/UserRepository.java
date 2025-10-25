package com.example.todolist1.event.repository;

import com.example.todolist1.common.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;



public interface UserRepository extends JpaRepository<Users, Long> {
  // tìm username
    Optional<Users> findByUsername(String username);

}
