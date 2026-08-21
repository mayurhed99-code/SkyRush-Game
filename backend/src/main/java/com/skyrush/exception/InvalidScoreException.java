package com.skyrush.exception;

import org.springframework.http.HttpStatus;

public class InvalidScoreException extends ApiException {
    public InvalidScoreException(String message) {
        super(HttpStatus.BAD_REQUEST, "INVALID_SCORE", message);
    }
}
