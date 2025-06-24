package com.finance.controller;

import com.finance.entity.Categoria;
import com.finance.service.CategoriaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriaController {
    
    @Autowired
    private CategoriaService categoriaService;
    
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody Categoria categoria, HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            Categoria novaCategoria = categoriaService.criarCategoria(categoria, usuarioId);
            return ResponseEntity.ok(novaCategoria);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar categoria: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Categoria>> listar(HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            List<Categoria> categorias = categoriaService.listarPorUsuario(usuarioId);
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> buscarPorId(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            Categoria categoria = categoriaService.buscarPorId(id, usuarioId);
            return ResponseEntity.ok(categoria);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody Categoria categoria, 
                                     HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            Categoria categoriaAtualizada = categoriaService.atualizarCategoria(id, categoria, usuarioId);
            return ResponseEntity.ok(categoriaAtualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar categoria: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("userId");
            categoriaService.excluirCategoria(id, usuarioId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao excluir categoria: " + e.getMessage());
        }
    }
}
