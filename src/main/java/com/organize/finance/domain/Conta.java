package com.organize.finance.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Conta {

    @Id
    private Long id;
    private String nome;
    private Double saldoInicial;
    private Double saldoAtual;
    private Long userId;

}
