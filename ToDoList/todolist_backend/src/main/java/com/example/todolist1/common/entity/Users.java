package com.example.todolist1.common.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "users")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)//default private
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id; //UUID KIỂU LONG or INTEGER

    @Column(unique = true, nullable = false)
     String username;

    @Column(nullable = false)
    String password; // BCrypt hash

    @Column(nullable = false)// cannot null
     String role;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)

    private List<Task> tasks = new ArrayList<>();



}

