package com.routematic.service;

import com.routematic.exception.BadRequestException;
import com.routematic.exception.ResourceNotFoundException;
import com.routematic.model.*;
import com.routematic.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TripRepository tripRepository;

    public Employee getEmployeeByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return employeeRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));
    }

    public Booking bookCab(Long employeeId, Booking bookingDetails) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        Booking booking = new Booking();
        booking.setEmployee(employee);
        booking.setBookingDate(LocalDate.now());
        booking.setBookingStatus("PENDING");
        booking.setPickupLocation(bookingDetails.getPickupLocation());
        booking.setDropLocation(bookingDetails.getDropLocation());

        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if ("CONFIRMED".equals(booking.getBookingStatus()) && booking.getTrip() != null) {
            String tripStatus = booking.getTrip().getTripStatus();
            if ("Started".equals(tripStatus) || "Completed".equals(tripStatus)) {
                throw new BadRequestException("Cannot cancel booking. Trip has already " + tripStatus.toLowerCase() + ".");
            }
        }

        booking.setBookingStatus("CANCELLED");
        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingHistory(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        return bookingRepository.findByEmployeeOrderByBookingDateDesc(employee);
    }

    public Optional<Booking> getAssignedTrip(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        
        List<Booking> bookings = bookingRepository.findByEmployeeOrderByBookingDateDesc(employee);
        // Find the latest booking that is CONFIRMED and has a trip assigned which is not Completed or Cancelled
        return bookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getBookingStatus()) && b.getTrip() != null)
                .filter(b -> {
                    String status = b.getTrip().getTripStatus();
                    return "Scheduled".equals(status) || "Started".equals(status);
                })
                .findFirst();
    }

    @Transactional
    public Employee updateProfile(Long employeeId, String name, String email, String phoneNumber, String address) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        employee.setPhoneNumber(phoneNumber);
        employee.setAddress(address);

        User user = employee.getUser();
        if (user != null) {
            user.setName(name);
            user.setEmail(email);
            userRepository.save(user);
        }

        return employeeRepository.save(employee);
    }

    public User changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getPassword().equals(oldPassword)) {
            throw new BadRequestException("Incorrect old password");
        }

        user.setPassword(newPassword);
        return userRepository.save(user);
    }
}
