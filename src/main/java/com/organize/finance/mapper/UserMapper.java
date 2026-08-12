package com.organize.finance.mapper;

import com.organize.finance.bases.baseMapper.baseMapper;
import com.organize.finance.domain.User;
import com.organize.finance.domain.dto.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper (componentModel = "spring")
public interface UserMapper extends baseMapper<User, UserDto> {

    @Override
    @Mapping(target = "senha", ignore = true)
    UserDto objToDto(User obj);

    @Override
    User dtoToObj(UserDto dto);

    @Override
    List<UserDto> objListToDtoList(List<User> dtos);

    @Override
    List<User> dtoListToObjList(List<UserDto> objs);
}
