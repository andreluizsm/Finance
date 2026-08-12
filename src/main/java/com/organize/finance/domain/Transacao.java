package com.organize.finance.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "transacoes")
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Double valor;
    private String tipo;
    private LocalDate data;
    private String descricao;
    private Long categoriaId;

    @ManyToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private User usuario;
}
