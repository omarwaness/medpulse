package com.backend.dto.mapper;

import com.backend.dto.OwnerRequestDTO;
import com.backend.dto.OwnerResponseDTO;
import com.backend.model.Owner;

public class OwnerMapper {
    public static Owner toEntity(OwnerRequestDTO dto) {
        return Owner.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .address(dto.getAddress())
                .build();
    }

    public static OwnerResponseDTO toResponseDTO(Owner owner) {
        return OwnerResponseDTO.builder()
                .ownerId(owner.getOwnerId())
                .firstName(owner.getFirstName())
                .lastName(owner.getLastName())
                .phone(owner.getPhone())
                .email(owner.getEmail())
                .address(owner.getAddress())
                .build();
    }
}
