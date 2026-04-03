package com.organize.finance.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class User {

    @Id
    private Long id;
    private String nome;
    private String email;
    private String senha;
}
