package com.finance.repository;

import com.finance.entity.Meta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetaRepository extends JpaRepository<Meta, Long> {
    List<Meta> findByUsuarioIdOrderByDataFimAsc(Long usuarioId);
    List<Meta> findByUsuarioIdAndAtivaOrderByDataFimAsc(Long usuarioId, Boolean ativa);
}
