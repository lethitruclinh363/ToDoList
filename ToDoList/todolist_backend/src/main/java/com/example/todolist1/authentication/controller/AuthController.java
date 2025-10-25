package com.example.todolist1.authentication.controller;



import com.example.todolist1.authentication.model.response.AuthResponse;
import com.example.todolist1.authentication.service.JwtUtil;
import com.example.todolist1.common.entity.Users;
import com.example.todolist1.event.repository.UserRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthController {

     final UserRepository userRepository;
     final PasswordEncoder passwordEncoder;
     final AuthenticationManager authenticationManager;
     final JwtUtil jwtUtil;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Users user) {
        // Kiểm tra trùng username
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, "Username already exists"));
        }

        // Validate role
        String role = user.getRole();
        if (role == null || role.isEmpty()) {
            role = "USER"; // mặc định
        } else if (!role.equalsIgnoreCase("USER") && !role.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, "Invalid role. Must be USER or ADMIN"));
        }
        user.setRole(role.toUpperCase());

        // Mã hóa mật khẩu
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Lưu user
        userRepository.save(user);

        // Sinh token ngay sau khi đăng ký
        String token = jwtUtil.generateToken(user.getUsername());

        return ResponseEntity.ok(new AuthResponse(token, "User registered successfully"));
    }


    @PostMapping("/login")
    //lấy dữ liệu json ánh xạ tới user
    public ResponseEntity<?> login(@RequestBody Users user) {
        try {
            //Xác thực người dùng
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );

            if (auth.isAuthenticated()) {
                String token = jwtUtil.generateToken(auth.getName()); // sinh ra token and message
                return ResponseEntity.ok(new AuthResponse(token, "Login successful"));  //  201
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED) //token null
                    .body(new AuthResponse(null, "Invalid username or password"));  //401
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse(null, "Invalid username or password"));
    }


}
