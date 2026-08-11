package com.organize.finance.service;

import com.organize.finance.bases.baseService.baseService;
import com.organize.finance.domain.dto.TransacaoDto;

import java.util.List;

public class TransacaoService extends baseService<TransacaoDto> {

    @Override
    public TransacaoDto findById(Long id) {
        return null;
    }

    @Override
    public List<TransacaoDto> findAll() {
        return List.of();
    }

    @Override
    public TransacaoDto create(TransacaoDto entity) {
        return null;
    }

    @Override
    public TransacaoDto update(TransacaoDto entity) throws Exception {
        return null;
    }

    @Override
    public void delete(Long id) {

    }
}
