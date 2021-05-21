package com.myapp.web.rest;

import com.myapp.domain.Process;
import com.myapp.repository.ProcessRepository;
import com.myapp.service.ProcessService;
import com.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.myapp.domain.Process}.
 */
@RestController
@RequestMapping("/api")
public class ProcessResource {

    private final Logger log = LoggerFactory.getLogger(ProcessResource.class);

    private static final String ENTITY_NAME = "process";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProcessService processService;

    private final ProcessRepository processRepository;

    public ProcessResource(ProcessService processService, ProcessRepository processRepository) {
        this.processService = processService;
        this.processRepository = processRepository;
    }

    /**
     * {@code POST  /processes} : Create a new process.
     *
     * @param process the process to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new process, or with status {@code 400 (Bad Request)} if the process has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/processes")
    public ResponseEntity<Process> createProcess(@RequestBody Process process) throws URISyntaxException {
        log.debug("REST request to save Process : {}", process);
        if (process.getId() != null) {
            throw new BadRequestAlertException("A new process cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Process result = processService.save(process);
        return ResponseEntity
            .created(new URI("/api/processes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /processes/:id} : Updates an existing process.
     *
     * @param id the id of the process to save.
     * @param process the process to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated process,
     * or with status {@code 400 (Bad Request)} if the process is not valid,
     * or with status {@code 500 (Internal Server Error)} if the process couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/processes/{id}")
    public ResponseEntity<Process> updateProcess(@PathVariable(value = "id", required = false) final Long id, @RequestBody Process process)
        throws URISyntaxException {
        log.debug("REST request to update Process : {}, {}", id, process);
        if (process.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, process.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!processRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Process result = processService.save(process);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, process.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /processes/:id} : Partial updates given fields of an existing process, field will ignore if it is null
     *
     * @param id the id of the process to save.
     * @param process the process to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated process,
     * or with status {@code 400 (Bad Request)} if the process is not valid,
     * or with status {@code 404 (Not Found)} if the process is not found,
     * or with status {@code 500 (Internal Server Error)} if the process couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/processes/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Process> partialUpdateProcess(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Process process
    ) throws URISyntaxException {
        log.debug("REST request to partial update Process partially : {}, {}", id, process);
        if (process.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, process.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!processRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Process> result = processService.partialUpdate(process);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, process.getId().toString())
        );
    }

    /**
     * {@code GET  /processes} : get all the processes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of processes in body.
     */
    @GetMapping("/processes")
    public List<Process> getAllProcesses() {
        log.debug("REST request to get all Processes");
        return processService.findAll();
    }

    /**
     * {@code GET  /processes/:id} : get the "id" process.
     *
     * @param id the id of the process to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the process, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/processes/{id}")
    public ResponseEntity<Process> getProcess(@PathVariable Long id) {
        log.debug("REST request to get Process : {}", id);
        Optional<Process> process = processService.findOne(id);
        return ResponseUtil.wrapOrNotFound(process);
    }

    /**
     * {@code DELETE  /processes/:id} : delete the "id" process.
     *
     * @param id the id of the process to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/processes/{id}")
    public ResponseEntity<Void> deleteProcess(@PathVariable Long id) {
        log.debug("REST request to delete Process : {}", id);
        processService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
