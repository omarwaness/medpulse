package com.backend.repository;

import com.backend.model.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {
    boolean existsByEmail(String email);
    boolean existsByEmailAndOwnerIdNot(String email, Long ownerId);
    boolean existsByPhone(String phone);
    boolean existsByPhoneAndOwnerIdNot(String phone, Long ownerId);
    Owner findByEmail(String email);
    Owner findByPhone(String phone);
}
