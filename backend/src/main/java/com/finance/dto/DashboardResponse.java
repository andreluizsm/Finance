package com.finance.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardResponse {
    private BigDecimal saldoTotal;
    private BigDecimal receitasMes;
    private BigDecimal gastosMes;
    private Integer metasAtivas;
    private List<Object[]> gastosPorCategoria;

    public BigDecimal getSaldoTotal() { return saldoTotal; }
    public void setSaldoTotal(BigDecimal saldoTotal) { this.saldoTotal = saldoTotal; }
    
    public BigDecimal getReceitasMes() { return receitasMes; }
    public void setReceitasMes(BigDecimal receitasMes) { this.receitasMes = receitasMes; }
    
    public BigDecimal getGastosMes() { return gastosMes; }
    public void setGastosMes(BigDecimal gastosMes) { this.gastosMes = gastosMes; }
    
    public Integer getMetasAtivas() { return metasAtivas; }
    public void setMetasAtivas(Integer metasAtivas) { this.metasAtivas = metasAtivas; }
    
    public List<Object[]> getGastosPorCategoria() { return gastosPorCategoria; }
    public void setGastosPorCategoria(List<Object[]> gastosPorCategoria) { this.gastosPorCategoria = gastosPorCategoria; }
}
