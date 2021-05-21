package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.Gateway;
import com.myapp.repository.GatewayRepository;
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
 * Integration tests for the {@link GatewayResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GatewayResourceIT {

    private static final String ENTITY_API_URL = "/api/gateways";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GatewayRepository gatewayRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGatewayMockMvc;

    private Gateway gateway;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Gateway createEntity(EntityManager em) {
        Gateway gateway = new Gateway();
        return gateway;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Gateway createUpdatedEntity(EntityManager em) {
        Gateway gateway = new Gateway();
        return gateway;
    }

    @BeforeEach
    public void initTest() {
        gateway = createEntity(em);
    }

    @Test
    @Transactional
    void createGateway() throws Exception {
        int databaseSizeBeforeCreate = gatewayRepository.findAll().size();
        // Create the Gateway
        restGatewayMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gateway)))
            .andExpect(status().isCreated());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeCreate + 1);
        Gateway testGateway = gatewayList.get(gatewayList.size() - 1);
    }

    @Test
    @Transactional
    void createGatewayWithExistingId() throws Exception {
        // Create the Gateway with an existing ID
        gateway.setId(1L);

        int databaseSizeBeforeCreate = gatewayRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGatewayMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gateway)))
            .andExpect(status().isBadRequest());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGateways() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get all the gatewayList
        restGatewayMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gateway.getId().intValue())));
    }

    @Test
    @Transactional
    void getGateway() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        // Get the gateway
        restGatewayMockMvc
            .perform(get(ENTITY_API_URL_ID, gateway.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(gateway.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingGateway() throws Exception {
        // Get the gateway
        restGatewayMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewGateway() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();

        // Update the gateway
        Gateway updatedGateway = gatewayRepository.findById(gateway.getId()).get();
        // Disconnect from session so that the updates on updatedGateway are not directly saved in db
        em.detach(updatedGateway);

        restGatewayMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGateway.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGateway))
            )
            .andExpect(status().isOk());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
        Gateway testGateway = gatewayList.get(gatewayList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingGateway() throws Exception {
        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();
        gateway.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGatewayMockMvc
            .perform(
                put(ENTITY_API_URL_ID, gateway.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gateway))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGateway() throws Exception {
        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();
        gateway.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGatewayMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gateway))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGateway() throws Exception {
        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();
        gateway.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGatewayMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gateway)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGatewayWithPatch() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();

        // Update the gateway using partial update
        Gateway partialUpdatedGateway = new Gateway();
        partialUpdatedGateway.setId(gateway.getId());

        restGatewayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGateway.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGateway))
            )
            .andExpect(status().isOk());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
        Gateway testGateway = gatewayList.get(gatewayList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateGatewayWithPatch() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();

        // Update the gateway using partial update
        Gateway partialUpdatedGateway = new Gateway();
        partialUpdatedGateway.setId(gateway.getId());

        restGatewayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGateway.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGateway))
            )
            .andExpect(status().isOk());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
        Gateway testGateway = gatewayList.get(gatewayList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingGateway() throws Exception {
        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();
        gateway.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGatewayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, gateway.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gateway))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGateway() throws Exception {
        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();
        gateway.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGatewayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gateway))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGateway() throws Exception {
        int databaseSizeBeforeUpdate = gatewayRepository.findAll().size();
        gateway.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGatewayMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(gateway)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Gateway in the database
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGateway() throws Exception {
        // Initialize the database
        gatewayRepository.saveAndFlush(gateway);

        int databaseSizeBeforeDelete = gatewayRepository.findAll().size();

        // Delete the gateway
        restGatewayMockMvc
            .perform(delete(ENTITY_API_URL_ID, gateway.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Gateway> gatewayList = gatewayRepository.findAll();
        assertThat(gatewayList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
