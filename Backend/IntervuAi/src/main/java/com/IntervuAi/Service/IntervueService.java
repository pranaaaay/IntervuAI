
package com.IntervuAi.Service;

import com.IntervuAi.DTO.Answer;
import com.IntervuAi.request.emailRequest;
import com.IntervuAi.response.FeedBackResponse;
import com.IntervuAi.response.InterviewStartResponse;

public interface IntervueService {

    public String getResponse(String prompt);

    public FeedBackResponse sendFeedback(Answer answer);

    public InterviewStartResponse findUserByEmail(emailRequest email);
}

