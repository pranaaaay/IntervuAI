package com.IntervuAi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.IntervuAi.model.Interview;
import com.IntervuAi.model.User;

@Repository
public interface InterviewRepository
        extends JpaRepository<Interview, Integer> {

    List<Interview> findByUser(User user);

    List<Interview> findByUserAndStatus(
            User user,
            String status
    );
}