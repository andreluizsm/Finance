package com.organize.finance.bases.baseController;


import java.util.List;
import java.util.Optional;


public abstract class baseController<T> {

    public abstract Optional<T> findById (Long Id);

    public abstract List<T> findAll();

    public abstract T create(T entity);

    public abstract T update(T entity);

    public abstract void delete(Long id);
}
