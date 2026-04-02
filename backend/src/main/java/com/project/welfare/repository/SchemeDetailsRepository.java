package com.project.welfare.repository;

import com.project.welfare.Entity.SchemeDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchemeDetailsRepository extends JpaRepository<SchemeDetails, Integer> {
    SchemeDetails findBySchemeId(int schemeId);
}
