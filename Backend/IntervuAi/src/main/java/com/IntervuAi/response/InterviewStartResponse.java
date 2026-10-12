
package com.IntervuAi.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InterviewStartResponse {

    private Integer interviewId;

    private String message;

    private boolean status;
}
