package com.routematic.repository;

import com.routematic.model.Employee;
import com.routematic.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByUser(User user);
    Optional<Employee> findByEmployeeId(String employeeId);

    @Query("SELECT e FROM Employee e WHERE LOWER(e.user.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.employeeId) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.department) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Employee> searchEmployees(@Param("query") String query, Pageable pageable);
}
