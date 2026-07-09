package com.routematic.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "driver_vehicle_mapping")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverVehicleMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(name = "mapping_status", length = 20)
    private String mappingStatus = "ACTIVE"; 

    @Column(name = "assigned_date")
    private LocalDateTime assignedDate = LocalDateTime.now();

    @Column(name = "approval_status", length = 20)
    private String approvalStatus = "UNAPPROVED"; 

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Driver getDriver() {
		return driver;
	}

	public void setDriver(Driver driver) {
		this.driver = driver;
	}

	public Vehicle getVehicle() {
		return vehicle;
	}

	public void setVehicle(Vehicle vehicle) {
		this.vehicle = vehicle;
	}

	public String getMappingStatus() {
		return mappingStatus;
	}

	public void setMappingStatus(String mappingStatus) {
		this.mappingStatus = mappingStatus;
	}

	public LocalDateTime getAssignedDate() {
		return assignedDate;
	}

	public void setAssignedDate(LocalDateTime assignedDate) {
		this.assignedDate = assignedDate;
	}

	public String getApprovalStatus() {
		return approvalStatus;
	}

	public void setApprovalStatus(String approvalStatus) {
		this.approvalStatus = approvalStatus;
	}
    
    
}
