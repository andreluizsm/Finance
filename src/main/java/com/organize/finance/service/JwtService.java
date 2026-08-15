package com.organize.finance.service;

import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private String secretyKey;

    private long jwtExpiration;
}
