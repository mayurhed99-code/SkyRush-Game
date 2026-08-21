package com.skyrush.exception;

import org.springframework.http.HttpStatus;

public class SessionNotFoundException extends ApiException {
    public SessionNotFoundException() {
        super(HttpStatus.NOT_FOUND, "SESSION_NOT_FOUND", "Game session not found or does not belong to you");
    }
}
