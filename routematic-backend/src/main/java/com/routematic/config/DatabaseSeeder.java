package com.routematic.config;

import com.routematic.model.User;
import com.routematic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed default Admin if no admin exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setUsername("admin");
            admin.setPassword("admin"); // simple plain text password
            admin.setEmail("admin@routematic.com");
            admin.setRole("ADMIN");
            admin.setStatus("ACTIVE");
            userRepository.save(admin);
            System.out.println("Default Admin account seeded: admin / admin");
        }
    }
}
