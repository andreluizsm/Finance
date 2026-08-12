package com.organize.finance.domain.dto;

public record ContaDto(
        Long id,
        String nome,
        Double saldoInicial,
        Double saldoAtual,
        Long userId
    ) {
}
