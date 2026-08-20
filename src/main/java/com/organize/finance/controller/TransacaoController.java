package com.organize.finance.controller;

import com.organize.finance.bases.baseController.baseController;
import com.organize.finance.domain.dto.TransacaoDto;
import com.organize.finance.service.TransacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/transacoes")
public class TransacaoController extends baseController<TransacaoDto> {

    private final TransacaoService transacaoService;

    public TransacaoController(TransacaoService transacaoService) {
        this.transacaoService = transacaoService;
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<TransacaoDto> findById(@PathVariable Long id) {
        return new ResponseEntity<>(transacaoService.findById(id), HttpStatus.OK);
    }

    @Override
    @GetMapping("/all")
    public List<TransacaoDto> findAll() {
        return transacaoService.findAll();
    }

    @Override
    @PostMapping()
    public ResponseEntity<TransacaoDto> create(@RequestBody TransacaoDto entity) {
        return new ResponseEntity<>(transacaoService.create(entity), HttpStatus.CREATED);
    }

    @Override
    @PutMapping()
    public ResponseEntity<TransacaoDto> update(@RequestBody TransacaoDto entity) throws Exception {
        return new ResponseEntity<>(transacaoService.update(entity), HttpStatus.OK);
    }

    @Override
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        transacaoService.delete(id);
    }
}
