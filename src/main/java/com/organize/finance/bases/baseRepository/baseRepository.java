package com.organize.finance.bases.baseRepository;

import jakarta.persistence.Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface baseRepository<T> extends JpaRepository<T, Long> {
}
