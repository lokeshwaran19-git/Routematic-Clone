package com.routematic.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TripCreationRequest {
    private String tripName;
    private Long vehicleId;
    private Long driverId;
    private Long routeId;
    private String pickupTime;
    private String dropTime;
    private LocalDate tripDate;
	public String getTripName() {
		return tripName;
	}
	public void setTripName(String tripName) {
		this.tripName = tripName;
	}
	public Long getVehicleId() {
		return vehicleId;
	}
	public void setVehicleId(Long vehicleId) {
		this.vehicleId = vehicleId;
	}
	public Long getDriverId() {
		return driverId;
	}
	public void setDriverId(Long driverId) {
		this.driverId = driverId;
	}
	public Long getRouteId() {
		return routeId;
	}
	public void setRouteId(Long routeId) {
		this.routeId = routeId;
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
    
    
}
