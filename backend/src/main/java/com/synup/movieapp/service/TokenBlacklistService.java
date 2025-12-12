package com.synup.movieapp.service;

import com.synup.movieapp.model.BlacklistedToken;
import com.synup.movieapp.repository.BlacklistedTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class TokenBlacklistService {

    @Autowired
    private BlacklistedTokenRepository blacklistedTokenRepository;

    public void blacklistToken(String token) {
        // Find expiry from token, but for now we'll just blacklist it indefinitely
        // In a real app we'd decode the JWT to set the DB expiry to match
        if (!blacklistedTokenRepository.existsByToken(token)) {
            // Setting a default expiry or logic to read from JWT
            BlacklistedToken blacklistedToken = new BlacklistedToken(token, Instant.now().plusSeconds(86400));
            blacklistedTokenRepository.save(blacklistedToken);
        }
    }

    public boolean isBlacklisted(String token) {
        return blacklistedTokenRepository.existsByToken(token);
    }
}
