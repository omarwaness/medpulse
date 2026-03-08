package com.backend.repository;

import com.backend.model.Patient;
import jdk.jfr.Registered;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Registered
public interface PatientRepository extends JpaRepository<Patient, Long> {
}
