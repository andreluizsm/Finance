package com.finance.controller;

import com.finance.entity.Conta;
import com.finance.service.ContaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contas")
@CrossOrigin(origins = "*")
public class ContaController {
    
    @Autowired
    private ContaService contaService;
    
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody Conta conta, HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            Conta novaConta = contaService.criarConta(conta, usuarioId);
            return ResponseEntity.ok(novaConta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar conta: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Conta>> listar(HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            List<Conta> contas = contaService.listarPorUsuario(usuarioId);
            return ResponseEntity.ok(contas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Conta> buscarPorId(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            Conta conta = contaService.buscarPorId(id, usuarioId);
            return ResponseEntity.ok(conta);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody Conta conta, 
                                     HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            Conta contaAtualizada = contaService.atualizarConta(id, conta, usuarioId);
            return ResponseEntity.ok(contaAtualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar conta: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            contaService.excluirConta(id, usuarioId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao excluir conta: " + e.getMessage());
        }
    }
}
