package com.organize.finance.mapper;

import com.organize.finance.domain.User;
import com.organize.finance.domain.dto.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper (componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "senha", ignore = true)
    UserDto mapUserToUserDto (User user);

    User mapUserDtoToUser (UserDto userDTO);

    List<UserDto> mapUserListToUserDtoList(List<User> users);

    List<User> mapUserDtoListToUserList(List<UserDto> dtos);
}
