
package com.IntervuAi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppGptConfig {

    @Bean
    public RestTemplate templete() {
        return new RestTemplate();
    }
}
