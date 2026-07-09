package com.routematic.repository;

import com.routematic.model.Trip;
import com.routematic.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByDriver(Driver driver);
    List<Trip> findByTripStatus(String tripStatus);
    long countByTripStatus(String tripStatus);
}
