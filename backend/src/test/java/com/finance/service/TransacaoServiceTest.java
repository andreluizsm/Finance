package com.finance.service;

import com.finance.dto.TransacaoRequest;
import com.finance.entity.*;
import com.finance.repository.CategoriaRepository;
import com.finance.repository.ContaRepository;
import com.finance.repository.TransacaoRepository;
import com.finance.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransacaoServiceTest {

    @Mock
    private TransacaoRepository transacaoRepository;
    @Mock
    private ContaRepository contaRepository;
    @Mock
    private CategoriaRepository categoriaRepository;
    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private TransacaoService transacaoService;

    private Usuario usuario;
    private Conta contaOrigem;
    private Conta contaDestino;
    private Categoria categoria;
    private TransacaoRequest transacaoRequest;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);

        contaOrigem = new Conta();
        contaOrigem.setId(10L);
        contaOrigem.setUsuario(usuario);
        contaOrigem.setSaldo(new BigDecimal("1000.00"));

        contaDestino = new Conta();
        contaDestino.setId(11L);
        contaDestino.setUsuario(usuario);
        contaDestino.setSaldo(new BigDecimal("500.00"));

        categoria = new Categoria();
        categoria.setId(20L);
        categoria.setUsuario(usuario);

        transacaoRequest = new TransacaoRequest();
        transacaoRequest.setValor(new BigDecimal("100.00"));
        transacaoRequest.setData(LocalDate.now());
        transacaoRequest.setDescricao("Teste");

        TransacaoRequest.ContaRef contaRef = new TransacaoRequest.ContaRef();
        contaRef.setId(contaOrigem.getId());
        transacaoRequest.setConta(contaRef);

        TransacaoRequest.CategoriaRef categoriaRef = new TransacaoRequest.CategoriaRef();
        categoriaRef.setId(categoria.getId());
        transacaoRequest.setCategoria(categoriaRef);
    }

    @Test
    void deveCriarTransacaoDeEntradaComSucesso() {
        transacaoRequest.setTipo(TipoTransacao.ENTRADA);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(contaRepository.findById(10L)).thenReturn(Optional.of(contaOrigem));
        when(categoriaRepository.findById(20L)).thenReturn(Optional.of(categoria));
        when(transacaoRepository.save(any(Transacao.class))).thenAnswer(inv -> inv.getArgument(0));

        transacaoService.criarTransacao(transacaoRequest, 1L);

        ArgumentCaptor<Conta> contaCaptor = ArgumentCaptor.forClass(Conta.class);
        verify(contaRepository).save(contaCaptor.capture());
        assertEquals(new BigDecimal("1100.00"), contaCaptor.getValue().getSaldo());
        verify(transacaoRepository).save(any(Transacao.class));
    }

    @Test
    void deveCriarTransacaoDeSaidaComSucesso() {
        transacaoRequest.setTipo(TipoTransacao.SAIDA);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(contaRepository.findById(10L)).thenReturn(Optional.of(contaOrigem));
        when(categoriaRepository.findById(20L)).thenReturn(Optional.of(categoria));
        when(transacaoRepository.save(any(Transacao.class))).thenAnswer(inv -> inv.getArgument(0));

        transacaoService.criarTransacao(transacaoRequest, 1L);

        ArgumentCaptor<Conta> contaCaptor = ArgumentCaptor.forClass(Conta.class);
        verify(contaRepository).save(contaCaptor.capture());
        assertEquals(new BigDecimal("900.00"), contaCaptor.getValue().getSaldo());
        verify(transacaoRepository).save(any(Transacao.class));
    }

    @Test
    void deveExcluirTransacaoDeSaidaEReverterSaldo() {
        Transacao transacaoSaida = new Transacao();
        transacaoSaida.setId(1L);
        transacaoSaida.setUsuario(usuario);
        transacaoSaida.setConta(contaOrigem);
        transacaoSaida.setTipo(TipoTransacao.SAIDA);
        transacaoSaida.setValor(new BigDecimal("100.00"));

        when(transacaoRepository.findById(1L)).thenReturn(Optional.of(transacaoSaida));

        transacaoService.excluirTransacao(1L, 1L);

        ArgumentCaptor<Conta> contaCaptor = ArgumentCaptor.forClass(Conta.class);
        verify(contaRepository).save(contaCaptor.capture());
        assertEquals(new BigDecimal("1100.00"), contaCaptor.getValue().getSaldo());
        verify(transacaoRepository).delete(transacaoSaida);
    }

    @Test
    void deveExcluirTransacaoDeTransferenciaEReverterSaldos() {
        Transacao transacaoTransferencia = new Transacao();
        transacaoTransferencia.setId(1L);
        transacaoTransferencia.setUsuario(usuario);
        transacaoTransferencia.setConta(contaOrigem);
        transacaoTransferencia.setContaDestino(contaDestino);
        transacaoTransferencia.setTipo(TipoTransacao.TRANSFERENCIA);
        transacaoTransferencia.setValor(new BigDecimal("100.00"));

        when(transacaoRepository.findById(1L)).thenReturn(Optional.of(transacaoTransferencia));

        transacaoService.excluirTransacao(1L, 1L);

        ArgumentCaptor<Conta> contaCaptor = ArgumentCaptor.forClass(Conta.class);
        verify(contaRepository, times(2)).save(contaCaptor.capture());

        Conta savedConta1 = contaCaptor.getAllValues().get(0);
        Conta savedConta2 = contaCaptor.getAllValues().get(1);

        assertTrue((savedConta1.getId().equals(11L) && savedConta1.getSaldo().compareTo(new BigDecimal("400.00")) == 0) ||
                (savedConta2.getId().equals(11L) && savedConta2.getSaldo().compareTo(new BigDecimal("400.00")) == 0));

        assertTrue((savedConta1.getId().equals(10L) && savedConta1.getSaldo().compareTo(new BigDecimal("1100.00")) == 0) ||
                (savedConta2.getId().equals(10L) && savedConta2.getSaldo().compareTo(new BigDecimal("1100.00")) == 0));

        verify(transacaoRepository).delete(transacaoTransferencia);
    }

    @Test
    void deveCalcularTotalPorTipoEPeriodoComSucesso() {
        LocalDate inicio = LocalDate.now().minusMonths(1);
        LocalDate fim = LocalDate.now();
        BigDecimal totalEsperado = new BigDecimal("1234.56");

        when(transacaoRepository.findTotalByUsuarioIdAndTipoAndDataBetween(1L, TipoTransacao.SAIDA, inicio, fim))
                .thenReturn(totalEsperado);

        BigDecimal totalCalculado = transacaoService.calcularTotalPorTipoEPeriodo(1L, TipoTransacao.SAIDA, inicio, fim);

        assertEquals(totalEsperado, totalCalculado);
    }

    @Test
    void deveRetornarZeroSeNaoHouverTotalPorTipoEPeriodo() {
        LocalDate inicio = LocalDate.now().minusMonths(1);
        LocalDate fim = LocalDate.now();

        when(transacaoRepository.findTotalByUsuarioIdAndTipoAndDataBetween(1L, TipoTransacao.SAIDA, inicio, fim))
                .thenReturn(null);

        BigDecimal totalCalculado = transacaoService.calcularTotalPorTipoEPeriodo(1L, TipoTransacao.SAIDA, inicio, fim);

        assertEquals(BigDecimal.ZERO, totalCalculado);
    }
}