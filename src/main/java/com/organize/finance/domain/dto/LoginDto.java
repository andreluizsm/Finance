package com.organize.finance.domain.dto;

public record LoginDto(
        String nome,
        String email,
        String senha
) {
}
