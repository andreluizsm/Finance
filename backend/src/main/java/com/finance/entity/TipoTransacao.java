package com.finance.entity;

public enum TipoTransacao {
    ENTRADA("Entrada"),
    SAIDA("Saída"),
    TRANSFERENCIA("Transferência");
    
    private final String descricao;
    
    TipoTransacao(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
}
