package com.routematic.repository;

import com.routematic.model.TransportTeam;
import com.routematic.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TransportTeamRepository extends JpaRepository<TransportTeam, Long> {
    Optional<TransportTeam> findByUser(User user);
    Optional<TransportTeam> findByEmployeeId(String employeeId);
}
