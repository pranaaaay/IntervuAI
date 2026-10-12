
package com.IntervuAi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.IntervuAi.model.Interview;
import com.IntervuAi.model.User;
import com.IntervuAi.repository.InterviewRepository;
import com.IntervuAi.repository.UserRepository;

@RestController
@RequestMapping("/interview")
@CrossOrigin("*")
public class InterviewController {

    private InterviewRepository interviewRepository;
    private UserRepository userRepository;

    @Autowired
    public InterviewController(
            InterviewRepository interviewRepository,
            UserRepository userRepository) {

        this.interviewRepository = interviewRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/history")
    public ResponseEntity<List<Interview>> getInterviewHistory(
            @RequestParam String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        List<Interview> interviews =
                interviewRepository.findByUser(user);

        return new ResponseEntity<>(
                interviews,
                HttpStatus.OK
        );
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Interview> completeInterview(
            @PathVariable Integer id) {

        Interview interview =
                interviewRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Interview not found"
                                )
                        );

        interview.setStatus("COMPLETED");

        Interview updatedInterview =
                interviewRepository.save(interview);

        return new ResponseEntity<>(
                updatedInterview,
                HttpStatus.OK
        );
    }
}
