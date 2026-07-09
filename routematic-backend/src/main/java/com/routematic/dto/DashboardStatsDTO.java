package com.routematic.dto;

import lombok.Data;

@Data
public class DashboardStatsDTO {
    private long totalEmployees;
    private long totalDrivers;
    private long totalVehicles;
    private long approvedVehicles;
    private long unapprovedVehicles;
    private long approvedDrivers;
    private long pendingRequests; 
    private long activeTrips; 
	public long getTotalEmployees() {
		return totalEmployees;
	}
	public void setTotalEmployees(long totalEmployees) {
		this.totalEmployees = totalEmployees;
	}
	public long getTotalDrivers() {
		return totalDrivers;
	}
	public void setTotalDrivers(long totalDrivers) {
		this.totalDrivers = totalDrivers;
	}
	public long getTotalVehicles() {
		return totalVehicles;
	}
	public void setTotalVehicles(long totalVehicles) {
		this.totalVehicles = totalVehicles;
	}
	public long getApprovedVehicles() {
		return approvedVehicles;
	}
	public void setApprovedVehicles(long approvedVehicles) {
		this.approvedVehicles = approvedVehicles;
	}
	public long getUnapprovedVehicles() {
		return unapprovedVehicles;
	}
	public void setUnapprovedVehicles(long unapprovedVehicles) {
		this.unapprovedVehicles = unapprovedVehicles;
	}
	public long getApprovedDrivers() {
		return approvedDrivers;
	}
	public void setApprovedDrivers(long approvedDrivers) {
		this.approvedDrivers = approvedDrivers;
	}
	public long getPendingRequests() {
		return pendingRequests;
	}
	public void setPendingRequests(long pendingRequests) {
		this.pendingRequests = pendingRequests;
	}
	public long getActiveTrips() {
		return activeTrips;
	}
	public void setActiveTrips(long activeTrips) {
		this.activeTrips = activeTrips;
	}
	
    
    
}
