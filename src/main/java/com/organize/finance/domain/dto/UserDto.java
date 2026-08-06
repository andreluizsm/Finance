package com.organize.finance.domain.dto;

public record UserDto(
        Long id,
        String nome,
        String email,
        String senha
){}
