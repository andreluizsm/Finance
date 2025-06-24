package com.finance.repository;

import com.finance.entity.Conta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ContaRepository extends JpaRepository<Conta, Long> {
    List<Conta> findByUsuarioIdOrderByNome(Long usuarioId);
    
    @Query("SELECT SUM(c.saldo) FROM Conta c WHERE c.usuario.id = ?1")
    BigDecimal findTotalSaldoByUsuarioId(Long usuarioId);
}
