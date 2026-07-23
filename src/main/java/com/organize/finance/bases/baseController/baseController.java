package com.organize.finance.bases.baseController;


import java.util.List;


public abstract class baseController<T> {

    public abstract T findById (Long Id);

    public abstract List<T> findAll();

    public abstract T create(T entity);

    public abstract T update(T entity);

    public abstract void delete(Long id);
}
