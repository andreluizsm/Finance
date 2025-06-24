package com.finance.repository;

import com.finance.entity.Transacao;
import com.finance.entity.TipoTransacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> findByUsuarioIdOrderByDataDescCreatedAtDesc(Long usuarioId);
    
    List<Transacao> findByUsuarioIdAndDataBetweenOrderByDataDesc(Long usuarioId, LocalDate inicio, LocalDate fim);
    
    List<Transacao> findByUsuarioIdAndTipoOrderByDataDesc(Long usuarioId, TipoTransacao tipo);
    
    List<Transacao> findByUsuarioIdAndCategoriaIdOrderByDataDesc(Long usuarioId, Long categoriaId);
    
    @Query("SELECT SUM(t.valor) FROM Transacao t WHERE t.usuario.id = :usuarioId AND t.tipo = :tipo AND t.data BETWEEN :inicio AND :fim")
    BigDecimal findTotalByUsuarioIdAndTipoAndDataBetween(
        @Param("usuarioId") Long usuarioId, 
        @Param("tipo") TipoTransacao tipo, 
        @Param("inicio") LocalDate inicio, 
        @Param("fim") LocalDate fim
    );
    
    @Query("SELECT t.categoria.id, t.categoria.nome, t.categoria.cor, SUM(ABS(t.valor)) as total " +
           "FROM Transacao t WHERE t.usuario.id = :usuarioId AND t.tipo = 'SAIDA' " +
           "GROUP BY t.categoria.id, t.categoria.nome, t.categoria.cor " +
           "ORDER BY total DESC")
    List<Object[]> findGastosPorCategoria(@Param("usuarioId") Long usuarioId);
}
