package org.personwebsite.website.enums;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ResponseEnum {
    // request success

    SUCCESS(200,"success"),

    // login fail
    LOGIN_USER_USERNAME_OR_PASSWORD_ERROR(400,"username or password error"),

    // not login
    NOT_LOGIN(401,"not login"),

    // user not found
    USER_NOT_FOUND(404,"user not found"),

    // email or username exist
    EMAIL_OR_USERNAME_EXISTS(409,"email or username exist"),

    // request fail
    FAIL(500,"failure");

    // code
    private final Integer code;
    // msg
    private final String message;



}
