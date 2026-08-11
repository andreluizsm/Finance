package com.organize.finance.domain.dto;

import com.organize.finance.domain.User;

import java.time.LocalDate;

public record TransacaoDto(
        Long id,
        Double valor,
        String tipo,
        LocalDate data,
        String descricao,
        Long categoriaId,
        User usuario
) {}
