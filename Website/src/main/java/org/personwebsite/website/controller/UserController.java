package org.personwebsite.website.controller;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.personwebsite.website.entity.dto.UserRegisterDTO;
import org.personwebsite.website.service.impl.UserServiceImpl;
import org.personwebsite.website.utils.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserServiceImpl userService;

    @PostMapping("/register")
    public Response<Void> register( @Valid @RequestBody UserRegisterDTO registerDTO) {
        return userService.userRegister(registerDTO);
    }
}
