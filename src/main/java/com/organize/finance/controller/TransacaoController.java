package com.organize.finance.controller;

import com.organize.finance.bases.baseController.baseController;
import com.organize.finance.domain.dto.TransacaoDto;
import com.organize.finance.service.TransacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("api/transacoes")
public class TransacaoController extends baseController<TransacaoDto> {

    private final TransacaoService transacaoService;

    public TransacaoController(TransacaoService transacaoService) {
        this.transacaoService = transacaoService;
    }

    @Override
    public ResponseEntity<TransacaoDto> findById(Long id) {
        return new ResponseEntity<>(transacaoService.findById(id), HttpStatus.OK);
    }

    @Override
    public List<TransacaoDto> findAll() {
        return List.of();
    }

    @Override
    public ResponseEntity<TransacaoDto> create(TransacaoDto entity) {
        return null;
    }

    @Override
    public ResponseEntity<TransacaoDto> update(TransacaoDto entity) throws Exception {
        return null;
    }

    @Override
    public void delete(Long id) {

    }
}
