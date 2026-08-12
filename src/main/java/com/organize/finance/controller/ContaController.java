package com.organize.finance.controller;

import com.organize.finance.bases.baseController.baseController;
import com.organize.finance.domain.dto.ContaDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("api/contas")
public class ContaController extends baseController<ContaDto> {
    @Override
    public ResponseEntity<ContaDto> findById(Long id) {
        return null;
    }

    @Override
    public List<ContaDto> findAll() {
        return List.of();
    }

    @Override
    public ResponseEntity<ContaDto> create(ContaDto entity) {
        return null;
    }

    @Override
    public ResponseEntity<ContaDto> update(ContaDto entity) throws Exception {
        return null;
    }

    @Override
    public void delete(Long id) {

    }
}
