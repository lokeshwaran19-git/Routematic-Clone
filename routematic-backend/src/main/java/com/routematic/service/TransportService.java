package com.routematic.service;

import com.routematic.dto.TripCreationRequest;
import com.routematic.exception.BadRequestException;
import com.routematic.exception.ResourceNotFoundException;
import com.routematic.model.*;
import com.routematic.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TransportService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private DriverVehicleMappingRepository mappingRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // Vehicle Management
    public Vehicle addVehicle(Vehicle vehicle) {
        vehicle.setApprovalStatus("UNAPPROVED");
        vehicle.setVehicleStatus("INACTIVE"); // Default inactive till approved
        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        vehicle.setVehicleNumber(vehicleDetails.getVehicleNumber());
        vehicle.setVehicleType(vehicleDetails.getVehicleType());
        vehicle.setVehicleModel(vehicleDetails.getVehicleModel());
        vehicle.setSeatingCapacity(vehicleDetails.getSeatingCapacity());
        vehicle.setFuelType(vehicleDetails.getFuelType());
        vehicle.setRcBookNumber(vehicleDetails.getRcBookNumber());
        vehicle.setInsuranceNumber(vehicleDetails.getInsuranceNumber());
        vehicle.setPollutionCertificate(vehicleDetails.getPollutionCertificate());
        if (vehicleDetails.getVehicleImage() != null) {
            vehicle.setVehicleImage(vehicleDetails.getVehicleImage());
        }
        
        // When edited, reset approval status to UNAPPROVED for re-verification
        vehicle.setApprovalStatus("UNAPPROVED");
        vehicle.setVehicleStatus("INACTIVE");

        return vehicleRepository.save(vehicle);
    }

    // Driver Management
    public Driver addDriver(Driver driver) {
        driver.setApprovalStatus("UNAPPROVED");
        driver.setDriverStatus("INACTIVE"); // Default inactive till approved
        return driverRepository.save(driver);
    }

    public List<Driver> getDrivers() {
        return driverRepository.findAll();
    }

    public Driver updateDriver(Long id, Driver driverDetails) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));

        driver.setDriverName(driverDetails.getDriverName());
        driver.setPhoneNumber(driverDetails.getPhoneNumber());
        driver.setLicenseNumber(driverDetails.getLicenseNumber());
        driver.setAddress(driverDetails.getAddress());
        driver.setExperience(driverDetails.getExperience());
        if (driverDetails.getDriverImage() != null) {
            driver.setDriverImage(driverDetails.getDriverImage());
        }

        // Reset status for re-verification
        driver.setApprovalStatus("UNAPPROVED");
        driver.setDriverStatus("INACTIVE");

        return driverRepository.save(driver);
    }

    
    @Transactional
    public DriverVehicleMapping createMapping(Long driverId, Long vehicleId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + vehicleId));

        
        Optional<DriverVehicleMapping> activeDriverMapping = mappingRepository.findByDriverAndMappingStatus(driver, "ACTIVE");
        if (activeDriverMapping.isPresent()) {
            throw new BadRequestException("Driver Ravi is already assigned to another active vehicle.");
        }

        Optional<DriverVehicleMapping> activeVehicleMapping = mappingRepository.findByVehicleAndMappingStatus(vehicle, "ACTIVE");
        if (activeVehicleMapping.isPresent()) {
            throw new BadRequestException("Vehicle is already assigned to another active driver.");
        }

        DriverVehicleMapping mapping = new DriverVehicleMapping();
        mapping.setDriver(driver);
        mapping.setVehicle(vehicle);
        mapping.setMappingStatus("ACTIVE");
        mapping.setAssignedDate(LocalDateTime.now());
        mapping.setApprovalStatus("UNAPPROVED"); // Must be approved by admin

        return mappingRepository.save(mapping);
    }

    public List<DriverVehicleMapping> getMappings() {
        return mappingRepository.findAll();
    }

    @Transactional
    public Trip createTrip(TripCreationRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + request.getVehicleId()));
        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + request.getDriverId()));
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + request.getRouteId()));

        
        if (!"APPROVED".equals(vehicle.getApprovalStatus())) {
            throw new BadRequestException("Vehicle " + vehicle.getVehicleNumber() + " is not APPROVED by Admin.");
        }
        if (!"APPROVED".equals(driver.getApprovalStatus())) {
            throw new BadRequestException("Driver " + driver.getDriverName() + " is not APPROVED by Admin.");
        }
        Optional<DriverVehicleMapping> mappingOpt = mappingRepository.findByDriverAndMappingStatus(driver, "ACTIVE");
        if (mappingOpt.isEmpty()) {
            throw new BadRequestException("No active mapping found for driver " + driver.getDriverName());
        }
        DriverVehicleMapping mapping = mappingOpt.get();
        if (!"APPROVED".equals(mapping.getApprovalStatus())) {
            throw new BadRequestException("Driver-Vehicle mapping is not APPROVED by Admin.");
        }
        if (!mapping.getVehicle().getId().equals(vehicle.getId())) {
            throw new BadRequestException("The selected driver is not mapped to the selected vehicle.");
        }

        Trip trip = new Trip();
        trip.setTripName(request.getTripName());
        trip.setVehicle(vehicle);
        trip.setDriver(driver);
        trip.setRoute(route);
        trip.setPickupTime(request.getPickupTime());
        trip.setDropTime(request.getDropTime());
        trip.setTripDate(request.getTripDate());
        trip.setTripStatus("Scheduled");

        return tripRepository.save(trip);
    }

    @Transactional
    public Booking assignEmployeeToTrip(Long tripId, Long bookingId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        booking.setTrip(trip);
        booking.setBookingStatus("CONFIRMED");
        return bookingRepository.save(booking);
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }
}
