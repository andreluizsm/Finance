package com.finance.service;

import com.finance.entity.Categoria;
import com.finance.entity.Usuario;
import com.finance.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    @Autowired
    private UsuarioService usuarioService;
    
    public Categoria criarCategoria(Categoria categoria, Long usuarioId) {
        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        categoria.setUsuario(usuario);
        return categoriaRepository.save(categoria);
    }
    
    public List<Categoria> listarPorUsuario(Long usuarioId) {
        return categoriaRepository.findByUsuarioIdOrderByNome(usuarioId);
    }
    
    public Categoria buscarPorId(Long id, Long usuarioId) {
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
            
        if (!categoria.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Categoria não pertence ao usuário");
        }
        
        return categoria;
    }
    
    public Categoria atualizarCategoria(Long id, Categoria categoriaAtualizada, Long usuarioId) {
        Categoria categoriaExistente = buscarPorId(id, usuarioId);
        
        categoriaExistente.setNome(categoriaAtualizada.getNome());
        categoriaExistente.setCor(categoriaAtualizada.getCor());
        categoriaExistente.setIcone(categoriaAtualizada.getIcone());
        
        return categoriaRepository.save(categoriaExistente);
    }
    
    public void excluirCategoria(Long id, Long usuarioId) {
        Categoria categoria = buscarPorId(id, usuarioId);
        categoriaRepository.delete(categoria);
    }
}
