package com.organize.finance.bases.baseService;

import java.util.List;

public abstract class baseService<T> {

    public abstract T findById (Long id);

    public abstract List<T> findAll();

    public abstract T create(T entity);

    public abstract T update(T entity);

    public abstract void delete(Long id);
}
