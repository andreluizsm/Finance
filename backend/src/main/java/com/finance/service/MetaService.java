package com.finance.service;

import com.finance.entity.Meta;
import com.finance.entity.Usuario;
import com.finance.repository.MetaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MetaService {
    
    @Autowired
    private MetaRepository metaRepository;
    
    @Autowired
    private UsuarioService usuarioService;
    
    public Meta criarMeta(Meta meta, Long usuarioId) {
        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        meta.setUsuario(usuario);
        return metaRepository.save(meta);
    }
    
    public List<Meta> listarPorUsuario(Long usuarioId) {
        return metaRepository.findByUsuarioIdOrderByDataFimAsc(usuarioId);
    }
    
    public List<Meta> listarAtivasPorUsuario(Long usuarioId) {
        return metaRepository.findByUsuarioIdAndAtivaOrderByDataFimAsc(usuarioId, true);
    }
    
    public Meta buscarPorId(Long id, Long usuarioId) {
        Meta meta = metaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Meta não encontrada"));
            
        if (!meta.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Meta não pertence ao usuário");
        }
        
        return meta;
    }
    
    public Meta atualizarMeta(Long id, Meta metaAtualizada, Long usuarioId) {
        Meta metaExistente = buscarPorId(id, usuarioId);
        
        metaExistente.setTitulo(metaAtualizada.getTitulo());
        metaExistente.setValorAlvo(metaAtualizada.getValorAlvo());
        metaExistente.setValorAtual(metaAtualizada.getValorAtual());
        metaExistente.setDataInicio(metaAtualizada.getDataInicio());
        metaExistente.setDataFim(metaAtualizada.getDataFim());
        metaExistente.setCategoria(metaAtualizada.getCategoria());
        metaExistente.setAtiva(metaAtualizada.getAtiva());
        
        return metaRepository.save(metaExistente);
    }
    
    public void excluirMeta(Long id, Long usuarioId) {
        Meta meta = buscarPorId(id, usuarioId);
        metaRepository.delete(meta);
    }
}
