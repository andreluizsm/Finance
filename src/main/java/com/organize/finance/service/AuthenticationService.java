package com.organize.finance.service;

import com.organize.finance.domain.User;
import com.organize.finance.domain.dto.LoginDto;
import com.organize.finance.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(UserRepository userRepository, AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }



    public User singUp (LoginDto login ) {
        User user = new User();

        user.setNome(login.nome());
        user.setEmail(login.email());
        user.setSenha(passwordEncoder.encode(login.senha()));

        return userRepository.save(user);
    }


    public User authenticate(LoginDto login) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        login.email(),
                        login.senha()
                )
        );
        return userRepository.findByEmail(login.email()).orElseThrow();
    }

}
