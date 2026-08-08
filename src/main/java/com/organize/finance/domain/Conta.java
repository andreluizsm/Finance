package com.organize.finance.domain;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "conta")
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String nome;
    private Double saldoInicial;
    private Double saldoAtual;
    private Long userId;

}
