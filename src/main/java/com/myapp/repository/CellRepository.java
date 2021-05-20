package com.myapp.repository;

import com.myapp.domain.Cell;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Cell entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CellRepository extends JpaRepository<Cell, Long> {}
