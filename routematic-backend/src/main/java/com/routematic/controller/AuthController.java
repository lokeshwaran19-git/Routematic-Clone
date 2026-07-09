package com.routematic.controller;

import com.routematic.dto.LoginRequest;
import com.routematic.dto.PasswordSetupRequest;
import com.routematic.model.User;
import com.routematic.service.AuthService;
import com.routematic.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request) {
        User user = authService.login(request);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/setup-password")
    public ResponseEntity<User> setupPassword(@RequestBody PasswordSetupRequest request) {
        User user = authService.setupPassword(request);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> payload) {
        Long userId = Long.parseLong(payload.get("userId"));
        String oldPassword = payload.get("oldPassword");
        String newPassword = payload.get("newPassword");

        User user = employeeService.changePassword(userId, oldPassword, newPassword);
        return ResponseEntity.ok(user);
    }
}
