package com.IntervuAi.authentication;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class AppConfig {

    private final JwtValidator jwtValidator;

    public AppConfig(JwtValidator jwtValidator) {
        this.jwtValidator = jwtValidator;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> cors.configurationSource(
                    corsConfigurationSource()
            ))

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            .authorizeHttpRequests(auth -> auth

                    .requestMatchers(
                            "/",
                            "/auth/**",
                            "/error"
                    ).permitAll()

                    .requestMatchers(
                            "/swagger-ui/**",
                            "/v3/api-docs/**"
                    ).permitAll()

                    .anyRequest().authenticated()
            )

            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            .addFilterBefore(
                    jwtValidator,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        return new CorsConfigurationSource() {

            @Override
            public CorsConfiguration getCorsConfiguration(
                    HttpServletRequest request) {

                CorsConfiguration cfg =
                        new CorsConfiguration();

                cfg.setAllowedOrigins(
                        Arrays.asList(
                                "http://localhost:3000",
                                "http://localhost:4200"
                        )
                );

                cfg.setAllowedMethods(
                        Arrays.asList(
                                "GET",
                                "POST",
                                "PUT",
                                "DELETE",
                                "OPTIONS"
                        )
                );

                cfg.setAllowedHeaders(
                        Collections.singletonList("*")
                );

                cfg.setExposedHeaders(
                        Collections.singletonList(
                                JwtConstant.JWT_HEADER
                        )
                );

                cfg.setAllowCredentials(true);

                cfg.setMaxAge(3600L);

                return cfg;
            }
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}