package com.cell.entity.repository;

import com.cell.entity.domain.Cell;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Cell entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CellRepository extends JpaRepository<Cell, Long> {}
