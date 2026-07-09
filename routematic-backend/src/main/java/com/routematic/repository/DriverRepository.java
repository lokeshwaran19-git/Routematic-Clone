package com.routematic.repository;

import com.routematic.model.Driver;
import com.routematic.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByUsername(String username);
    Optional<Driver> findByUser(User user);
    List<Driver> findByApprovalStatus(String approvalStatus);
    long countByApprovalStatus(String approvalStatus);
}
