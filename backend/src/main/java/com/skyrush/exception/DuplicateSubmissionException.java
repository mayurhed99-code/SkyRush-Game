package com.skyrush.exception;

import org.springframework.http.HttpStatus;

public class DuplicateSubmissionException extends ApiException {
    public DuplicateSubmissionException() {
        super(HttpStatus.CONFLICT, "DUPLICATE_SUBMISSION", "A score has already been submitted for this session");
    }
}
