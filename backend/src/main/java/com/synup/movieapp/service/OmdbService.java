package com.synup.movieapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.Collections;

@Service
public class OmdbService {

    @Value("${omdb.api.key}")
    private String apiKey;

    @Value("${omdb.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> searchMovies(String title) {
        if (title == null || title.trim().isEmpty()) {
            return Collections.emptyMap();
        }
        String url = String.format("%s?apikey=%s&s=%s", apiUrl, apiKey, title);
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyMap();
        }
    }
}
