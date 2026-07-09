package com.routematic.repository;

import com.routematic.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByRole(String role);
    long countByRole(String role);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
