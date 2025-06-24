package com.finance.service;

import com.finance.entity.Conta;
import com.finance.entity.Usuario;
import com.finance.repository.ContaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ContaService {
    
    @Autowired
    private ContaRepository contaRepository;
    
    @Autowired
    private UsuarioService usuarioService;
    
    public Conta criarConta(Conta conta, Long usuarioId) {
        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        conta.setUsuario(usuario);
        return contaRepository.save(conta);
    }
    
    public List<Conta> listarPorUsuario(Long usuarioId) {
        return contaRepository.findByUsuarioIdOrderByNome(usuarioId);
    }
    
    public Conta buscarPorId(Long id, Long usuarioId) {
        Conta conta = contaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Conta não encontrada"));
            
        if (!conta.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Conta não pertence ao usuário");
        }
        
        return conta;
    }
    
    public Conta atualizarConta(Long id, Conta contaAtualizada, Long usuarioId) {
        Conta contaExistente = buscarPorId(id, usuarioId);
        
        contaExistente.setNome(contaAtualizada.getNome());
        contaExistente.setTipo(contaAtualizada.getTipo());
        contaExistente.setSaldo(contaAtualizada.getSaldo());
        
        return contaRepository.save(contaExistente);
    }
    
    public void excluirConta(Long id, Long usuarioId) {
        Conta conta = buscarPorId(id, usuarioId);
        contaRepository.delete(conta);
    }
    
    public BigDecimal calcularSaldoTotal(Long usuarioId) {
        BigDecimal total = contaRepository.findTotalSaldoByUsuarioId(usuarioId);
        return total != null ? total : BigDecimal.ZERO;
    }
}
