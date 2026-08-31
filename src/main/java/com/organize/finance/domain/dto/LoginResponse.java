package com.organize.finance.domain.dto;

public record LoginResponse(
        String token,
        long expiresIn
) {
}
