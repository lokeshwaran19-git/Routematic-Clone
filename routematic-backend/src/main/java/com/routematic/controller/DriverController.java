package com.routematic.controller;

import com.routematic.model.Booking;
import com.routematic.model.Driver;
import com.routematic.model.Trip;
import com.routematic.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/driver")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<Driver> getProfileByUserId(@PathVariable Long userId) {
        Driver driver = driverService.getDriverByUserId(userId);
        return ResponseEntity.ok(driver);
    }

    @GetMapping("/trips/{driverId}")
    public ResponseEntity<List<Trip>> getDriverTrips(@PathVariable Long driverId) {
        List<Trip> trips = driverService.getDriverTrips(driverId);
        return ResponseEntity.ok(trips);
    }

    @PutMapping("/trips/{tripId}/status")
    public ResponseEntity<Trip> updateTripStatus(@PathVariable Long tripId, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        Trip updatedTrip = driverService.updateTripStatus(tripId, status);
        return ResponseEntity.ok(updatedTrip);
    }

    @GetMapping("/trips/{tripId}/employees")
    public ResponseEntity<List<Booking>> getAssignedEmployees(@PathVariable Long tripId) {
        List<Booking> passengerList = driverService.getAssignedEmployees(tripId);
        return ResponseEntity.ok(passengerList);
    }
}
