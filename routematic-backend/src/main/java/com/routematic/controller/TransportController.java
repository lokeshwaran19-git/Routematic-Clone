package com.routematic.controller;

import com.routematic.dto.TripCreationRequest;
import com.routematic.model.*;
import com.routematic.repository.BookingRepository;
import com.routematic.service.TransportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transport")
public class TransportController {

    @Autowired
    private TransportService transportService;

    @Autowired
    private BookingRepository bookingRepository;

    // Vehicle Management
    @PostMapping("/vehicles")
    public ResponseEntity<Vehicle> addVehicle(@RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(transportService.addVehicle(vehicle));
    }

    @GetMapping("/vehicles")
    public ResponseEntity<List<Vehicle>> getVehicles() {
        return ResponseEntity.ok(transportService.getVehicles());
    }

    @PutMapping("/vehicles/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicleDetails) {
        return ResponseEntity.ok(transportService.updateVehicle(id, vehicleDetails));
    }

    // Driver Management
    @PostMapping("/drivers")
    public ResponseEntity<Driver> addDriver(@RequestBody Driver driver) {
        return ResponseEntity.ok(transportService.addDriver(driver));
    }

    @GetMapping("/drivers")
    public ResponseEntity<List<Driver>> getDrivers() {
        return ResponseEntity.ok(transportService.getDrivers());
    }

    @PutMapping("/drivers/{id}")
    public ResponseEntity<Driver> updateDriver(@PathVariable Long id, @RequestBody Driver driverDetails) {
        return ResponseEntity.ok(transportService.updateDriver(id, driverDetails));
    }

    // Mapping Management
    @PostMapping("/mappings")
    public ResponseEntity<DriverVehicleMapping> createMapping(@RequestBody Map<String, Long> payload) {
        Long driverId = payload.get("driverId");
        Long vehicleId = payload.get("vehicleId");
        return ResponseEntity.ok(transportService.createMapping(driverId, vehicleId));
    }

    @GetMapping("/mappings")
    public ResponseEntity<List<DriverVehicleMapping>> getMappings() {
        return ResponseEntity.ok(transportService.getMappings());
    }

    // Trip Scheduling & Monitoring
    @PostMapping("/trips")
    public ResponseEntity<Trip> createTrip(@RequestBody TripCreationRequest request) {
        return ResponseEntity.ok(transportService.createTrip(request));
    }

    @PostMapping("/trips/{tripId}/assign-employee/{bookingId}")
    public ResponseEntity<Booking> assignEmployeeToTrip(@PathVariable Long tripId, @PathVariable Long bookingId) {
        return ResponseEntity.ok(transportService.assignEmployeeToTrip(tripId, bookingId));
    }

    @GetMapping("/trips")
    public ResponseEntity<List<Trip>> getAllTrips() {
        return ResponseEntity.ok(transportService.getAllTrips());
    }

    // Fetch all bookings for transport team trip assignment
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }
}
