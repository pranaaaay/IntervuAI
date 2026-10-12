package com.IntervuAi.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OllamaResponse {

    private String model;
    private String response;
    private boolean done;
}