package com.routematic.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "trips")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_name", nullable = false, length = 100)
    private String tripName;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    @Column(name = "pickup_time", length = 20)
    private String pickupTime;

    @Column(name = "drop_time", length = 20)
    private String dropTime;

    @Column(name = "trip_date")
    private LocalDate tripDate;

    @Column(name = "trip_status", length = 20)
    private String tripStatus = "Scheduled"; // 'Scheduled', 'Started', 'Completed', 'Cancelled'

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTripName() {
		return tripName;
	}

	public void setTripName(String tripName) {
		this.tripName = tripName;
	}

	public Vehicle getVehicle() {
		return vehicle;
	}

	public void setVehicle(Vehicle vehicle) {
		this.vehicle = vehicle;
	}

	public Driver getDriver() {
		return driver;
	}

	public void setDriver(Driver driver) {
		this.driver = driver;
	}

	public Route getRoute() {
		return route;
	}

	public void setRoute(Route route) {
		this.route = route;
	}

	public String getPickupTime() {
		return pickupTime;
	}

	public void setPickupTime(String pickupTime) {
		this.pickupTime = pickupTime;
	}

	public String getDropTime() {
		return dropTime;
	}

	public void setDropTime(String dropTime) {
		this.dropTime = dropTime;
	}

	public LocalDate getTripDate() {
		return tripDate;
	}

	public void setTripDate(LocalDate tripDate) {
		this.tripDate = tripDate;
	}

	public String getTripStatus() {
		return tripStatus;
	}

	public void setTripStatus(String tripStatus) {
		this.tripStatus = tripStatus;
	}
    
    
}
