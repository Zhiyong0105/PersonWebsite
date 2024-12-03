package org.personwebsite.website.service;

import org.personwebsite.website.entity.User;
import org.personwebsite.website.entity.dto.UserRegisterDTO;
import org.personwebsite.website.utils.Response;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface IUserService extends UserDetailsService {
    /**
     * Register
     * @param userRegisterDTO client info
     * @return success or fail
     */
   Response<Void> userRegister(UserRegisterDTO userRegisterDTO);


}
