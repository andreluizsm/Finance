package com.organize.finance.bases.baseController;


import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;


public abstract class baseController<T> {

    public abstract ResponseEntity<T> findById (Long Id);

    public abstract List<T> findAll();

    public abstract ResponseEntity<T> create(T entity);

    public abstract ResponseEntity<T> update(T entity) throws Exception;

    public abstract void delete(Long id);
}
