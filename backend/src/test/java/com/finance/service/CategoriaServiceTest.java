package com.finance.service;

import com.finance.entity.Categoria;
import com.finance.entity.Usuario;
import com.finance.repository.CategoriaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private CategoriaService categoriaService;

    private Usuario usuario;
    private Categoria categoria;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("João");

        categoria = new Categoria();
        categoria.setId(1L);
        categoria.setNome("Alimentação");
        categoria.setCor("#FF0000");
        categoria.setIcone("food");
        categoria.setUsuario(usuario);
    }

    @Test
    void criarCategoria_DeveRetornarCategoriaCriada() {

        Categoria novaCategoria = new Categoria();
        novaCategoria.setNome("Transporte");
        novaCategoria.setCor("#00FF00");
        novaCategoria.setIcone("car");


        Categoria categoriaSalva = new Categoria();
        categoriaSalva.setId(2L);
        categoriaSalva.setNome("Transporte");
        categoriaSalva.setCor("#00FF00");
        categoriaSalva.setIcone("car");
        categoriaSalva.setUsuario(usuario);

        when(usuarioService.buscarPorId(1L)).thenReturn(usuario);
        when(categoriaRepository.save(any(Categoria.class))).thenReturn(categoriaSalva);


        Categoria resultado = categoriaService.criarCategoria(novaCategoria, 1L);


        assertNotNull(resultado);
        assertEquals("Transporte", resultado.getNome());
        assertEquals("#00FF00", resultado.getCor());
        assertEquals("car", resultado.getIcone());
        assertEquals(usuario, resultado.getUsuario());

        verify(usuarioService).buscarPorId(1L);
        verify(categoriaRepository).save(argThat(cat ->
                cat.getUsuario() != null && cat.getUsuario().getId().equals(1L)
        ));
    }

    @Test
    void listarPorUsuario_DeveRetornarListaCategorias() {

        List<Categoria> categorias = Arrays.asList(categoria);
        when(categoriaRepository.findByUsuarioIdOrderByNome(1L)).thenReturn(categorias);


        List<Categoria> resultado = categoriaService.listarPorUsuario(1L);


        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Alimentação", resultado.get(0).getNome());
        verify(categoriaRepository).findByUsuarioIdOrderByNome(1L);
    }

    @Test
    void buscarPorId_DeveRetornarCategoria_QuandoEncontradaEPertenceAoUsuario() {

        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));


        Categoria resultado = categoriaService.buscarPorId(1L, 1L);

        assertNotNull(resultado);
        assertEquals("Alimentação", resultado.getNome());
        assertEquals(usuario, resultado.getUsuario());
        verify(categoriaRepository).findById(1L);
    }

    @Test
    void buscarPorId_DeveLancarExcecao_QuandoCategoriaVinculadaAOutroUsuario() {

        Usuario outroUsuario = new Usuario();
        outroUsuario.setId(2L);
        outroUsuario.setNome("Maria");

        Categoria categoriaOutroUsuario = new Categoria();
        categoriaOutroUsuario.setId(1L);
        categoriaOutroUsuario.setNome("Alimentação");
        categoriaOutroUsuario.setUsuario(outroUsuario);

        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoriaOutroUsuario));


        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> categoriaService.buscarPorId(1L, 1L));

        assertEquals("Categoria não pertence ao usuário", exception.getMessage());
        verify(categoriaRepository).findById(1L);
    }

    @Test
    void buscarPorId_DeveLancarExcecao_QuandoCategoriaNaoEncontrada() {

        when(categoriaRepository.findById(1L)).thenReturn(Optional.empty());


        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> categoriaService.buscarPorId(1L, 1L));

        assertEquals("Categoria não encontrada", exception.getMessage());
        verify(categoriaRepository).findById(1L);
    }

    @Test
    void atualizarCategoria_DeveRetornarCategoriaAtualizada() {

        Categoria categoriaAtualizada = new Categoria();
        categoriaAtualizada.setNome("Lazer");
        categoriaAtualizada.setCor("#0000FF");
        categoriaAtualizada.setIcone("game");

        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        when(categoriaRepository.save(any(Categoria.class))).thenAnswer(invocation -> {
            Categoria cat = invocation.getArgument(0);
            return cat;
        });


        Categoria resultado = categoriaService.atualizarCategoria(1L, categoriaAtualizada, 1L);

        assertNotNull(resultado);
        assertEquals("Lazer", resultado.getNome());
        assertEquals("#0000FF", resultado.getCor());
        assertEquals("game", resultado.getIcone());
        assertEquals(usuario, resultado.getUsuario()); // Usuário deve permanecer o mesmo

        verify(categoriaRepository).findById(1L);
        verify(categoriaRepository).save(categoria);
    }

    @Test
    void excluirCategoria_DeveExcluirCategoria() {

        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        doNothing().when(categoriaRepository).delete(categoria);

        assertDoesNotThrow(() -> categoriaService.excluirCategoria(1L, 1L));


        verify(categoriaRepository).findById(1L);
        verify(categoriaRepository).delete(categoria);
    }

    @Test
    void excluirCategoria_DeveLancarExcecao_QuandoCategoriaNaoEncontrada() {
        when(categoriaRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> categoriaService.excluirCategoria(1L, 1L));

        assertEquals("Categoria não encontrada", exception.getMessage());
        verify(categoriaRepository).findById(1L);
        verify(categoriaRepository, never()).delete(any());
    }

    @Test
    void excluirCategoria_DeveLancarExcecao_QuandoCategoriaVinculadaAOutroUsuario() {
        Usuario outroUsuario = new Usuario();
        outroUsuario.setId(2L);

        Categoria categoriaOutroUsuario = new Categoria();
        categoriaOutroUsuario.setId(1L);
        categoriaOutroUsuario.setUsuario(outroUsuario);

        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoriaOutroUsuario));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> categoriaService.excluirCategoria(1L, 1L));

        assertEquals("Categoria não pertence ao usuário", exception.getMessage());
        verify(categoriaRepository).findById(1L);
        verify(categoriaRepository, never()).delete(any());
    }
}