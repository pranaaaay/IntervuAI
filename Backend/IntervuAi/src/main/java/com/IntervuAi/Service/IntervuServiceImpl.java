
package com.IntervuAi.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.IntervuAi.DTO.Answer;
import com.IntervuAi.DTO.OllamaResponse;
import com.IntervuAi.exception.UserException;
import com.IntervuAi.model.FeedBack;
import com.IntervuAi.model.Interview;
import com.IntervuAi.model.User;
import com.IntervuAi.repository.FeedBackReposioty;
import com.IntervuAi.repository.InterviewRepository;
import com.IntervuAi.repository.UserRepository;
import com.IntervuAi.request.emailRequest;
import com.IntervuAi.response.FeedBackResponse;
import com.IntervuAi.response.InterviewStartResponse;

@Service
public class IntervuServiceImpl implements IntervueService {

    private UserRepository userRepository;

    private FeedBackReposioty feedBackReposioty;

    private InterviewRepository interviewRepository;

    @Autowired
    private RestTemplate temp;

    @Value("${ollama.model}")
    private String model;

    @Value("${ollama.api.url}")
    private String url;

    @Autowired
    public IntervuServiceImpl(
            UserRepository userRepository,
            FeedBackReposioty feedBackReposioty,
            InterviewRepository interviewRepository) {

        this.userRepository = userRepository;
        this.feedBackReposioty = feedBackReposioty;
        this.interviewRepository = interviewRepository;
    }

    String answerPrompt =
            "You are an AI interviewer evaluating a candidate's interview answer.\n"
            + "Evaluate the candidate's answer using exactly these three criteria:\n\n"
            + "Subject Matter Expertise\n"
            + "Communication Skills\n"
            + "Problem-Solving Skills\n\n"
            + "Give a score from 0 to 10 for EACH criterion.\n"
            + "You MUST provide exactly three integer scores.\n"
            + "Even if a criterion is not directly related to the question, still give a reasonable score based on the candidate's answer.\n\n"
            + "Use exactly this format:\n"
            + "Subject Matter Expertise: <number>\n"
            + "Communication Skills: <number>\n"
            + "Problem-Solving Skills: <number>\n\n"
            + "After the three scores, provide a short explanation of the candidate's strengths and areas for improvement.\n\n";

    public String getResponse(String prompt) {

        Map<String, Object> request = new HashMap<>();

        request.put("model", model);
        request.put("prompt", prompt);
        request.put("stream", false);

        OllamaResponse response =
                temp.postForObject(
                        url,
                        request,
                        OllamaResponse.class
                );

        if (response == null) {
            throw new RuntimeException(
                    "No response received from Ollama"
            );
        }

        return response.getResponse();
    }

    @Override
    public InterviewStartResponse findUserByEmail(
            emailRequest email) {

        Optional<User> optional =
                userRepository.findByEmail(
                        email.getEmail()
                );

        User loggedInUser = optional.orElseThrow(
                () -> new UserException(
                        "User not Found"
                )
        );

        /*
         * Mark previous unfinished interviews as
         * ABANDONED before starting a new interview.
         */
        List<Interview> previousInterviews =
                interviewRepository.findByUserAndStatus(
                        loggedInUser,
                        "STARTED"
                );

        for (Interview interview : previousInterviews) {

            interview.setStatus("ABANDONED");

            interviewRepository.save(interview);
        }

        /*
         * Create a new interview.
         */
        Interview newInterview = new Interview();

        newInterview.setUser(loggedInUser);

        newInterview.setTechnology(
                email.getTechnology()
        );

        newInterview.setInterviewDate(
                java.time.LocalDateTime.now()
        );

        newInterview.setStatus("STARTED");

        Interview savedInterview =
                interviewRepository.save(
                        newInterview
                );

        System.out.println(
                "Interview started. ID: "
                + savedInterview.getId()
        );

        return new InterviewStartResponse(
                savedInterview.getId(),
                "Interview started successfully",
                true
        );
    }

    @Override
    public FeedBackResponse sendFeedback(
            Answer answer) {

        /*
         * Every answer must contain the interview ID.
         */
        if (answer.getInterviewId() == null) {

            throw new UserException(
                    "Interview ID is required"
            );
        }

        /*
         * Find the interview directly from the database.
         */
        Interview interview =
                interviewRepository
                        .findById(
                                answer.getInterviewId()
                        )
                        .orElseThrow(
                                () -> new UserException(
                                        "Interview not found"
                                )
                        );

        /*
         * Do not allow answers to an interview that
         * is already completed or abandoned.
         */
        if (!"STARTED".equals(
                interview.getStatus())) {

            throw new UserException(
                    "This interview is no longer active"
            );
        }

        /*
         * Send question and answer to Ollama.
         */
        String send =
                answerPrompt
                + "\nQuestion: "
                + answer.getQuestion()
                + "\nAnswer: "
                + answer.getAnswer();

        String aiFeedback =
                getResponse(send);

        System.out.println(
                "AI Feedback:"
        );

        System.out.println(
                aiFeedback
        );

        /*
         * Extract the three scores.
         */
        List<Integer> score =
                FindNumbersInString(
                        aiFeedback
                );

        if (score.size() < 3) {

            throw new RuntimeException(
                    "AI response did not contain three valid scores."
            );
        }

        /*
         * Create feedback record.
         */
        FeedBack feedBack =
                new FeedBack();

        feedBack.setSubjectExperties(
                score.get(0)
        );

        feedBack.setCommunicationSkill(
                score.get(1)
        );

        feedBack.setProblemSolving(
                score.get(2)
        );

        feedBack.setQuestion(
                answer.getQuestion()
        );

        feedBack.setAnswer(
                answer.getAnswer()
        );

        feedBack.setAiFeedback(
                aiFeedback
        );

        /*
         * Associate feedback with the user who
         * owns this interview.
         */
        feedBack.setUser(
                interview.getUser()
        );

        /*
         * Associate feedback with this interview.
         */
        interview.getFeedBackList().add(
                feedBack
        );

        /*
         * Saving the interview also saves the
         * feedback because Interview uses
         * CascadeType.ALL.
         */
        interviewRepository.save(
                interview
        );

        System.out.println(
                "Feedback saved for Interview ID: "
                + interview.getId()
        );

        return new FeedBackResponse(
                score.get(0),
                score.get(1),
                score.get(2),
                aiFeedback
        );
    }

    public List<Integer> FindNumbersInString(
            String input) {

        List<Integer> numbers =
                new java.util.ArrayList<>();

        Pattern pattern =
                Pattern.compile(
                        "(Subject Matter Expertise|Communication Skills|Problem-Solving Skills)\\s*:\\s*(\\d+)"
                );

        Matcher matcher =
                pattern.matcher(input);

        while (matcher.find()) {

            int score =
                    Integer.parseInt(
                            matcher.group(2)
                    );

            /*
             * Keep scores within the expected
             * 0-10 range.
             */
            if (score >= 0 && score <= 10) {

                numbers.add(score);
            }
        }

        return numbers;
    }
}
