package com.myapp.repository;

import com.myapp.domain.Gateway;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Gateway entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GatewayRepository extends JpaRepository<Gateway, Long> {}
