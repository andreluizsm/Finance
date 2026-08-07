package com.organize.finance.controller;

import com.organize.finance.bases.baseController.baseController;
import com.organize.finance.domain.dto.UserDto;
import com.organize.finance.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/usuarios")
public class UserController extends baseController<UserDto> {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> findById(@PathVariable Long id) {
        return new ResponseEntity<>(userService.findById(id), HttpStatus.OK);
    }

    @Override
    @GetMapping("/all")
    public List<UserDto> findAll() {
        return userService.findAll();
    }

    @Override
    @PostMapping()
    public ResponseEntity<UserDto> create(@RequestBody UserDto entity) {
        return new ResponseEntity<>(userService.create(entity), HttpStatus.CREATED);
    }

    @Override
    @PutMapping()
    public ResponseEntity<UserDto> update(@RequestBody UserDto entity) throws Exception {
        return new ResponseEntity<>(userService.update(entity), HttpStatus.OK);
    }

    @Override
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
