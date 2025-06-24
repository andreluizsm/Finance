package com.finance.service;

import com.finance.entity.Usuario;
import com.finance.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Usuário Teste");
        usuario.setEmail("teste@email.com");
        usuario.setSenha("senha123");
    }

    @Test
    void deveRegistrarUsuarioComSucesso() {
        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome("Novo Usuário");
        novoUsuario.setEmail("novo@email.com");
        novoUsuario.setSenha("novaSenha123");

        when(usuarioRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("senha_codificada");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(novoUsuario);

        Usuario usuarioSalvo = usuarioService.registrar(novoUsuario);

        assertNotNull(usuarioSalvo);
        assertEquals("senha_codificada", usuarioSalvo.getSenha());
        verify(usuarioRepository).existsByEmail("novo@email.com");
        verify(passwordEncoder).encode("novaSenha123");
        verify(usuarioRepository).save(novoUsuario);
    }

    @Test
    void deveLancarExcecaoAoRegistrarEmailJaExistente() {
        when(usuarioRepository.existsByEmail("teste@email.com")).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            usuarioService.registrar(usuario);
        });

        assertEquals("Email já cadastrado", exception.getMessage());
        verify(passwordEncoder, never()).encode(anyString());
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void deveLancarExcecaoAoRegistrarComSenhaCurta() {
        usuario.setSenha("123");

        when(usuarioRepository.existsByEmail(anyString())).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            usuarioService.registrar(usuario);
        });

        assertEquals("Senha deve ter no mínimo 6 caracteres", exception.getMessage());
    }

    @Test
    void deveBuscarUsuarioPorEmailComSucesso() {
        when(usuarioRepository.findByEmail("teste@email.com")).thenReturn(Optional.of(usuario));

        Optional<Usuario> resultado = usuarioService.buscarPorEmail("teste@email.com");

        assertTrue(resultado.isPresent());
        assertEquals("Usuário Teste", resultado.get().getNome());
        verify(usuarioRepository).findByEmail("teste@email.com");
    }

    @Test
    void deveBuscarUsuarioPorIdComSucesso() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        Usuario resultado = usuarioService.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
    }

    @Test
    void deveLancarExcecaoAoBuscarUsuarioPorIdInexistente() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            usuarioService.buscarPorId(99L);
        });

        assertEquals("Usuário não encontrado", exception.getMessage());
    }

    @Test
    void deveAtualizarUsuarioSemAlterarSenha() {
        Usuario dadosAtualizacao = new Usuario();
        dadosAtualizacao.setNome("Nome Atualizado");
        dadosAtualizacao.setEmail("email_atualizado@email.com");
        dadosAtualizacao.setSenha("");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        usuarioService.atualizar(1L, dadosAtualizacao);

        ArgumentCaptor<Usuario> usuarioCaptor = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository).save(usuarioCaptor.capture());

        assertEquals("Nome Atualizado", usuarioCaptor.getValue().getNome());
        assertEquals("senha123", usuarioCaptor.getValue().getSenha());
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void deveAtualizarUsuarioEAlterarSenha() {
        Usuario dadosAtualizacao = new Usuario();
        dadosAtualizacao.setNome("Nome Atualizado");
        dadosAtualizacao.setEmail("email_atualizado@email.com");
        dadosAtualizacao.setSenha("novaSenhaForte");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.encode("novaSenhaForte")).thenReturn("nova_senha_codificada");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        usuarioService.atualizar(1L, dadosAtualizacao);

        ArgumentCaptor<Usuario> usuarioCaptor = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository).save(usuarioCaptor.capture());

        assertEquals("Nome Atualizado", usuarioCaptor.getValue().getNome());
        assertEquals("nova_senha_codificada", usuarioCaptor.getValue().getSenha());
        verify(passwordEncoder).encode("novaSenhaForte");
    }
}