package com.synup.movieapp.payload;

import lombok.Data;

@Data
public class SignupRequest {
    private String username;
    private String password;
}
