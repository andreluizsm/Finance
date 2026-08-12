package com.organize.finance.service;

import com.organize.finance.bases.baseService.baseService;
import com.organize.finance.domain.Transacao;
import com.organize.finance.domain.dto.TransacaoDto;
import com.organize.finance.mapper.TransacaoMapper;
import com.organize.finance.repository.TransacaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransacaoService extends baseService<TransacaoDto> {

    private final TransacaoRepository transacaoRepository;
    private final TransacaoMapper transacaoMapper;

    public TransacaoService(TransacaoRepository transacaoRepository, TransacaoMapper transacaoMapper) {
        this.transacaoRepository = transacaoRepository;
        this.transacaoMapper = transacaoMapper;
    }

    @Override
    public TransacaoDto findById(Long id) {
        Optional<Transacao> transacao = transacaoRepository.findById(id);
        if (transacao.isPresent()){
            return transacaoMapper.objToDto(transacao.get());
        }
        throw new RuntimeException();
    }

    @Override
    public List<TransacaoDto> findAll() {
        List<Transacao> transacoes = transacaoRepository.findAll();
        return transacaoMapper.objListToDtoList(transacoes);
    }

    @Override
    public TransacaoDto create(TransacaoDto entity) {
        Transacao saved =  transacaoRepository.save(transacaoMapper.dtoToObj(entity));
        return transacaoMapper.objToDto(saved);
    }

    @Override
    public TransacaoDto update(TransacaoDto entity) throws Exception {

        TransacaoDto oldTransacao = findById(entity.id());
        if (oldTransacao != null) {
            Transacao transacao = transacaoMapper.dtoToObj(oldTransacao);

            transacao.setId(entity.id());
            transacao.setValor(entity.valor());
            transacao.setTipo(entity.tipo());
            transacao.setData(entity.data());
            transacao.setDescricao(entity.descricao());
            transacao.setCategoriaId(entity.categoriaId());

            Transacao transacaoSaved = transacaoRepository.save(transacao);

            return transacaoMapper.objToDto(transacaoSaved);
        }
        throw new RuntimeException();
    }

    @Override
    public void delete(Long id) {
        transacaoRepository.deleteById(id);
    }
}
