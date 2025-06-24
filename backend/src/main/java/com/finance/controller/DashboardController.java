package com.finance.controller;

import com.finance.dto.DashboardResponse;
import com.finance.entity.TipoTransacao;
import com.finance.service.ContaService;
import com.finance.service.MetaService;
import com.finance.service.TransacaoService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    
    @Autowired
    private ContaService contaService;
    
    @Autowired
    private TransacaoService transacaoService;
    
    @Autowired
    private MetaService metaService;
    
    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            
            // Calcular dados do dashboard
            BigDecimal saldoTotal = contaService.calcularSaldoTotal(usuarioId);
            
            LocalDate inicioMes = LocalDate.now().withDayOfMonth(1);
            LocalDate fimMes = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
            
            BigDecimal receitasMes = transacaoService.calcularTotalPorTipoEPeriodo(
                usuarioId, TipoTransacao.ENTRADA, inicioMes, fimMes);
            
            BigDecimal gastosMes = transacaoService.calcularTotalPorTipoEPeriodo(
                usuarioId, TipoTransacao.SAIDA, inicioMes, fimMes);
            
            Integer metasAtivas = metaService.listarAtivasPorUsuario(usuarioId).size();
            
            List<Object[]> gastosPorCategoria = transacaoService.obterGastosPorCategoria(usuarioId);
            
            DashboardResponse response = new DashboardResponse();
            response.setSaldoTotal(saldoTotal);
            response.setReceitasMes(receitasMes);
            response.setGastosMes(gastosMes.abs()); // Valor absoluto para exibição
            response.setMetasAtivas(metasAtivas);
            response.setGastosPorCategoria(gastosPorCategoria);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
