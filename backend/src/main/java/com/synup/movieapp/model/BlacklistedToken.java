package com.synup.movieapp.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Entity
@Data
@NoArgsConstructor
@Table(name = "token_blacklist")
public class BlacklistedToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private Instant expiryDate;

    public BlacklistedToken(String token, Instant expiryDate) {
        this.token = token;
        this.expiryDate = expiryDate;
    }
}
