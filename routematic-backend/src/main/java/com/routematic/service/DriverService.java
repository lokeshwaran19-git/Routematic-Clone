package com.routematic.service;

import com.routematic.exception.BadRequestException;
import com.routematic.exception.ResourceNotFoundException;
import com.routematic.model.Booking;
import com.routematic.model.Driver;
import com.routematic.model.Trip;
import com.routematic.model.User;
import com.routematic.repository.BookingRepository;
import com.routematic.repository.DriverRepository;
import com.routematic.repository.TripRepository;
import com.routematic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Driver getDriverByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return driverRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));
    }

    public List<Trip> getDriverTrips(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
        return tripRepository.findByDriver(driver);
    }

    public Trip updateTripStatus(Long tripId, String status) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        List<String> validStatuses = Arrays.asList("Scheduled", "Started", "Completed", "Cancelled");
        if (!validStatuses.contains(status)) {
            throw new BadRequestException("Invalid trip status. Allowed values: Scheduled, Started, Completed, Cancelled");
        }

        trip.setTripStatus(status);
        return tripRepository.save(trip);
    }

    public List<Booking> getAssignedEmployees(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));
        return bookingRepository.findByTrip(trip);
    }
}
