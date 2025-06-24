package com.finance.service;

import com.finance.entity.Conta;
import com.finance.entity.Usuario;
import com.finance.repository.ContaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContaServiceTest {

    @Mock
    private ContaRepository contaRepository;

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private ContaService contaService;

    private Usuario usuario;
    private Conta conta;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Usuário Teste");

        conta = new Conta();
        conta.setId(10L);
        conta.setUsuario(usuario);
        conta.setNome("Conta Corrente");
        conta.setSaldo(new BigDecimal("1000.00"));
    }

    @Test
    void deveCriarContaComSucesso() {
        Conta novaConta = new Conta();
        novaConta.setNome("Conta Poupança");

        when(usuarioService.buscarPorId(1L)).thenReturn(usuario);
        when(contaRepository.save(any(Conta.class))).thenReturn(conta);

        Conta contaCriada = contaService.criarConta(novaConta, 1L);

        assertNotNull(contaCriada);
        assertEquals(usuario, contaCriada.getUsuario());
        verify(usuarioService).buscarPorId(1L);
        verify(contaRepository).save(novaConta);
    }

    @Test
    void deveListarContasPorUsuario() {
        when(contaRepository.findByUsuarioIdOrderByNome(1L)).thenReturn(List.of(conta));

        List<Conta> contas = contaService.listarPorUsuario(1L);

        assertFalse(contas.isEmpty());
        assertEquals(1, contas.size());
        assertEquals("Conta Corrente", contas.get(0).getNome());
        verify(contaRepository).findByUsuarioIdOrderByNome(1L);
    }

    @Test
    void deveBuscarContaPorIdComSucesso() {
        when(contaRepository.findById(10L)).thenReturn(Optional.of(conta));

        Conta contaEncontrada = contaService.buscarPorId(10L, 1L);

        assertNotNull(contaEncontrada);
        assertEquals(10L, contaEncontrada.getId());
    }

    @Test
    void deveLancarExcecaoAoBuscarContaInexistente() {
        when(contaRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            contaService.buscarPorId(99L, 1L);
        });

        assertEquals("Conta não encontrada", exception.getMessage());
    }

    @Test
    void deveLancarExcecaoAoBuscarContaDeOutroUsuario() {
        when(contaRepository.findById(10L)).thenReturn(Optional.of(conta));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            contaService.buscarPorId(10L, 2L);
        });

        assertEquals("Conta não pertence ao usuário", exception.getMessage());
    }

    @Test
    void deveAtualizarContaComSucesso() {
        Conta contaAtualizada = new Conta();
        contaAtualizada.setNome("Conta Corrente Atualizada");
        contaAtualizada.setSaldo(new BigDecimal("1500.00"));

        when(contaRepository.findById(10L)).thenReturn(Optional.of(conta));
        when(contaRepository.save(any(Conta.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Conta resultado = contaService.atualizarConta(10L, contaAtualizada, 1L);

        assertNotNull(resultado);
        assertEquals("Conta Corrente Atualizada", resultado.getNome());
        assertEquals(new BigDecimal("1500.00"), resultado.getSaldo());
        verify(contaRepository).save(conta);
    }

    @Test
    void deveExcluirContaComSucesso() {
        when(contaRepository.findById(10L)).thenReturn(Optional.of(conta));
        doNothing().when(contaRepository).delete(conta);

        assertDoesNotThrow(() -> contaService.excluirConta(10L, 1L));

        verify(contaRepository, times(1)).delete(conta);
    }

    @Test
    void deveCalcularSaldoTotal() {
        BigDecimal saldoTotalEsperado = new BigDecimal("2550.50");
        when(contaRepository.findTotalSaldoByUsuarioId(1L)).thenReturn(saldoTotalEsperado);

        BigDecimal saldoTotalCalculado = contaService.calcularSaldoTotal(1L);

        assertEquals(saldoTotalEsperado, saldoTotalCalculado);
    }

    @Test
    void deveRetornarZeroQuandoNaoHaSaldo() {
        when(contaRepository.findTotalSaldoByUsuarioId(1L)).thenReturn(null);

        BigDecimal saldoTotalCalculado = contaService.calcularSaldoTotal(1L);

        assertEquals(BigDecimal.ZERO, saldoTotalCalculado);
    }
}