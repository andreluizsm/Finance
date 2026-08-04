package com.organize.finance.mapper;

import com.organize.finance.domain.User;
import com.organize.finance.domain.dto.userDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper (componentModel = "spring")
public interface userMapper {

    @Mapping(target = "senha", ignore = true)
    userDTO mapUserToUserDto (User user);

    User mapUserDtoToUser (userDTO userDTO);
}
