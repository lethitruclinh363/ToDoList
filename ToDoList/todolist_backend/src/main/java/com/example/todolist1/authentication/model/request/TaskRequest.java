package com.example.todolist1.authentication.model.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;


@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TaskRequest {

    @NotBlank(message = "title cannot blank")
     String title;
    @NotNull(message = "Status cannot null")
    String status;
    Long userId;

}

