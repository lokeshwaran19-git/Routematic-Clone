package com.routematic.repository;

import com.routematic.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);
    List<Vehicle> findByApprovalStatus(String approvalStatus);
    long countByApprovalStatus(String approvalStatus);
}
