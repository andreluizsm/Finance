package com.finance.controller;

import com.finance.entity.Meta;
import com.finance.service.MetaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metas")
@CrossOrigin(origins = "*")
public class MetaController {
    
    @Autowired
    private MetaService metaService;
    
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody Meta meta, HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            Meta novaMeta = metaService.criarMeta(meta, usuarioId);
            return ResponseEntity.ok(novaMeta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar meta: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Meta>> listar(HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            List<Meta> metas = metaService.listarPorUsuario(usuarioId);
            return ResponseEntity.ok(metas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/ativas")
    public ResponseEntity<List<Meta>> listarAtivas(HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            List<Meta> metas = metaService.listarAtivasPorUsuario(usuarioId);
            return ResponseEntity.ok(metas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Meta> buscarPorId(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            Meta meta = metaService.buscarPorId(id, usuarioId);
            return ResponseEntity.ok(meta);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody Meta meta, 
                                     HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            Meta metaAtualizada = metaService.atualizarMeta(id, meta, usuarioId);
            return ResponseEntity.ok(metaAtualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar meta: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            metaService.excluirMeta(id, usuarioId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao excluir meta: " + e.getMessage());
        }
    }
}
