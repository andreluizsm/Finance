package com.organize.finance.controller;

import com.organize.finance.bases.baseController.baseController;
import com.organize.finance.domain.dto.ContaDto;
import com.organize.finance.service.ContaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/contas")
public class ContaController extends baseController<ContaDto> {

    private final ContaService contaService;

    public ContaController(ContaService contaService) {
        this.contaService = contaService;
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<ContaDto> findById(@PathVariable Long id) {
        return new ResponseEntity<>(contaService.findById(id), HttpStatus.OK);
    }

    @Override
    @GetMapping("/all")
    public List<ContaDto> findAll() {
        return contaService.findAll();
    }

    @Override
    @PostMapping()
    public ResponseEntity<ContaDto> create(@RequestBody ContaDto entity) {
        return new ResponseEntity<>(contaService.create(entity), HttpStatus.CREATED);
    }

    @Override
    @PutMapping()
    public ResponseEntity<ContaDto> update(@RequestBody ContaDto entity) throws Exception {
        return new ResponseEntity<>(contaService.update(entity), HttpStatus.OK);
    }

    @Override
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        contaService.delete(id);
    }
}
