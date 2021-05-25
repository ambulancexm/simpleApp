package com.cell.entity.service;

import com.cell.entity.domain.MxCell;
import com.cell.entity.repository.MxCellRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link MxCell}.
 */
@Service
@Transactional
public class MxCellService {

    private final Logger log = LoggerFactory.getLogger(MxCellService.class);

    private final MxCellRepository mxCellRepository;

    public MxCellService(MxCellRepository mxCellRepository) {
        this.mxCellRepository = mxCellRepository;
    }

    /**
     * Save a mxCell.
     *
     * @param mxCell the entity to save.
     * @return the persisted entity.
     */
    public MxCell save(MxCell mxCell) {
        log.debug("Request to save MxCell : {}", mxCell);
        return mxCellRepository.save(mxCell);
    }

    /**
     * Partially update a mxCell.
     *
     * @param mxCell the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<MxCell> partialUpdate(MxCell mxCell) {
        log.debug("Request to partially update MxCell : {}", mxCell);

        return mxCellRepository
            .findById(mxCell.getId())
            .map(
                existingMxCell -> {
                    if (mxCell.getLg() != null) {
                        existingMxCell.setLg(mxCell.getLg());
                    }
                    if (mxCell.getStyle() != null) {
                        existingMxCell.setStyle(mxCell.getStyle());
                    }
                    if (mxCell.getValue() != null) {
                        existingMxCell.setValue(mxCell.getValue());
                    }
                    if (mxCell.getParent() != null) {
                        existingMxCell.setParent(mxCell.getParent());
                    }
                    if (mxCell.getSource() != null) {
                        existingMxCell.setSource(mxCell.getSource());
                    }
                    if (mxCell.getTarget() != null) {
                        existingMxCell.setTarget(mxCell.getTarget());
                    }

                    return existingMxCell;
                }
            )
            .map(mxCellRepository::save);
    }

    /**
     * Get all the mxCells.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<MxCell> findAll(Pageable pageable) {
        log.debug("Request to get all MxCells");
        return mxCellRepository.findAll(pageable);
    }

    /**
     * Get one mxCell by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<MxCell> findOne(Long id) {
        log.debug("Request to get MxCell : {}", id);
        return mxCellRepository.findById(id);
    }

    /**
     * Delete the mxCell by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete MxCell : {}", id);
        mxCellRepository.deleteById(id);
    }
}
