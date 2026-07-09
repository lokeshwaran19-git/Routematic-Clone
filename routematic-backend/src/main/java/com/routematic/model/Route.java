package com.routematic.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "route_name", nullable = false, length = 100)
    private String routeName;

    @Column(name = "start_destination", nullable = false, length = 150)
    private String startDestination;

    @Column(name = "end_destination", nullable = false, length = 150)
    private String endDestination;

    @Column(columnDefinition = "TEXT")
    private String stops; // Comma separated stops

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getRouteName() {
		return routeName;
	}

	public void setRouteName(String routeName) {
		this.routeName = routeName;
	}

	public String getStartDestination() {
		return startDestination;
	}

	public void setStartDestination(String startDestination) {
		this.startDestination = startDestination;
	}

	public String getEndDestination() {
		return endDestination;
	}

	public void setEndDestination(String endDestination) {
		this.endDestination = endDestination;
	}

	public String getStops() {
		return stops;
	}

	public void setStops(String stops) {
		this.stops = stops;
	}
    
    
}
