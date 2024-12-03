package org.personwebsite.website.utils;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.personwebsite.website.enums.ResponseEnum;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response<T> {
    // status code
    private Integer code;

    // response message
    private String msg;

    // response data type
    private T data;

    /**
     * request success and no need data
     * @return null
     * @param <T>
     */
    public static  <T> Response<T> success() {
        return new Response<>(ResponseEnum.SUCCESS.getCode(), ResponseEnum.SUCCESS.getMessage(),null);
    }

    /**
     * request success and return data
     * @param data type T data
     * @return data
     * @param <T>
     */
    public static <T> Response<T> success(T data) {
        return new Response<>(ResponseEnum.SUCCESS.getCode(), ResponseEnum.SUCCESS.getMessage(), data);
    }

    /**
     * request success and return data with msg
     * @param data
     * @param msg
     * @return
     * @param <T>
     */
    public static <T> Response<T> success(T data, String msg) {
        return new Response<>(ResponseEnum.SUCCESS.getCode(), msg, data);
    }

    /**
     * request fail and return nothing
     * @return
     * @param <T>
     */
    public static <T> Response<T> failure() {
        return new Response<>(ResponseEnum.FAIL.getCode(), ResponseEnum.FAIL.getMessage(), null);
    }

    /**
     * request fail , return code and msg
     * @param code
     * @param msg
     * @return
     * @param <T>
     */
    public static <T> Response<T> failure(Integer code, String msg) {
        return new Response<>(code, msg, null);
    }
}
