package com.finance.dto;

import com.finance.entity.TipoTransacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TransacaoRequest {
    
    @NotNull(message = "Data é obrigatória")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate data;
    
    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal valor;
    
    private String descricao;
    
    @NotNull(message = "Tipo é obrigatório")
    private TipoTransacao tipo;
    
    private CategoriaRef categoria;
    
    @NotNull(message = "Conta é obrigatória")
    private ContaRef conta;
    
    private ContaRef contaDestino; // Para transferências

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    
    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public TipoTransacao getTipo() { return tipo; }
    public void setTipo(TipoTransacao tipo) { this.tipo = tipo; }
    
    public CategoriaRef getCategoria() { return categoria; }
    public void setCategoria(CategoriaRef categoria) { this.categoria = categoria; }
    
    public ContaRef getConta() { return conta; }
    public void setConta(ContaRef conta) { this.conta = conta; }
    
    public ContaRef getContaDestino() { return contaDestino; }
    public void setContaDestino(ContaRef contaDestino) { this.contaDestino = contaDestino; }
    
    // Inner classes for references
    public static class CategoriaRef {
        private Long id;
        
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
    }
    
    public static class ContaRef {
        private Long id;
        
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
    }
}
