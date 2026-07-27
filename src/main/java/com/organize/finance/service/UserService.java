package com.organize.finance.service;

import com.organize.finance.bases.baseService.baseService;
import com.organize.finance.domain.User;
import com.organize.finance.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService extends baseService<User> {

    UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public List<User> findAll() {
        return List.of();
    }

    @Override
    public User create(User entity) {
        return userRepository.save(entity);
    }

    @Override
    public User update(User entity) throws Exception {
        Optional<User> userOld = findById(entity.getId());
        if (userOld.isPresent()) {
            User usuario = userOld.get();

            usuario.setId(entity.getId());
            usuario.setNome(entity.getNome());
            usuario.setEmail(entity.getEmail());
            usuario.setSenha(entity.getSenha());

            return userRepository.save(usuario);
        }
        throw new Exception("Usuario invalido");
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
