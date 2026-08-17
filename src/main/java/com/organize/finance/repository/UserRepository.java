package com.organize.finance.repository;

import com.organize.finance.domain.User;
import org.springframework.stereotype.Repository;
import com.organize.finance.bases.baseRepository.baseRepository;

import java.util.Optional;

@Repository
public interface UserRepository extends baseRepository<User> {

    Optional<User> findByEmail(String email);
}
