package com.example.todolist1.common.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;


@Entity //ánh xạ tới DB
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto  id
      Long id;

    @Column(nullable = false)
     String title;

    @Enumerated(EnumType.STRING)//admin or user
    @Column(nullable = false)
    Status status = Status.INCOMPLETE;

    //john table users and task
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private Users user;



}
