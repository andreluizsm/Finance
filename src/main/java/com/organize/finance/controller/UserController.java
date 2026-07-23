package com.organize.finance.controller;

import com.organize.finance.bases.baseController.baseController;
import com.organize.finance.domain.User;
import com.organize.finance.service.UserService;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController extends baseController<User> {
    UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Override
    public User findById(Long Id) {
        return null;
    }

    @Override
    public List<User> findAll() {
        return List.of();
    }

    @Override
    public User create(User entity) {
        return null;
    }

    @Override
    public User update(User entity) {
        return null;
    }

    @Override
    public void delete(Long id) {

    }
}
