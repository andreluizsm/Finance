package com.finance.service;

import com.finance.entity.*;
import com.finance.dto.TransacaoRequest;
import com.finance.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class TransacaoService {
    
    @Autowired
    private TransacaoRepository transacaoRepository;
    
    @Autowired
    private ContaRepository contaRepository;
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Transactional
    public Transacao criarTransacao(TransacaoRequest request, Long usuarioId) {
        // Validar e buscar usuário
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        
        // Validar e buscar conta
        Conta conta = contaRepository.findById(request.getConta().getId())
            .orElseThrow(() -> new IllegalArgumentException("Conta não encontrada"));
        
        // Verificar se a conta pertence ao user
        if (!conta.getUsuario().getId().equals(usuarioId)) {
            throw new IllegalArgumentException("Conta não pertence ao usuário");
        }
        
        // Buscar categoria
        Categoria categoria = null;
        if (request.getCategoria() != null && request.getCategoria().getId() != null) {
            categoria = categoriaRepository.findById(request.getCategoria().getId())
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
            
            // Verificar se a categoria pertence ao usuário
            if (!categoria.getUsuario().getId().equals(usuarioId)) {
                throw new IllegalArgumentException("Categoria não pertence ao usuário");
            }
        }
        
        // Criar transação
        Transacao transacao = new Transacao();
        transacao.setData(request.getData());
        transacao.setValor(request.getValor());
        transacao.setDescricao(request.getDescricao());
        transacao.setTipo(request.getTipo());
        transacao.setCategoria(categoria);
        transacao.setConta(conta);
        transacao.setUsuario(usuario);
        
        // Processar transferência se necessário
        if (request.getTipo() == TipoTransacao.TRANSFERENCIA) {
            if (request.getContaDestino() == null || request.getContaDestino().getId() == null) {
                throw new IllegalArgumentException("Conta destino é obrigatória para transferências");
            }
            
            Conta contaDestino = contaRepository.findById(request.getContaDestino().getId())
                .orElseThrow(() -> new IllegalArgumentException("Conta destino não encontrada"));
            
            if (!contaDestino.getUsuario().getId().equals(usuarioId)) {
                throw new IllegalArgumentException("Conta destino não pertence ao usuário");
            }
            
            transacao.setContaDestino(contaDestino);
        }
        
        // Atualizar saldos das contas
        atualizarSaldos(transacao);
        
        // Salvar transação
        return transacaoRepository.save(transacao);
    }
    
    private void atualizarSaldos(Transacao transacao) {
        BigDecimal valor = transacao.getValor();
        
        switch (transacao.getTipo()) {
            case ENTRADA:
                transacao.getConta().setSaldo(
                    transacao.getConta().getSaldo().add(valor)
                );
                contaRepository.save(transacao.getConta());
                break;
                
            case SAIDA:
                transacao.getConta().setSaldo(
                    transacao.getConta().getSaldo().subtract(valor)
                );
                contaRepository.save(transacao.getConta());
                break;
                
            case TRANSFERENCIA:
                // Debitar da conta origem
                transacao.getConta().setSaldo(
                    transacao.getConta().getSaldo().subtract(valor)
                );
                // Creditar na conta destino
                transacao.getContaDestino().setSaldo(
                    transacao.getContaDestino().getSaldo().add(valor)
                );
                contaRepository.save(transacao.getConta());
                contaRepository.save(transacao.getContaDestino());
                break;
        }
    }
    
    public List<Transacao> listarPorUsuario(Long usuarioId) {
        return transacaoRepository.findByUsuarioIdOrderByDataDescCreatedAtDesc(usuarioId);
    }
    
    public List<Transacao> listarPorPeriodo(Long usuarioId, LocalDate inicio, LocalDate fim) {
        return transacaoRepository.findByUsuarioIdAndDataBetweenOrderByDataDesc(usuarioId, inicio, fim);
    }
    
    public Transacao buscarPorId(Long id, Long usuarioId) {
        Transacao transacao = transacaoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transação não encontrada"));
            
        if (!transacao.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Transação não pertence ao usuário");
        }
        
        return transacao;
    }
    
    @Transactional
    public Transacao atualizarTransacao(Long id, TransacaoRequest request, Long usuarioId) {
        Transacao transacaoExistente = buscarPorId(id, usuarioId);
        
        // Reverter saldos anteriores
        reverterSaldos(transacaoExistente);
        
        // Atualizar dados
        transacaoExistente.setData(request.getData());
        transacaoExistente.setValor(request.getValor());
        transacaoExistente.setDescricao(request.getDescricao());
        transacaoExistente.setTipo(request.getTipo());
        
        // Atualizar categoria
        if (request.getCategoria() != null && request.getCategoria().getId() != null) {
            Categoria categoria = categoriaRepository.findById(request.getCategoria().getId())
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
            transacaoExistente.setCategoria(categoria);
        } else {
            transacaoExistente.setCategoria(null);
        }
        
        // Atualizar conta
        Conta conta = contaRepository.findById(request.getConta().getId())
            .orElseThrow(() -> new IllegalArgumentException("Conta não encontrada"));
        transacaoExistente.setConta(conta);
        
        // Aplicar novos saldos
        atualizarSaldos(transacaoExistente);
        
        return transacaoRepository.save(transacaoExistente);
    }
    
    private void reverterSaldos(Transacao transacao) {
        BigDecimal valor = transacao.getValor();
        
        switch (transacao.getTipo()) {
            case ENTRADA:
                transacao.getConta().setSaldo(
                    transacao.getConta().getSaldo().subtract(valor)
                );
                contaRepository.save(transacao.getConta());
                break;
                
            case SAIDA:
                transacao.getConta().setSaldo(
                    transacao.getConta().getSaldo().add(valor)
                );
                contaRepository.save(transacao.getConta());
                break;
                
            case TRANSFERENCIA:
                // Reverter débito da conta origem
                transacao.getConta().setSaldo(
                    transacao.getConta().getSaldo().add(valor)
                );
                // Reverter crédito da conta destino
                if (transacao.getContaDestino() != null) {
                    transacao.getContaDestino().setSaldo(
                        transacao.getContaDestino().getSaldo().subtract(valor)
                    );
                    contaRepository.save(transacao.getContaDestino());
                }
                contaRepository.save(transacao.getConta());
                break;
        }
    }
    
    @Transactional
    public void excluirTransacao(Long id, Long usuarioId) {
        Transacao transacao = buscarPorId(id, usuarioId);
        
        // Reverter saldos
        reverterSaldos(transacao);
        
        // Excluir transação
        transacaoRepository.delete(transacao);
    }
    
    public BigDecimal calcularTotalPorTipoEPeriodo(Long usuarioId, TipoTransacao tipo, LocalDate inicio, LocalDate fim) {
        BigDecimal total = transacaoRepository.findTotalByUsuarioIdAndTipoAndDataBetween(usuarioId, tipo, inicio, fim);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public List<Object[]> obterGastosPorCategoria(Long usuarioId) {
        return transacaoRepository.findGastosPorCategoria(usuarioId);
    }
}
