package com.routematic.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_number", unique = true, nullable = false, length = 50)
    private String vehicleNumber;

    @Column(name = "vehicle_type", nullable = false, length = 50)
    private String vehicleType;

    @Column(name = "vehicle_model", nullable = false, length = 100)
    private String vehicleModel;

    @Column(name = "seating_capacity", nullable = false)
    private Integer seatingCapacity;

    @Column(name = "fuel_type", nullable = false, length = 20)
    private String fuelType;

    @Column(name = "rc_book_number", unique = true, nullable = false, length = 100)
    private String rcBookNumber;

    @Column(name = "insurance_number", unique = true, nullable = false, length = 100)
    private String insuranceNumber;

    @Column(name = "pollution_certificate", unique = true, nullable = false, length = 100)
    private String pollutionCertificate;

    @Column(name = "vehicle_image", columnDefinition = "TEXT")
    private String vehicleImage; // Base64 or image URL

    @Column(name = "approval_status", length = 20)
    private String approvalStatus = "UNAPPROVED"; // 'UNAPPROVED', 'APPROVED', 'REJECTED'

    @Column(name = "vehicle_status", length = 20)
    private String vehicleStatus = "ACTIVE"; // 'ACTIVE', 'INACTIVE'

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate = LocalDateTime.now();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getVehicleNumber() {
		return vehicleNumber;
	}

	public void setVehicleNumber(String vehicleNumber) {
		this.vehicleNumber = vehicleNumber;
	}

	public String getVehicleType() {
		return vehicleType;
	}

	public void setVehicleType(String vehicleType) {
		this.vehicleType = vehicleType;
	}

	public String getVehicleModel() {
		return vehicleModel;
	}

	public void setVehicleModel(String vehicleModel) {
		this.vehicleModel = vehicleModel;
	}

	public Integer getSeatingCapacity() {
		return seatingCapacity;
	}

	public void setSeatingCapacity(Integer seatingCapacity) {
		this.seatingCapacity = seatingCapacity;
	}

	public String getFuelType() {
		return fuelType;
	}

	public void setFuelType(String fuelType) {
		this.fuelType = fuelType;
	}

	public String getRcBookNumber() {
		return rcBookNumber;
	}

	public void setRcBookNumber(String rcBookNumber) {
		this.rcBookNumber = rcBookNumber;
	}

	public String getInsuranceNumber() {
		return insuranceNumber;
	}

	public void setInsuranceNumber(String insuranceNumber) {
		this.insuranceNumber = insuranceNumber;
	}

	public String getPollutionCertificate() {
		return pollutionCertificate;
	}

	public void setPollutionCertificate(String pollutionCertificate) {
		this.pollutionCertificate = pollutionCertificate;
	}

	public String getVehicleImage() {
		return vehicleImage;
	}

	public void setVehicleImage(String vehicleImage) {
		this.vehicleImage = vehicleImage;
	}

	public String getApprovalStatus() {
		return approvalStatus;
	}

	public void setApprovalStatus(String approvalStatus) {
		this.approvalStatus = approvalStatus;
	}

	public String getVehicleStatus() {
		return vehicleStatus;
	}

	public void setVehicleStatus(String vehicleStatus) {
		this.vehicleStatus = vehicleStatus;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public LocalDateTime getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(LocalDateTime createdDate) {
		this.createdDate = createdDate;
	}
    
    
}
