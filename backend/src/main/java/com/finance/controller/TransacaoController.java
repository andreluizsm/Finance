package com.finance.controller;

import com.finance.entity.Transacao;
import com.finance.entity.TipoTransacao;
import com.finance.service.TransacaoService;
import com.finance.dto.TransacaoRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transacoes")
@CrossOrigin(origins = "*")
public class TransacaoController {
    
    @Autowired
    private TransacaoService transacaoService;
    
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody TransacaoRequest request, HttpServletRequest httpRequest) {
        try {
            Long usuarioId = (Long) httpRequest.getAttribute("userId");
            if (usuarioId == null) {
                return ResponseEntity.badRequest().body("Usuário não autenticado");
            }
            
            Transacao novaTransacao = transacaoService.criarTransacao(request, usuarioId);
            return ResponseEntity.ok(novaTransacao);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Dados inválidos: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Erro ao criar transação: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao criar transação: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<?> listar(HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            if (usuarioId == null) {
                return ResponseEntity.badRequest().body("Usuário não autenticado");
            }
            
            List<Transacao> transacoes = transacaoService.listarPorUsuario(usuarioId);
            return ResponseEntity.ok(transacoes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao listar transações: " + e.getMessage());
        }
    }
    
    @GetMapping("/periodo")
    public ResponseEntity<?> listarPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim,
            HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            if (usuarioId == null) {
                return ResponseEntity.badRequest().body("Usuário não autenticado");
            }
            
            List<Transacao> transacoes = transacaoService.listarPorPeriodo(usuarioId, inicio, fim);
            return ResponseEntity.ok(transacoes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao listar transações por período: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            if (usuarioId == null) {
                return ResponseEntity.badRequest().body("Usuário não autenticado");
            }
            
            Transacao transacao = transacaoService.buscarPorId(id, usuarioId);
            return ResponseEntity.ok(transacao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar transação: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody TransacaoRequest request, 
                                     HttpServletRequest httpRequest) {
        try {
            Long usuarioId = (Long) httpRequest.getAttribute("userId");
            if (usuarioId == null) {
                return ResponseEntity.badRequest().body("Usuário não autenticado");
            }
            
            Transacao transacaoAtualizada = transacaoService.atualizarTransacao(id, request, usuarioId);
            return ResponseEntity.ok(transacaoAtualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar transação: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            if (usuarioId == null) {
                return ResponseEntity.badRequest().body("Usuário não autenticado");
            }
            
            transacaoService.excluirTransacao(id, usuarioId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao excluir transação: " + e.getMessage());
        }
    }
}
