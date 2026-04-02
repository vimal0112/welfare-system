package com.project.welfare.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.welfare.Entity.Scheme;
import com.project.welfare.dto.SchemeListDto;

@Repository
public interface SchemeRepository extends JpaRepository<Scheme, Integer> {
    List<Scheme> findTop2ByOrderByIdDesc();

    @Query("""
            SELECT new com.project.welfare.dto.SchemeListDto(
                s.id, s.schemeName, s.minAge, s.maxAge, s.maxIncome, s.category, s.gender,
                s.location, s.occupation, s.description, s.disabilityRequired, s.minorityRequired
            )
            FROM Scheme s
            """)
    List<SchemeListDto> findAllForList();

    @Query("""
            SELECT new com.project.welfare.dto.SchemeListDto(
                s.id, s.schemeName, s.minAge, s.maxAge, s.maxIncome, s.category, s.gender,
                s.location, s.occupation, s.description, s.disabilityRequired, s.minorityRequired
            )
            FROM Scheme s
            ORDER BY s.id DESC
            """)
    List<SchemeListDto> findRecentForList(Pageable pageable);

    @Query("SELECT DISTINCT s FROM Scheme s LEFT JOIN FETCH s.schemeDetails")
    List<Scheme> findAllWithDetails();

    @Query("SELECT s FROM Scheme s LEFT JOIN FETCH s.schemeDetails WHERE s.id = :id")
    Optional<Scheme> findByIdWithDetails(@Param("id") int id);

    @Query("SELECT s.schemeName FROM Scheme s WHERE s.id = :id")
    Optional<String> findSchemeNameById(@Param("id") int id);
}
