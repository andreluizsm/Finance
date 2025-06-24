package com.finance.service;

import com.finance.entity.Meta;
import com.finance.entity.Usuario;
import com.finance.repository.MetaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MetaServiceTest {

    @Mock
    private MetaRepository metaRepository;

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private MetaService metaService;

    private Usuario usuario;
    private Meta meta;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Usuário de Teste");

        meta = new Meta();
        meta.setId(1L);
        meta.setUsuario(usuario);
        meta.setTitulo("Comprar Carro");
        meta.setValorAlvo(new BigDecimal("50000.00"));
        meta.setValorAtual(new BigDecimal("10000.00"));
        meta.setDataFim(LocalDate.now().plusYears(1));
        meta.setAtiva(true);
    }

    @Test
    void deveCriarMetaComSucesso() {
        Meta novaMeta = new Meta();
        novaMeta.setTitulo("Viagem para a Europa");

        when(usuarioService.buscarPorId(1L)).thenReturn(usuario);
        when(metaRepository.save(any(Meta.class))).thenReturn(novaMeta);

        Meta metaCriada = metaService.criarMeta(novaMeta, 1L);

        assertNotNull(metaCriada);
        assertEquals(usuario, metaCriada.getUsuario());
        verify(usuarioService).buscarPorId(1L);
        verify(metaRepository).save(novaMeta);
    }

    @Test
    void deveListarMetasPorUsuario() {
        when(metaRepository.findByUsuarioIdOrderByDataFimAsc(1L)).thenReturn(List.of(meta));

        List<Meta> metas = metaService.listarPorUsuario(1L);

        assertFalse(metas.isEmpty());
        assertEquals(1, metas.size());
        assertEquals("Comprar Carro", metas.get(0).getTitulo());
        verify(metaRepository).findByUsuarioIdOrderByDataFimAsc(1L);
    }

    @Test
    void deveListarMetasAtivasPorUsuario() {
        when(metaRepository.findByUsuarioIdAndAtivaOrderByDataFimAsc(1L, true)).thenReturn(List.of(meta));

        List<Meta> metasAtivas = metaService.listarAtivasPorUsuario(1L);

        assertFalse(metasAtivas.isEmpty());
        assertEquals(1, metasAtivas.size());
        assertTrue(metasAtivas.get(0).getAtiva());
        verify(metaRepository).findByUsuarioIdAndAtivaOrderByDataFimAsc(1L, true);
    }

    @Test
    void deveBuscarMetaPorIdComSucesso() {
        when(metaRepository.findById(1L)).thenReturn(Optional.of(meta));

        Meta metaEncontrada = metaService.buscarPorId(1L, 1L);

        assertNotNull(metaEncontrada);
        assertEquals(1L, metaEncontrada.getId());
    }

    @Test
    void deveLancarExcecaoAoBuscarMetaInexistente() {
        when(metaRepository.findById(anyLong())).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            metaService.buscarPorId(99L, 1L);
        });

        assertEquals("Meta não encontrada", exception.getMessage());
    }

    @Test
    void deveLancarExcecaoAoBuscarMetaDeOutroUsuario() {
        when(metaRepository.findById(1L)).thenReturn(Optional.of(meta));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            metaService.buscarPorId(1L, 2L);
        });

        assertEquals("Meta não pertence ao usuário", exception.getMessage());
    }

    @Test
    void deveAtualizarMetaComSucesso() {
        Meta metaAtualizada = new Meta();
        metaAtualizada.setTitulo("Comprar Carro Novo");
        metaAtualizada.setValorAlvo(new BigDecimal("60000.00"));
        metaAtualizada.setValorAtual(new BigDecimal("15000.00"));
        metaAtualizada.setAtiva(false);

        when(metaRepository.findById(1L)).thenReturn(Optional.of(meta));
        when(metaRepository.save(any(Meta.class))).thenAnswer(inv -> inv.getArgument(0));

        Meta resultado = metaService.atualizarMeta(1L, metaAtualizada, 1L);

        assertNotNull(resultado);
        assertEquals("Comprar Carro Novo", resultado.getTitulo());
        assertEquals(new BigDecimal("15000.00"), resultado.getValorAtual());
        assertFalse(resultado.getAtiva());
        verify(metaRepository).save(meta);
    }

    @Test
    void deveExcluirMetaComSucesso() {
        when(metaRepository.findById(1L)).thenReturn(Optional.of(meta));
        doNothing().when(metaRepository).delete(meta);

        assertDoesNotThrow(() -> metaService.excluirMeta(1L, 1L));

        verify(metaRepository, times(1)).delete(meta);
    }
}