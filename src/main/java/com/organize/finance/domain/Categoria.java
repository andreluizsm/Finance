package com.organize.finance.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Categoria {

    @Id
    private Long id;
    private String nome;
    private String tipo;
    private Long userId;

}
