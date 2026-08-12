package com.organize.finance.service;

import com.organize.finance.bases.baseService.baseService;
import com.organize.finance.domain.dto.ContaDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContaService extends baseService<ContaDto> {

    @Override
    public ContaDto findById(Long id) {
        return null;
    }

    @Override
    public List<ContaDto> findAll() {
        return List.of();
    }

    @Override
    public ContaDto create(ContaDto entity) {
        return null;
    }

    @Override
    public ContaDto update(ContaDto entity) throws Exception {
        return null;
    }

    @Override
    public void delete(Long id) {

    }
}
