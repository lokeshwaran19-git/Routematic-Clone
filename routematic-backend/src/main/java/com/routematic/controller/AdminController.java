package com.routematic.controller;

import com.routematic.dto.DashboardStatsDTO;
import com.routematic.dto.UserCreationRequest;
import com.routematic.model.*;
import com.routematic.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // User Creation Flow
    @PostMapping("/create-user")
    public ResponseEntity<User> createUser(@RequestBody UserCreationRequest request) {
        User user = adminService.createUser(request);
        return ResponseEntity.ok(user);
    }

    // Employee Management CRUD
    @GetMapping("/employees")
    public ResponseEntity<Page<Employee>> getEmployees(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(adminService.searchEmployees(query, pageable));
    }

    @PutMapping("/employees/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails) {
        Employee updatedEmployee = adminService.updateEmployee(id, employeeDetails);
        return ResponseEntity.ok(updatedEmployee);
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        adminService.deleteEmployee(id);
        return ResponseEntity.ok().build();
    }

    // Vehicle Approvals
    @GetMapping("/pending-vehicles")
    public ResponseEntity<List<Vehicle>> getPendingVehicles() {
        return ResponseEntity.ok(adminService.getPendingVehicles());
    }

    @PutMapping("/vehicles/{id}/approve")
    public ResponseEntity<Vehicle> approveVehicle(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveVehicle(id));
    }

    @PutMapping("/vehicles/{id}/reject")
    public ResponseEntity<Vehicle> rejectVehicle(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectVehicle(id));
    }

    // Driver Approvals
    @GetMapping("/pending-drivers")
    public ResponseEntity<List<Driver>> getPendingDrivers() {
        return ResponseEntity.ok(adminService.getPendingDrivers());
    }

    @PutMapping("/drivers/{id}/approve")
    public ResponseEntity<Driver> approveDriver(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveDriver(id));
    }

    @PutMapping("/drivers/{id}/reject")
    public ResponseEntity<Driver> rejectDriver(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectDriver(id));
    }

    // Driver-Vehicle Mapping Approvals
    @GetMapping("/pending-mappings")
    public ResponseEntity<List<DriverVehicleMapping>> getPendingMappings() {
        return ResponseEntity.ok(adminService.getPendingMappings());
    }

    @PutMapping("/mappings/{id}/approve")
    public ResponseEntity<DriverVehicleMapping> approveMapping(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveMapping(id));
    }

    @PutMapping("/mappings/{id}/reject")
    public ResponseEntity<DriverVehicleMapping> rejectMapping(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectMapping(id));
    }

    // Route Management
    @PostMapping("/routes")
    public ResponseEntity<Route> addRoute(@RequestBody Route route) {
        return ResponseEntity.ok(adminService.addRoute(route));
    }

    @GetMapping("/routes")
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(adminService.getAllRoutes());
    }

    @DeleteMapping("/routes/{id}")
    public ResponseEntity<?> deleteRoute(@PathVariable Long id) {
        adminService.deleteRoute(id);
        return ResponseEntity.ok().build();
    }

    // Dashboard Statistics
    @GetMapping("/dashboard-stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
}
