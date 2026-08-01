package com.organize.finance.controller;

import com.organize.finance.bases.baseController.baseController;
import com.organize.finance.domain.User;
import com.organize.finance.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/usuarios")
public class UserController extends baseController<User> {
    UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Override
    @GetMapping("/{id}")
    public Optional<User> findById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @Override
    public List<User> findAll() {
        return List.of();
    }

    @Override
    @PostMapping()
    public User create(@RequestBody User entity) {
        return userService.create(entity);
    }

    @Override
    @PutMapping()
    public User update(User entity) {
        return null;
    }

    @Override
    @DeleteMapping()
    public void delete(Long id) {

    }
}
