package com.routematic.service;

import com.routematic.dto.DashboardStatsDTO;
import com.routematic.dto.UserCreationRequest;
import com.routematic.exception.BadRequestException;
import com.routematic.exception.ResourceNotFoundException;
import com.routematic.model.*;
import com.routematic.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private TransportTeamRepository transportTeamRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverVehicleMappingRepository mappingRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private TripRepository tripRepository;

    @Transactional
    public User createUser(UserCreationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Create User
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setRole(request.getRole());
        user.setPassword(""); // empty password initially
        user.setStatus("PENDING");
        user = userRepository.save(user);

        // Create Profile based on role
        if ("EMPLOYEE".equalsIgnoreCase(request.getRole())) {
            Employee employee = new Employee();
            employee.setUser(user);
            employee.setEmployeeId(request.getEmployeeId());
            employee.setDepartment(request.getDepartment());
            employee.setPhoneNumber(request.getPhoneNumber());
            employee.setAddress(request.getAddress());
            employeeRepository.save(employee);
        } else if ("DRIVER".equalsIgnoreCase(request.getRole())) {
            Driver driver = new Driver();
            driver.setUser(user);
            driver.setDriverName(request.getName());
            driver.setPhoneNumber(request.getPhoneNumber());
            driver.setLicenseNumber(request.getLicenseNumber());
            driver.setAddress(request.getAddress());
            driver.setExperience(request.getExperience());
            driver.setDriverImage(request.getDriverImage());
            driver.setUsername(request.getUsername());
            driver.setApprovalStatus("UNAPPROVED");
            driver.setDriverStatus("ACTIVE");
            driverRepository.save(driver);
        } else if ("TRANSPORT_TEAM".equalsIgnoreCase(request.getRole())) {
            TransportTeam transportTeam = new TransportTeam();
            transportTeam.setUser(user);
            transportTeam.setEmployeeId(request.getEmployeeId());
            transportTeam.setDepartment(request.getDepartment());
            transportTeam.setPhoneNumber(request.getPhoneNumber());
            transportTeamRepository.save(transportTeam);
        } else {
            throw new BadRequestException("Invalid role specified");
        }

        return user;
    }

    public Page<Employee> searchEmployees(String query, Pageable pageable) {
        return employeeRepository.searchEmployees(query, pageable);
    }

    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        employee.setEmployeeId(employeeDetails.getEmployeeId());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setPhoneNumber(employeeDetails.getPhoneNumber());
        employee.setAddress(employeeDetails.getAddress());

        // Update User info too
        User user = employee.getUser();
        if (user != null) {
            user.setName(employeeDetails.getUser().getName());
            user.setEmail(employeeDetails.getUser().getEmail());
            userRepository.save(user);
        }

        return employeeRepository.save(employee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        employeeRepository.delete(employee);
    }

    // Vehicle Approvals
    public List<Vehicle> getPendingVehicles() {
        return vehicleRepository.findByApprovalStatus("UNAPPROVED");
    }

    public Vehicle approveVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        vehicle.setApprovalStatus("APPROVED");
        vehicle.setVehicleStatus("ACTIVE");
        return vehicleRepository.save(vehicle);
    }

    public Vehicle rejectVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        vehicle.setApprovalStatus("REJECTED");
        vehicle.setVehicleStatus("INACTIVE");
        return vehicleRepository.save(vehicle);
    }

    // Driver Approvals
    public List<Driver> getPendingDrivers() {
        return driverRepository.findByApprovalStatus("UNAPPROVED");
    }

    public Driver approveDriver(Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));
        driver.setApprovalStatus("APPROVED");
        driver.setDriverStatus("ACTIVE");
        return driverRepository.save(driver);
    }

    public Driver rejectDriver(Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));
        driver.setApprovalStatus("REJECTED");
        driver.setDriverStatus("INACTIVE");
        return driverRepository.save(driver);
    }

    // Mapping Approvals
    public List<DriverVehicleMapping> getPendingMappings() {
        return mappingRepository.findByApprovalStatus("UNAPPROVED");
    }

    public DriverVehicleMapping approveMapping(Long id) {
        DriverVehicleMapping mapping = mappingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mapping not found with id: " + id));
        mapping.setApprovalStatus("APPROVED");
        return mappingRepository.save(mapping);
    }

    public DriverVehicleMapping rejectMapping(Long id) {
        DriverVehicleMapping mapping = mappingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mapping not found with id: " + id));
        mapping.setApprovalStatus("REJECTED");
        return mappingRepository.save(mapping);
    }

    // Route Management
    public Route addRoute(Route route) {
        return routeRepository.save(route);
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public void deleteRoute(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));
        routeRepository.delete(route);
    }

    // Dashboard Stats
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO dto = new DashboardStatsDTO();
        dto.setTotalEmployees(employeeRepository.count());
        dto.setTotalDrivers(driverRepository.count());
        dto.setTotalVehicles(vehicleRepository.count());
        dto.setApprovedVehicles(vehicleRepository.countByApprovalStatus("APPROVED"));
        dto.setUnapprovedVehicles(vehicleRepository.countByApprovalStatus("UNAPPROVED"));
        dto.setApprovedDrivers(driverRepository.countByApprovalStatus("APPROVED"));

        long pendingVehicles = vehicleRepository.countByApprovalStatus("UNAPPROVED");
        long pendingDrivers = driverRepository.countByApprovalStatus("UNAPPROVED");
        long pendingMappings = mappingRepository.findByApprovalStatus("UNAPPROVED").size();
        dto.setPendingRequests(pendingVehicles + pendingDrivers + pendingMappings);

        dto.setActiveTrips(tripRepository.countByTripStatus("Started"));
        return dto;
    }
}
