package com.finance.controller;

import com.finance.dto.LoginRequest;
import com.finance.dto.LoginResponse;
import com.finance.dto.RegistroRequest;
import com.finance.entity.Usuario;
import com.finance.security.JwtUtil;
import com.finance.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Optional<Usuario> usuarioOpt = usuarioService.buscarPorEmail(loginRequest.getEmail());
            
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Usuário não encontrado");
            }
            
            Usuario usuario = usuarioOpt.get();
            
            if (!passwordEncoder.matches(loginRequest.getSenha(), usuario.getSenha())) {
                return ResponseEntity.badRequest().body("Senha incorreta");
            }
            
            String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getId());
            
            return ResponseEntity.ok(new LoginResponse(token, usuario));
            
        } catch (Exception e) {
            System.err.println("Erro no login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro no login: " + e.getMessage());
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegistroRequest registroRequest) {
        try {
            // Criar objeto Usuario a partir do DTO
            Usuario usuario = new Usuario();
            usuario.setNome(registroRequest.getNome());
            usuario.setEmail(registroRequest.getEmail());
            usuario.setSenha(registroRequest.getSenha());
            
            Usuario novoUsuario = usuarioService.registrar(usuario);
            String token = jwtUtil.generateToken(novoUsuario.getEmail(), novoUsuario.getId());
            
            return ResponseEntity.ok(new LoginResponse(token, novoUsuario));
            
        } catch (RuntimeException e) {
            System.err.println("Erro no registro: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Erro inesperado no registro: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro interno do servidor");
        }
    }
}
