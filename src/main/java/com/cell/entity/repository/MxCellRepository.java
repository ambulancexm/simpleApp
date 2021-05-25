package com.cell.entity.repository;

import com.cell.entity.domain.MxCell;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the MxCell entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MxCellRepository extends JpaRepository<MxCell, Long> {}
