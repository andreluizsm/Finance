package com.organize.finance.bases.baseController;


import org.springframework.http.ResponseEntity;

import java.util.List;


public abstract class baseController<T> {

    public abstract ResponseEntity<T> findById (Long id);

    public abstract List<T> findAll();

    public abstract ResponseEntity<T> create(T entity);

    public abstract ResponseEntity<T> update(T entity) throws Exception;

    public abstract void delete(Long id);
}
