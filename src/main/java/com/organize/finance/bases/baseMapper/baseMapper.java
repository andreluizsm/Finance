package com.organize.finance.bases.baseMapper;

import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface baseMapper<T, Y> {

    Y objToDto(T obj);

    T dtoToObj(Y dto);

    List<Y> objListToDtoList(List<T> dtos);

    List<T> dtoListToObjList(List<Y> objs);

}
