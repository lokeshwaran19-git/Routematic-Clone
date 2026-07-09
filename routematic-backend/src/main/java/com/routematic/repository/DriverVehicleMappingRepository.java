package com.routematic.repository;

import com.routematic.model.DriverVehicleMapping;
import com.routematic.model.Driver;
import com.routematic.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface DriverVehicleMappingRepository extends JpaRepository<DriverVehicleMapping, Long> {
    Optional<DriverVehicleMapping> findByDriverAndMappingStatus(Driver driver, String mappingStatus);
    Optional<DriverVehicleMapping> findByVehicleAndMappingStatus(Vehicle vehicle, String mappingStatus);
    List<DriverVehicleMapping> findByApprovalStatus(String approvalStatus);
}
