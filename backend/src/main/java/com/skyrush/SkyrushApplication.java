package com.skyrush;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SkyrushApplication {
    public static void main(String[] args) {
        SpringApplication.run(SkyrushApplication.class, args);
    }
}
