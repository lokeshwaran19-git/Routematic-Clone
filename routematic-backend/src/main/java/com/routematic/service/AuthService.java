package com.routematic.service;

import com.routematic.dto.LoginRequest;
import com.routematic.dto.PasswordSetupRequest;
import com.routematic.exception.BadRequestException;
import com.routematic.exception.ResourceNotFoundException;
import com.routematic.model.User;
import com.routematic.repository.UserRepository;
import com.routematic.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public User login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + request.getUsername()));

        
        if ("PENDING".equals(user.getStatus())) {
            if (request.getPassword() == null || request.getPassword().isEmpty()) {
                return user; 
            } else {
                throw new BadRequestException("Account setup pending. Please log in with an empty password to set your password.");
            }
        }

        
        if (!user.getPassword().equals(request.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        user.setToken(token);

        return user;
    }

    public User setupPassword(PasswordSetupRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + request.getUsername()));

        if (!"PENDING".equals(user.getStatus())) {
            throw new BadRequestException("Password setup already completed for this user.");
        }

        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new BadRequestException("Password cannot be empty.");
        }

        user.setPassword(request.getPassword());
        user.setStatus("ACTIVE");
        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getRole());
        savedUser.setToken(token);

        return savedUser;
    }
}
