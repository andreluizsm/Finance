package com.finance.entity;

public enum TipoConta {
    CORRENTE("Conta Corrente"),
    POUPANCA("Poupança"),
    INVESTIMENTO("Investimento"),
    CARTEIRA("Carteira");
    
    private final String descricao;
    
    TipoConta(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
}
