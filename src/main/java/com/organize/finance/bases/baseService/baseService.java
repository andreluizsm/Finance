package com.organize.finance.bases.baseService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public abstract class baseService<T> {

    public abstract T findById (Long id);

    public abstract List<T> findAll();

    public abstract T create(T entity);

    public abstract T update(T entity) throws Exception;

    public abstract void delete(Long id);
}
