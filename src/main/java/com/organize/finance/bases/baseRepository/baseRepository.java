package com.organize.finance.bases.baseRepository;

import org.springframework.data.jpa.repository.JpaRepository;

public interface baseRepository<T> extends JpaRepository<T, Long> {
}
