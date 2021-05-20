package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.Cell;
import com.myapp.repository.CellRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CellResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CellResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_AGE = 1;
    private static final Integer UPDATED_AGE = 2;

    private static final String ENTITY_API_URL = "/api/cells";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CellRepository cellRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCellMockMvc;

    private Cell cell;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cell createEntity(EntityManager em) {
        Cell cell = new Cell().name(DEFAULT_NAME).age(DEFAULT_AGE);
        return cell;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cell createUpdatedEntity(EntityManager em) {
        Cell cell = new Cell().name(UPDATED_NAME).age(UPDATED_AGE);
        return cell;
    }

    @BeforeEach
    public void initTest() {
        cell = createEntity(em);
    }

    @Test
    @Transactional
    void createCell() throws Exception {
        int databaseSizeBeforeCreate = cellRepository.findAll().size();
        // Create the Cell
        restCellMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cell)))
            .andExpect(status().isCreated());

        // Validate the Cell in the database
        List<Cell> cellList = cellRepository.findAll();
        assertThat(cellList).hasSize(databaseSizeBeforeCreate + 1);
        Cell testCell = cellList.get(cellList.size() - 1);
        assertThat(testCell.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCell.getAge()).isEqualTo(DEFAULT_AGE);
    }

    @Test
    @Transactional
    void createCellWithExistingId() throws Exception {
        // Create the Cell with an existing ID
        cell.setId(1L);

        int databaseSizeBeforeCreate = cellRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCellMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cell)))
            .andExpect(status().isBadRequest());

        // Validate the Cell in the database
        List<Cell> cellList = cellRepository.findAll();
        assertThat(cellList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCells() throws Exception {
        // Initialize the database
        cellRepository.saveAndFlush(cell);

        // Get all the cellList
        restCellMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cell.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].age").value(hasItem(DEFAULT_AGE)));
    }

    @Test
    @Transactional
    void getCell() throws Exception {
        // Initialize the database
        cellRepository.saveAndFlush(cell);

        // Get the cell
        restCellMockMvc
            .perform(get(ENTITY_API_URL_ID, cell.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(cell.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.age").value(DEFAULT_AGE));
    }

    @Test
    @Transactional
    void getNonExistingCell() throws Exception {
        // Get the cell
        restCellMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCell() throws Exception {
        // Initialize the database
        cellRepository.saveAndFlush(cell);

        int databaseSizeBeforeUpdate = cellRepository.findAll().size();

        // Update the cell
        Cell updatedCell = cellRepository.findById(cell.getId()).get();
        // Disconnect from session so that the updates on updatedCell are not directly saved in db
        em.detach(updatedCell);
        updatedCell.name(UPDATED_NAME).age(UPDATED_AGE);

        restCellMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCell.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCell))
            )
            .andExpect(status().isOk());

        // Validate the Cell in the database
        List<Cell> cellList = cellRepository.findAll();
        assertThat(cellList).hasSize(databaseSizeBeforeUpdate);
        Cell testCell = cellList.get(cellList.size() - 1);
        assertThat(testCell.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCell.getAge()).isEqualTo(UPDATED_AGE);
    }

    @Test
    @Transactional
    void putNonExistingCell() throws Exception {
        int databaseSizeBeforeUpdate = cellRepository.findAll().size();
        cell.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCellMockMvc
            .perform(
                put(ENTITY_API_URL_ID, cell.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(cell))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cell in the database
        List<Cell> cellList = cellRepository.findAll();
        assertThat(cellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCell() throws Exception {
        int databaseSizeBeforeUpdate = cellRepository.findAll().size();
        cell.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCellMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(cell))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cell in the database
        List<Cell> cellList = cellRepository.findAll();
        assertThat(cellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCell() throws Exception {
        int databaseSizeBeforeUpdate = cellRepository.findAll().size();
        cell.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCellMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cell)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cell in the database
        List<Cell> cellList = cellRepository.findAll();
        assertThat(cellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCellWithPatch() throws Exception {
        // Initialize the database
        cellRepository.saveAndFlush(cell);

        int databaseSizeBeforeUpdate = cellRepository.findAll().size();

        // Update the cell using partial update
        Cell partialUpdatedCell = new Cell();
        partialUpdatedCell.setId(cell.getId());

        partialUpdatedCell.name(UPDATED_NAME).age(UPDATED_AGE);

        restCellMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCell.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCell))
            )
            .andExpect(status().isOk());

        // Validate the Cell in the database
        List<Cell> cellList = cellRepository.findAll();
        assertThat(cellList).hasSize(databaseSizeBeforeUpdate);
        Cell testCell = cellList.get(cellList.size() - 1);
        assertThat(testCell.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCell.getAge()).isEqualTo(UPDATED_AGE);
    }

    @Test
    @Transactional
    void fullUpdateCellWithPatch() throws Exception {
        // Initialize the database
        cellRepository.saveAndFlush(cell);

        int databaseSizeBeforeUpdate = cellRepository.findAll().size();

        // Update the cell using partial update
        Cell partialUpdatedCell = new Cell();
        partialUpdatedCell.setId(cell.getId());

        partialUpdatedCell.name(UPDATED_NAME).age(UPDATED_AGE);

        restCellMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCell.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCell))
            )
            .andExpect(status().isOk());

        // Validate the Cell in the database
        List<Cell> cellList = cellRepository.findAll();
        assertThat(cellList).hasSize(databaseSizeBeforeUpdate);
        Cell testCell = cellList.get(cellList.size() - 1);
        assertThat(testCell.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCell.getAge()).isEqualTo(UPDATED_AGE);
    }

    @Test
    @Transactional
    void patchNonExistingCell() throws Exception {
        int databaseSizeBeforeUpdate = cellRepository.findAll().size();
        cell.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCellMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, cell.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(cell))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cell in the database
        List<Cell> cellList = cellRepository.findAll();
        assertThat(cellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCell() throws Exception {
        int databaseSizeBeforeUpdate = cellRepository.findAll().size();
        cell.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCellMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(cell))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cell in the database
        List<Cell> cellList = cellRepository.findAll();
        assertThat(cellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCell() throws Exception {
        int databaseSizeBeforeUpdate = cellRepository.findAll().size();
        cell.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCellMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(cell)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cell in the database
        List<Cell> cellList = cellRepository.findAll();
        assertThat(cellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCell() throws Exception {
        // Initialize the database
        cellRepository.saveAndFlush(cell);

        int databaseSizeBeforeDelete = cellRepository.findAll().size();

        // Delete the cell
        restCellMockMvc
            .perform(delete(ENTITY_API_URL_ID, cell.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Cell> cellList = cellRepository.findAll();
        assertThat(cellList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
