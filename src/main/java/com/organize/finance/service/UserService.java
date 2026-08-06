package com.organize.finance.service;

import com.organize.finance.bases.baseService.baseService;
import com.organize.finance.domain.User;
import com.organize.finance.domain.dto.UserDto;
import com.organize.finance.mapper.UserMapper;
import com.organize.finance.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService extends baseService<UserDto> {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public UserDto findById(Long id) {

        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()){
            return userMapper.mapUserToUserDto(user.get());
        }

        throw new RuntimeException();
    }

    @Override
    public List<UserDto> findAll() {
        return List.of();
    }

    @Override
    public UserDto create(UserDto entity) {

        User user = userMapper.mapUserDtoToUser(entity);
        User saved = userRepository.save(user);

        return userMapper.mapUserToUserDto(saved);
    }

    @Override
    public UserDto update(UserDto entity) throws Exception {

        UserDto userOld = findById(entity.id());
        if (userOld != null) {
            User usuario = userMapper.mapUserDtoToUser(userOld);

            usuario.setId(entity.id());
            usuario.setNome(entity.nome());
            usuario.setEmail(entity.email());
            usuario.setSenha(entity.senha());

            User saved = userRepository.save(usuario);

            return userMapper.mapUserToUserDto(saved);
        }
        throw new Exception("Usuario invalido");
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
