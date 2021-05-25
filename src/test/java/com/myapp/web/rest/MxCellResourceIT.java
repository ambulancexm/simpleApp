package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.MxCell;
import com.myapp.repository.MxCellRepository;
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
 * Integration tests for the {@link MxCellResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MxCellResourceIT {

    private static final String DEFAULT_LG = "AAAAAAAAAA";
    private static final String UPDATED_LG = "BBBBBBBBBB";

    private static final String DEFAULT_STYLE = "AAAAAAAAAA";
    private static final String UPDATED_STYLE = "BBBBBBBBBB";

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    private static final String DEFAULT_PARENT = "AAAAAAAAAA";
    private static final String UPDATED_PARENT = "BBBBBBBBBB";

    private static final String DEFAULT_SOURCE = "AAAAAAAAAA";
    private static final String UPDATED_SOURCE = "BBBBBBBBBB";

    private static final String DEFAULT_TARGET = "AAAAAAAAAA";
    private static final String UPDATED_TARGET = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/mx-cells";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MxCellRepository mxCellRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMxCellMockMvc;

    private MxCell mxCell;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MxCell createEntity(EntityManager em) {
        MxCell mxCell = new MxCell()
            .lg(DEFAULT_LG)
            .style(DEFAULT_STYLE)
            .value(DEFAULT_VALUE)
            .parent(DEFAULT_PARENT)
            .source(DEFAULT_SOURCE)
            .target(DEFAULT_TARGET);
        return mxCell;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MxCell createUpdatedEntity(EntityManager em) {
        MxCell mxCell = new MxCell()
            .lg(UPDATED_LG)
            .style(UPDATED_STYLE)
            .value(UPDATED_VALUE)
            .parent(UPDATED_PARENT)
            .source(UPDATED_SOURCE)
            .target(UPDATED_TARGET);
        return mxCell;
    }

    @BeforeEach
    public void initTest() {
        mxCell = createEntity(em);
    }

    @Test
    @Transactional
    void createMxCell() throws Exception {
        int databaseSizeBeforeCreate = mxCellRepository.findAll().size();
        // Create the MxCell
        restMxCellMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mxCell)))
            .andExpect(status().isCreated());

        // Validate the MxCell in the database
        List<MxCell> mxCellList = mxCellRepository.findAll();
        assertThat(mxCellList).hasSize(databaseSizeBeforeCreate + 1);
        MxCell testMxCell = mxCellList.get(mxCellList.size() - 1);
        assertThat(testMxCell.getLg()).isEqualTo(DEFAULT_LG);
        assertThat(testMxCell.getStyle()).isEqualTo(DEFAULT_STYLE);
        assertThat(testMxCell.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testMxCell.getParent()).isEqualTo(DEFAULT_PARENT);
        assertThat(testMxCell.getSource()).isEqualTo(DEFAULT_SOURCE);
        assertThat(testMxCell.getTarget()).isEqualTo(DEFAULT_TARGET);
    }

    @Test
    @Transactional
    void createMxCellWithExistingId() throws Exception {
        // Create the MxCell with an existing ID
        mxCell.setId(1L);

        int databaseSizeBeforeCreate = mxCellRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMxCellMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mxCell)))
            .andExpect(status().isBadRequest());

        // Validate the MxCell in the database
        List<MxCell> mxCellList = mxCellRepository.findAll();
        assertThat(mxCellList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMxCells() throws Exception {
        // Initialize the database
        mxCellRepository.saveAndFlush(mxCell);

        // Get all the mxCellList
        restMxCellMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mxCell.getId().intValue())))
            .andExpect(jsonPath("$.[*].lg").value(hasItem(DEFAULT_LG)))
            .andExpect(jsonPath("$.[*].style").value(hasItem(DEFAULT_STYLE)))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE)))
            .andExpect(jsonPath("$.[*].parent").value(hasItem(DEFAULT_PARENT)))
            .andExpect(jsonPath("$.[*].source").value(hasItem(DEFAULT_SOURCE)))
            .andExpect(jsonPath("$.[*].target").value(hasItem(DEFAULT_TARGET)));
    }

    @Test
    @Transactional
    void getMxCell() throws Exception {
        // Initialize the database
        mxCellRepository.saveAndFlush(mxCell);

        // Get the mxCell
        restMxCellMockMvc
            .perform(get(ENTITY_API_URL_ID, mxCell.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mxCell.getId().intValue()))
            .andExpect(jsonPath("$.lg").value(DEFAULT_LG))
            .andExpect(jsonPath("$.style").value(DEFAULT_STYLE))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE))
            .andExpect(jsonPath("$.parent").value(DEFAULT_PARENT))
            .andExpect(jsonPath("$.source").value(DEFAULT_SOURCE))
            .andExpect(jsonPath("$.target").value(DEFAULT_TARGET));
    }

    @Test
    @Transactional
    void getNonExistingMxCell() throws Exception {
        // Get the mxCell
        restMxCellMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMxCell() throws Exception {
        // Initialize the database
        mxCellRepository.saveAndFlush(mxCell);

        int databaseSizeBeforeUpdate = mxCellRepository.findAll().size();

        // Update the mxCell
        MxCell updatedMxCell = mxCellRepository.findById(mxCell.getId()).get();
        // Disconnect from session so that the updates on updatedMxCell are not directly saved in db
        em.detach(updatedMxCell);
        updatedMxCell
            .lg(UPDATED_LG)
            .style(UPDATED_STYLE)
            .value(UPDATED_VALUE)
            .parent(UPDATED_PARENT)
            .source(UPDATED_SOURCE)
            .target(UPDATED_TARGET);

        restMxCellMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMxCell.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMxCell))
            )
            .andExpect(status().isOk());

        // Validate the MxCell in the database
        List<MxCell> mxCellList = mxCellRepository.findAll();
        assertThat(mxCellList).hasSize(databaseSizeBeforeUpdate);
        MxCell testMxCell = mxCellList.get(mxCellList.size() - 1);
        assertThat(testMxCell.getLg()).isEqualTo(UPDATED_LG);
        assertThat(testMxCell.getStyle()).isEqualTo(UPDATED_STYLE);
        assertThat(testMxCell.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testMxCell.getParent()).isEqualTo(UPDATED_PARENT);
        assertThat(testMxCell.getSource()).isEqualTo(UPDATED_SOURCE);
        assertThat(testMxCell.getTarget()).isEqualTo(UPDATED_TARGET);
    }

    @Test
    @Transactional
    void putNonExistingMxCell() throws Exception {
        int databaseSizeBeforeUpdate = mxCellRepository.findAll().size();
        mxCell.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMxCellMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mxCell.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mxCell))
            )
            .andExpect(status().isBadRequest());

        // Validate the MxCell in the database
        List<MxCell> mxCellList = mxCellRepository.findAll();
        assertThat(mxCellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMxCell() throws Exception {
        int databaseSizeBeforeUpdate = mxCellRepository.findAll().size();
        mxCell.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMxCellMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mxCell))
            )
            .andExpect(status().isBadRequest());

        // Validate the MxCell in the database
        List<MxCell> mxCellList = mxCellRepository.findAll();
        assertThat(mxCellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMxCell() throws Exception {
        int databaseSizeBeforeUpdate = mxCellRepository.findAll().size();
        mxCell.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMxCellMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mxCell)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MxCell in the database
        List<MxCell> mxCellList = mxCellRepository.findAll();
        assertThat(mxCellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMxCellWithPatch() throws Exception {
        // Initialize the database
        mxCellRepository.saveAndFlush(mxCell);

        int databaseSizeBeforeUpdate = mxCellRepository.findAll().size();

        // Update the mxCell using partial update
        MxCell partialUpdatedMxCell = new MxCell();
        partialUpdatedMxCell.setId(mxCell.getId());

        partialUpdatedMxCell.lg(UPDATED_LG).value(UPDATED_VALUE).parent(UPDATED_PARENT).target(UPDATED_TARGET);

        restMxCellMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMxCell.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMxCell))
            )
            .andExpect(status().isOk());

        // Validate the MxCell in the database
        List<MxCell> mxCellList = mxCellRepository.findAll();
        assertThat(mxCellList).hasSize(databaseSizeBeforeUpdate);
        MxCell testMxCell = mxCellList.get(mxCellList.size() - 1);
        assertThat(testMxCell.getLg()).isEqualTo(UPDATED_LG);
        assertThat(testMxCell.getStyle()).isEqualTo(DEFAULT_STYLE);
        assertThat(testMxCell.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testMxCell.getParent()).isEqualTo(UPDATED_PARENT);
        assertThat(testMxCell.getSource()).isEqualTo(DEFAULT_SOURCE);
        assertThat(testMxCell.getTarget()).isEqualTo(UPDATED_TARGET);
    }

    @Test
    @Transactional
    void fullUpdateMxCellWithPatch() throws Exception {
        // Initialize the database
        mxCellRepository.saveAndFlush(mxCell);

        int databaseSizeBeforeUpdate = mxCellRepository.findAll().size();

        // Update the mxCell using partial update
        MxCell partialUpdatedMxCell = new MxCell();
        partialUpdatedMxCell.setId(mxCell.getId());

        partialUpdatedMxCell
            .lg(UPDATED_LG)
            .style(UPDATED_STYLE)
            .value(UPDATED_VALUE)
            .parent(UPDATED_PARENT)
            .source(UPDATED_SOURCE)
            .target(UPDATED_TARGET);

        restMxCellMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMxCell.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMxCell))
            )
            .andExpect(status().isOk());

        // Validate the MxCell in the database
        List<MxCell> mxCellList = mxCellRepository.findAll();
        assertThat(mxCellList).hasSize(databaseSizeBeforeUpdate);
        MxCell testMxCell = mxCellList.get(mxCellList.size() - 1);
        assertThat(testMxCell.getLg()).isEqualTo(UPDATED_LG);
        assertThat(testMxCell.getStyle()).isEqualTo(UPDATED_STYLE);
        assertThat(testMxCell.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testMxCell.getParent()).isEqualTo(UPDATED_PARENT);
        assertThat(testMxCell.getSource()).isEqualTo(UPDATED_SOURCE);
        assertThat(testMxCell.getTarget()).isEqualTo(UPDATED_TARGET);
    }

    @Test
    @Transactional
    void patchNonExistingMxCell() throws Exception {
        int databaseSizeBeforeUpdate = mxCellRepository.findAll().size();
        mxCell.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMxCellMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mxCell.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mxCell))
            )
            .andExpect(status().isBadRequest());

        // Validate the MxCell in the database
        List<MxCell> mxCellList = mxCellRepository.findAll();
        assertThat(mxCellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMxCell() throws Exception {
        int databaseSizeBeforeUpdate = mxCellRepository.findAll().size();
        mxCell.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMxCellMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mxCell))
            )
            .andExpect(status().isBadRequest());

        // Validate the MxCell in the database
        List<MxCell> mxCellList = mxCellRepository.findAll();
        assertThat(mxCellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMxCell() throws Exception {
        int databaseSizeBeforeUpdate = mxCellRepository.findAll().size();
        mxCell.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMxCellMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(mxCell)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MxCell in the database
        List<MxCell> mxCellList = mxCellRepository.findAll();
        assertThat(mxCellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMxCell() throws Exception {
        // Initialize the database
        mxCellRepository.saveAndFlush(mxCell);

        int databaseSizeBeforeDelete = mxCellRepository.findAll().size();

        // Delete the mxCell
        restMxCellMockMvc
            .perform(delete(ENTITY_API_URL_ID, mxCell.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MxCell> mxCellList = mxCellRepository.findAll();
        assertThat(mxCellList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
