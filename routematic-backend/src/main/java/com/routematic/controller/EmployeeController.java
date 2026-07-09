package com.routematic.controller;

import com.routematic.model.Booking;
import com.routematic.model.Employee;
import com.routematic.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<Employee> getProfileByUserId(@PathVariable Long userId) {
        Employee employee = employeeService.getEmployeeByUserId(userId);
        return ResponseEntity.ok(employee);
    }

    @PostMapping("/bookings/{employeeId}")
    public ResponseEntity<Booking> bookCab(@PathVariable Long employeeId, @RequestBody Booking bookingDetails) {
        Booking booking = employeeService.bookCab(employeeId, bookingDetails);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/bookings/history/{employeeId}")
    public ResponseEntity<List<Booking>> getBookingHistory(@PathVariable Long employeeId) {
        List<Booking> history = employeeService.getBookingHistory(employeeId);
        return ResponseEntity.ok(history);
    }

    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id) {
        Booking cancelledBooking = employeeService.cancelBooking(id);
        return ResponseEntity.ok(cancelledBooking);
    }

    @GetMapping("/assigned-trip/{employeeId}")
    public ResponseEntity<?> getAssignedTrip(@PathVariable Long employeeId) {
        Optional<Booking> booking = employeeService.getAssignedTrip(employeeId);
        if (booking.isPresent()) {
            return ResponseEntity.ok(booking.get());
        }
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/profile/{employeeId}")
    public ResponseEntity<Employee> updateProfile(@PathVariable Long employeeId, @RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String phoneNumber = payload.get("phoneNumber");
        String address = payload.get("address");

        Employee updatedEmployee = employeeService.updateProfile(employeeId, name, email, phoneNumber, address);
        return ResponseEntity.ok(updatedEmployee);
    }
}
