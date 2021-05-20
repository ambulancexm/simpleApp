package com.myapp.web.rest;

import com.myapp.domain.Gateway;
import com.myapp.repository.GatewayRepository;
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
 * REST controller for managing {@link com.myapp.domain.Gateway}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GatewayResource {

    private final Logger log = LoggerFactory.getLogger(GatewayResource.class);

    private static final String ENTITY_NAME = "gateway";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GatewayRepository gatewayRepository;

    public GatewayResource(GatewayRepository gatewayRepository) {
        this.gatewayRepository = gatewayRepository;
    }

    /**
     * {@code POST  /gateways} : Create a new gateway.
     *
     * @param gateway the gateway to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gateway, or with status {@code 400 (Bad Request)} if the gateway has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/gateways")
    public ResponseEntity<Gateway> createGateway(@RequestBody Gateway gateway) throws URISyntaxException {
        log.debug("REST request to save Gateway : {}", gateway);
        if (gateway.getId() != null) {
            throw new BadRequestAlertException("A new gateway cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Gateway result = gatewayRepository.save(gateway);
        return ResponseEntity
            .created(new URI("/api/gateways/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /gateways/:id} : Updates an existing gateway.
     *
     * @param id the id of the gateway to save.
     * @param gateway the gateway to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gateway,
     * or with status {@code 400 (Bad Request)} if the gateway is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gateway couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/gateways/{id}")
    public ResponseEntity<Gateway> updateGateway(@PathVariable(value = "id", required = false) final Long id, @RequestBody Gateway gateway)
        throws URISyntaxException {
        log.debug("REST request to update Gateway : {}, {}", id, gateway);
        if (gateway.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gateway.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gatewayRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Gateway result = gatewayRepository.save(gateway);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gateway.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /gateways/:id} : Partial updates given fields of an existing gateway, field will ignore if it is null
     *
     * @param id the id of the gateway to save.
     * @param gateway the gateway to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gateway,
     * or with status {@code 400 (Bad Request)} if the gateway is not valid,
     * or with status {@code 404 (Not Found)} if the gateway is not found,
     * or with status {@code 500 (Internal Server Error)} if the gateway couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/gateways/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Gateway> partialUpdateGateway(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Gateway gateway
    ) throws URISyntaxException {
        log.debug("REST request to partial update Gateway partially : {}, {}", id, gateway);
        if (gateway.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gateway.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gatewayRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Gateway> result = gatewayRepository
            .findById(gateway.getId())
            .map(
                existingGateway -> {
                    return existingGateway;
                }
            )
            .map(gatewayRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gateway.getId().toString())
        );
    }

    /**
     * {@code GET  /gateways} : get all the gateways.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of gateways in body.
     */
    @GetMapping("/gateways")
    public List<Gateway> getAllGateways() {
        log.debug("REST request to get all Gateways");
        return gatewayRepository.findAll();
    }

    /**
     * {@code GET  /gateways/:id} : get the "id" gateway.
     *
     * @param id the id of the gateway to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gateway, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/gateways/{id}")
    public ResponseEntity<Gateway> getGateway(@PathVariable Long id) {
        log.debug("REST request to get Gateway : {}", id);
        Optional<Gateway> gateway = gatewayRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(gateway);
    }

    /**
     * {@code DELETE  /gateways/:id} : delete the "id" gateway.
     *
     * @param id the id of the gateway to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/gateways/{id}")
    public ResponseEntity<Void> deleteGateway(@PathVariable Long id) {
        log.debug("REST request to delete Gateway : {}", id);
        gatewayRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
