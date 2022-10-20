package com.nour.agiliti.repository;

import com.nour.agiliti.domain.Collaborater;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Collaborater entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CollaboraterRepository extends MongoRepository<Collaborater, Long> {}
