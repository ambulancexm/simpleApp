package com.myapp.web.rest;

import com.myapp.domain.MxCell;
import com.myapp.repository.MxCellRepository;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.myapp.domain.MxCell}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MxCellResource {

    private final Logger log = LoggerFactory.getLogger(MxCellResource.class);

    private static final String ENTITY_NAME = "mxCell";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MxCellRepository mxCellRepository;

    public MxCellResource(MxCellRepository mxCellRepository) {
        this.mxCellRepository = mxCellRepository;
    }

    /**
     * {@code POST  /mx-cells} : Create a new mxCell.
     *
     * @param mxCell the mxCell to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mxCell, or with status {@code 400 (Bad Request)} if the mxCell has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mx-cells")
    public ResponseEntity<MxCell> createMxCell(@RequestBody MxCell mxCell) throws URISyntaxException {
        log.debug("REST request to save MxCell : {}", mxCell);
        if (mxCell.getId() != null) {
            throw new BadRequestAlertException("A new mxCell cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MxCell result = mxCellRepository.save(mxCell);
        return ResponseEntity
            .created(new URI("/api/mx-cells/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mx-cells/:id} : Updates an existing mxCell.
     *
     * @param id the id of the mxCell to save.
     * @param mxCell the mxCell to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mxCell,
     * or with status {@code 400 (Bad Request)} if the mxCell is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mxCell couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mx-cells/{id}")
    public ResponseEntity<MxCell> updateMxCell(@PathVariable(value = "id", required = false) final Long id, @RequestBody MxCell mxCell)
        throws URISyntaxException {
        log.debug("REST request to update MxCell : {}, {}", id, mxCell);
        if (mxCell.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mxCell.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mxCellRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MxCell result = mxCellRepository.save(mxCell);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mxCell.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mx-cells/:id} : Partial updates given fields of an existing mxCell, field will ignore if it is null
     *
     * @param id the id of the mxCell to save.
     * @param mxCell the mxCell to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mxCell,
     * or with status {@code 400 (Bad Request)} if the mxCell is not valid,
     * or with status {@code 404 (Not Found)} if the mxCell is not found,
     * or with status {@code 500 (Internal Server Error)} if the mxCell couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mx-cells/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<MxCell> partialUpdateMxCell(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MxCell mxCell
    ) throws URISyntaxException {
        log.debug("REST request to partial update MxCell partially : {}, {}", id, mxCell);
        if (mxCell.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mxCell.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mxCellRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MxCell> result = mxCellRepository
            .findById(mxCell.getId())
            .map(
                existingMxCell -> {
                    if (mxCell.getLg() != null) {
                        existingMxCell.setLg(mxCell.getLg());
                    }
                    if (mxCell.getStyle() != null) {
                        existingMxCell.setStyle(mxCell.getStyle());
                    }

                    return existingMxCell;
                }
            )
            .map(mxCellRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mxCell.getId().toString())
        );
    }

    /**
     * {@code GET  /mx-cells} : get all the mxCells.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mxCells in body.
     */
    @GetMapping("/mx-cells")
    public List<MxCell> getAllMxCells() {
        log.debug("REST request to get all MxCells");
        return mxCellRepository.findAll();
    }

    /**
     * {@code GET  /mx-cells/:id} : get the "id" mxCell.
     *
     * @param id the id of the mxCell to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mxCell, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mx-cells/{id}")
    public ResponseEntity<MxCell> getMxCell(@PathVariable Long id) {
        log.debug("REST request to get MxCell : {}", id);
        Optional<MxCell> mxCell = mxCellRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mxCell);
    }

    /**
     * {@code DELETE  /mx-cells/:id} : delete the "id" mxCell.
     *
     * @param id the id of the mxCell to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mx-cells/{id}")
    public ResponseEntity<Void> deleteMxCell(@PathVariable Long id) {
        log.debug("REST request to delete MxCell : {}", id);
        mxCellRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
