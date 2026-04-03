package com.organize.finance.domain;

import java.time.LocalDate;

public class Transacao {

    private Long id;
    private Double valor;
    private String tipo;
    private LocalDate data;
    private String descricao;
    private Long categoriaId;
    private Long contaId;
}
