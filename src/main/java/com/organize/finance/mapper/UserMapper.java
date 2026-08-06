package com.organize.finance.mapper;

import com.organize.finance.domain.User;
import com.organize.finance.domain.dto.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper (componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "senha", ignore = true)
    UserDto mapUserToUserDto (User user);

    User mapUserDtoToUser (UserDto userDTO);
}
