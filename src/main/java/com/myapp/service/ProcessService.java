package com.myapp.service;

import com.myapp.domain.Process;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Process}.
 */
public interface ProcessService {
    /**
     * Save a process.
     *
     * @param process the entity to save.
     * @return the persisted entity.
     */
    Process save(Process process);

    /**
     * Partially updates a process.
     *
     * @param process the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Process> partialUpdate(Process process);

    /**
     * Get all the processes.
     *
     * @return the list of entities.
     */
    List<Process> findAll();

    /**
     * Get the "id" process.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Process> findOne(Long id);

    /**
     * Delete the "id" process.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
