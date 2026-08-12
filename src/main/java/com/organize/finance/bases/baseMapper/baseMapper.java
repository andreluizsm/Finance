package com.organize.finance.bases.baseMapper;

import java.util.List;

public interface baseMapper<T, Y> {

    Y objToDto(T obj);

    T dtoToObj(Y dto);

    List<Y> objListToDtoList(List<T> dtos);

    List<T> dtoListToObjList(List<Y> objs);

}
