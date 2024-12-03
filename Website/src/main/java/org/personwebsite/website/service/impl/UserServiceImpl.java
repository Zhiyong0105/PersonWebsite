package org.personwebsite.website.service.impl;

import jakarta.annotation.Resource;
import org.personwebsite.website.entity.User;
import org.personwebsite.website.entity.dto.UserRegisterDTO;
import org.personwebsite.website.enums.ResponseEnum;
import org.personwebsite.website.repository.UserRepository;
import org.personwebsite.website.service.IUserService;
import org.personwebsite.website.utils.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class UserServiceImpl implements IUserService {
    @Resource
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Response<Void> userRegister(UserRegisterDTO userRegisterDTO) {
        if(userRepository.existsByUsernameOrEmail(userRegisterDTO.getUsername(), userRegisterDTO.getEmail())){
            return  Response.failure(ResponseEnum.FAIL.getCode(),ResponseEnum.EMAIL_OR_USERNAME_EXISTS.getMessage());
        }
        String encodedPassword = passwordEncoder.encode(userRegisterDTO.getPassword());
        Date date = new Date();

        User user  = User.builder()
                .username(userRegisterDTO.getUsername())
                .password(encodedPassword)
                .email(userRegisterDTO.getEmail())
                .createdTime(date)
                .build();
        userRepository.save(user);
        return Response.success();

    }



    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }
}
