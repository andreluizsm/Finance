package com.organize.finance.mapper;

import com.organize.finance.bases.baseMapper.baseMapper;
import com.organize.finance.domain.Transacao;
import com.organize.finance.domain.dto.TransacaoDto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TransacaoMapper extends baseMapper<Transacao, TransacaoDto> {
    @Override
    TransacaoDto objToDto(Transacao obj);

    @Override
    Transacao dtoToObj(TransacaoDto dto);

    @Override
    List<TransacaoDto> objListToDtoList(List<Transacao> dtos);

    @Override
    List<Transacao> dtoListToObjList(List<TransacaoDto> objs);
}
