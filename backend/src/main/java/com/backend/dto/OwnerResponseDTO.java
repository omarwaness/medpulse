package com.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OwnerResponseDTO {
    private Long ownerId;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String address;
}
