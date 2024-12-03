package org.personwebsite.website.entity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.hibernate.validator.constraints.Length;


@Data
public class UserRegisterDTO {
    // username
    @Pattern(regexp = "^[a-zA-Z0-9\\u4e00-\\u9fa5]+$")
    @Length(min = 6, max = 16)
    private String username;

    //password
    @Length(min = 6, max = 20)
    private String password;

    //user's email
    @Email
    private String email;




}
