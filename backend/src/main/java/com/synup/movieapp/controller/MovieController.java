package com.synup.movieapp.controller;

import com.synup.movieapp.model.Favorite;
import com.synup.movieapp.model.User;
import com.synup.movieapp.repository.FavoriteRepository;
import com.synup.movieapp.repository.UserRepository;
import com.synup.movieapp.service.OmdbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    OmdbService omdbService;

    @Autowired
    FavoriteRepository favoriteRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/search")
    public ResponseEntity<?> searchMovies(@RequestParam String title) {
        Map<String, Object> result = omdbService.searchMovies(title);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/favorites")
    public ResponseEntity<?> getFavorites(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        List<Favorite> favorites = favoriteRepository.findByUserId(user.getId());
        return ResponseEntity.ok(favorites);
    }

    @PostMapping("/favorites")
    public ResponseEntity<?> addFavorite(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Favorite favorite) {
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        
        // Ensure user is associated
        favorite.setUser(user);
        
        // Simple check for duplicates
        // Note: Better to handle in service or DB constraint
        
        favoriteRepository.save(favorite);
        return ResponseEntity.ok("Favorite added successfully!");
    }

    @DeleteMapping("/favorites/{id}")
    public ResponseEntity<?> deleteFavorite(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        Favorite favorite = favoriteRepository.findById(id).orElse(null);

        if (favorite == null) {
            return ResponseEntity.notFound().build();
        }

        if (!favorite.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You cannot delete this favorite.");
        }

        favoriteRepository.delete(favorite);
        return ResponseEntity.ok("Favorite deleted successfully!");
    }

    @PutMapping("/favorites/{id}")
    public ResponseEntity<?> updateFavorite(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id, @RequestBody Favorite favoriteDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        Favorite favorite = favoriteRepository.findById(id).orElse(null);

        if (favorite == null) {
            return ResponseEntity.notFound().build();
        }

        if (!favorite.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You cannot update this favorite.");
        }

        favorite.setWatchDate(favoriteDetails.getWatchDate());
        favoriteRepository.save(favorite);
        
        return ResponseEntity.ok(favorite);
    }
}
