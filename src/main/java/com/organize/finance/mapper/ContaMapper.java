package com.organize.finance.mapper;

import com.organize.finance.bases.baseMapper.baseMapper;
import com.organize.finance.domain.Conta;
import com.organize.finance.domain.dto.ContaDto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ContaMapper extends baseMapper<Conta, ContaDto> {
    @Override
    ContaDto objToDto(Conta obj);

    @Override
    Conta dtoToObj(ContaDto dto);

    @Override
    List<ContaDto> objListToDtoList(List<Conta> dtos);

    @Override
    List<Conta> dtoListToObjList(List<ContaDto> objs);
}
