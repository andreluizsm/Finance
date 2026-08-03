package com.organize.finance.controller;

import com.organize.finance.bases.baseController.baseController;
import com.organize.finance.domain.User;
import com.organize.finance.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/usuarios")
public class UserController extends baseController<User> {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<User> findById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @Override
    @PostMapping
    public List<User> findAll() {
        return userService.findAll();
    }

    @Override
    @PostMapping()
    public User create(@RequestBody User entity) {
        return userService.create(entity);
    }

    @Override
    @PutMapping()
    public User update(@RequestBody User entity) throws Exception {
        return userService.update(entity);
    }

    @Override
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
