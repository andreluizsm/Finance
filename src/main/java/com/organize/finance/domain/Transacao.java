package com.organize.finance.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity
public class Transacao {

    @Id
    private Long id;
    private Double valor;
    private String tipo;
    private LocalDate data;
    private String descricao;
    private Long categoriaId;
    private Long contaId;
}
