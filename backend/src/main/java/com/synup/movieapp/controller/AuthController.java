package com.synup.movieapp.controller;

import com.synup.movieapp.config.JwtUtils;
import com.synup.movieapp.model.User;
import com.synup.movieapp.payload.JwtResponse;
import com.synup.movieapp.payload.LoginRequest;
import com.synup.movieapp.payload.SignupRequest;
import com.synup.movieapp.repository.UserRepository;
import com.synup.movieapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    com.synup.movieapp.service.TokenBlacklistService tokenBlacklistService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Find user ID from DB or cast to custom UserDetailsImpl if we used it.
        // For simplicity, we query repo or we could have casted if we made UserDetailsImpl expose ID.
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        return ResponseEntity.ok(new JwtResponse(jwt,
                user.getId(),
                user.getUsername()));
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser(jakarta.servlet.http.HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (org.springframework.util.StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            String jwt = headerAuth.substring(7);
            tokenBlacklistService.blacklistToken(jwt);
            return ResponseEntity.ok("You've been signed out!");
        }
        return ResponseEntity.badRequest().body("No token found to signout");
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.findByUsername(signUpRequest.getUsername()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Username is already taken!");
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(signUpRequest.getPassword());

        userService.registerUser(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}
