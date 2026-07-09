package com.routematic.repository;

import com.routematic.model.Booking;
import com.routematic.model.Employee;
import com.routematic.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByEmployeeOrderByBookingDateDesc(Employee employee);
    List<Booking> findByTrip(Trip trip);
}
