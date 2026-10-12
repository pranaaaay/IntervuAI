package com.IntervuAi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.IntervuAi.DTO.Answer;
import com.IntervuAi.Service.IntervuServiceImpl;
import com.IntervuAi.request.emailRequest;
import com.IntervuAi.response.InterviewStartResponse;
import com.IntervuAi.response.FeedBackResponse;

@RestController
@RequestMapping("/bot")
@CrossOrigin("*")
public class botController {

    private IntervuServiceImpl intervuService;

    String javaPrompt =
            "I want you to act as an interviewer. I will be the candidate and you will ask me "
            + "interview questions for the position of Java Backend Developer. "
            + "Cover Core Java, OOP, Collections, Exception Handling, Multithreading, "
            + "Java Features, Spring Boot, Spring Security, Hibernate, REST APIs, "
            + "HTML, CSS, JavaScript and basic Data Structures. "
            + "Ask exactly 10 questions. Start with beginner-level questions and gradually "
            + "increase the difficulty. Every question must end with a question mark. "
            + "Return only the questions and no other text.";

    String mernPrompt =
            "I want you to act as an interviewer. I will be the candidate and you will ask me "
            + "interview questions for the position of MERN Developer. "
            + "Cover HTML, CSS, JavaScript, React, Redux, TypeScript, Node.js, Express.js, "
            + "MongoDB, REST APIs and basic web development concepts. "
            + "Ask exactly 10 questions. Start with beginner-level questions and gradually "
            + "increase the difficulty. Every question must end with a question mark. "
            + "Return only the questions and no other text.";

    String nodePrompt =
            "I want you to act as an interviewer. I will be the candidate and you will ask me "
            + "interview questions for the position of Node.js Developer. "
            + "Cover JavaScript, Node.js, Express.js, async/await, RESTful APIs, NPM, "
            + "callbacks, Promises, middleware and error handling. "
            + "Ask exactly 10 questions. Start with beginner-level questions and gradually "
            + "increase the difficulty. Every question must end with a question mark. "
            + "Return only the questions and no other text.";

    String sqlPrompt =
            "I want you to act as an interviewer. I will be the candidate and you will ask me "
            + "interview questions for the position of Software Developer with SQL knowledge. "
            + "Cover SELECT queries, WHERE, ORDER BY, GROUP BY, HAVING, aggregate functions, "
            + "primary keys, foreign keys, JOINs, subqueries, normalization, indexes, "
            + "constraints and transactions. "
            + "Ask exactly 10 questions. Start with beginner-level questions and gradually "
            + "increase the difficulty. Every question must end with a question mark. "
            + "Return only the questions and no other text.";

    String dsaPrompt =
            "I want you to act as an interviewer. I will be the candidate for a Software Developer "
            + "position. Ask me exactly 10 Data Structures and Algorithms interview questions. "
            + "Cover arrays, strings, linked lists, stacks, queues, hash maps, sorting, searching, "
            + "two pointers, sliding window, recursion and basic time and space complexity. "
            + "Start with beginner-level questions and gradually increase the difficulty. "
            + "Include a mixture of conceptual and problem-solving questions. "
            + "Every question must end with a question mark. "
            + "Return only the questions and no other text.";

    String javascriptPrompt =
            "I want you to act as an interviewer. I will be the candidate for a JavaScript Developer "
            + "or Software Developer position. Ask me exactly 10 JavaScript interview questions. "
            + "Cover variables, data types, functions, scope, hoisting, arrays, objects, "
            + "DOM, events, promises, async/await, callbacks, ES6 features and basic JavaScript concepts. "
            + "Start with beginner-level questions and gradually increase the difficulty. "
            + "Every question must end with a question mark. "
            + "Return only the questions and no other text.";

    String hrPrompt =
            "I want you to act as an HR interviewer for a fresher Software Developer position. "
            + "Ask me exactly 10 HR interview questions. "
            + "Cover self introduction, strengths, weaknesses, career goals, teamwork, leadership, "
            + "conflict management, challenges, projects, why should we hire you, and relocation. "
            + "Start with simple questions and gradually make them more challenging. "
            + "Every question must end with a question mark. "
            + "Return only the questions and no other text.";

    @Autowired
    public botController(IntervuServiceImpl intervuService) {
        super();
        this.intervuService = intervuService;
    }

    @PostMapping("/user")
public ResponseEntity<InterviewStartResponse> getUserEmail(
        @RequestBody emailRequest email) {

    System.out.println("User email: " + email.getEmail());
    System.out.println("Technology: " + email.getTechnology());

    return new ResponseEntity<>(
            intervuService.findUserByEmail(email),
            HttpStatus.OK
    );
}
    @GetMapping("/java")
    public ResponseEntity<String> javaInterview() {

        String resp = intervuService.getResponse(javaPrompt);

        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    @GetMapping("/mern")
    public ResponseEntity<String> mernInterview() {

        String resp = intervuService.getResponse(mernPrompt);

        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    @GetMapping("/node")
    public ResponseEntity<String> nodeInterview() {

        String resp = intervuService.getResponse(nodePrompt);

        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    @GetMapping("/sql")
    public ResponseEntity<String> sqlInterview() {

        String resp = intervuService.getResponse(sqlPrompt);

        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    @GetMapping("/dsa")
    public ResponseEntity<String> dsaInterview() {

        String resp = intervuService.getResponse(dsaPrompt);

        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    @GetMapping("/javascript")
    public ResponseEntity<String> javascriptInterview() {

        String resp = intervuService.getResponse(javascriptPrompt);

        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    @GetMapping("/hr")
    public ResponseEntity<String> hrInterview() {

        String resp = intervuService.getResponse(hrPrompt);

        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    @PostMapping("/answer")
public ResponseEntity<FeedBackResponse> sendAnswer(
        @RequestBody Answer answer) {

    System.out.println(
            "Interview ID: " + answer.getInterviewId()
    );

    System.out.println(
            "Question: " + answer.getQuestion()
    );

    System.out.println(
            "Answer: " + answer.getAnswer()
    );

    return new ResponseEntity<>(
            intervuService.sendFeedback(answer),
            HttpStatus.OK
    );
}
}