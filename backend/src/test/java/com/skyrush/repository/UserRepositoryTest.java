package com.skyrush.repository;

import com.skyrush.entity.Role;
import com.skyrush.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@ActiveProfiles("test")
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {

    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0").withDatabaseName("skyrush_test");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", mysql::getJdbcUrl);
        r.add("spring.datasource.username", mysql::getUsername);
        r.add("spring.datasource.password", mysql::getPassword);
    }

    @Autowired
    UserRepository userRepository;

    @Test
    void savesAndFindsUserByUsername() {
        User u = new User();
        u.setUsername("mayur");
        u.setEmail("mayur@example.com");
        u.setPasswordHash("hashed");
        u.setRole(Role.PLAYER);
        userRepository.save(u);

        assertThat(userRepository.findByUsername("mayur")).isPresent();
        assertThat(userRepository.existsByEmail("mayur@example.com")).isTrue();
        assertThat(userRepository.existsByUsername("nobody")).isFalse();
    }
}
