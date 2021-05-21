package com.myapp.service.impl;

import com.myapp.domain.Process;
import com.myapp.repository.ProcessRepository;
import com.myapp.service.ProcessService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Process}.
 */
@Service
@Transactional
public class ProcessServiceImpl implements ProcessService {

    private final Logger log = LoggerFactory.getLogger(ProcessServiceImpl.class);

    private final ProcessRepository processRepository;

    public ProcessServiceImpl(ProcessRepository processRepository) {
        this.processRepository = processRepository;
    }

    @Override
    public Process save(Process process) {
        log.debug("Request to save Process : {}", process);
        return processRepository.save(process);
    }

    @Override
    public Optional<Process> partialUpdate(Process process) {
        log.debug("Request to partially update Process : {}", process);

        return processRepository
            .findById(process.getId())
            .map(
                existingProcess -> {
                    return existingProcess;
                }
            )
            .map(processRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Process> findAll() {
        log.debug("Request to get all Processes");
        return processRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Process> findOne(Long id) {
        log.debug("Request to get Process : {}", id);
        return processRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Process : {}", id);
        processRepository.deleteById(id);
    }
}
