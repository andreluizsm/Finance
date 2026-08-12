package com.organize.finance.service;

import com.organize.finance.bases.baseService.baseService;
import com.organize.finance.domain.Conta;
import com.organize.finance.domain.dto.ContaDto;
import com.organize.finance.mapper.ContaMapper;
import com.organize.finance.repository.ContaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContaService extends baseService<ContaDto> {

    private final ContaRepository contaRepository;
    private final ContaMapper contaMapper;

    public ContaService(ContaRepository contaRepository, ContaMapper contaMapper) {
        this.contaRepository = contaRepository;
        this.contaMapper = contaMapper;
    }

    @Override
    public ContaDto findById(Long id) {
        Optional<Conta> conta = contaRepository.findById(id);
        if (conta.isPresent()) {
            return contaMapper.objToDto(conta.get());
        }
        throw new RuntimeException();
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
