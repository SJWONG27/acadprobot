package com.acadprobot.admin.repository;

import com.acadprobot.admin.model.UnrelatedQueries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface UnrelatedQueriesRepository extends JpaRepository<UnrelatedQueries, UUID> {
}
