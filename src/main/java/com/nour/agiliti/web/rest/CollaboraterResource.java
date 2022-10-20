package com.nour.agiliti.web.rest;

import com.nour.agiliti.domain.Collaborater;
import com.nour.agiliti.repository.CollaboraterRepository;
import com.nour.agiliti.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link com.nour.agiliti.domain.Collaborater}.
 */
@RestController
@RequestMapping("/api")
public class CollaboraterResource {

    private final Logger log = LoggerFactory.getLogger(CollaboraterResource.class);

    private static final String ENTITY_NAME = "collaborater";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CollaboraterRepository collaboraterRepository;

    public CollaboraterResource(CollaboraterRepository collaboraterRepository) {
        this.collaboraterRepository = collaboraterRepository;
    }

    /**
     * {@code POST  /collaboraters} : Create a new collaborater.
     *
     * @param collaborater the collaborater to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new collaborater, or with status {@code 400 (Bad Request)} if the collaborater has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/collaboraters")
    public ResponseEntity<Collaborater> createCollaborater(@RequestBody Collaborater collaborater) throws URISyntaxException {
        log.debug("REST request to save Collaborater : {}", collaborater);
        if (collaborater.getId() != null) {
            throw new BadRequestAlertException("A new collaborater cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Collaborater result = collaboraterRepository.save(collaborater);
        return ResponseEntity
            .created(new URI("/api/collaboraters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /collaboraters/:id} : Updates an existing collaborater.
     *
     * @param id the id of the collaborater to save.
     * @param collaborater the collaborater to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated collaborater,
     * or with status {@code 400 (Bad Request)} if the collaborater is not valid,
     * or with status {@code 500 (Internal Server Error)} if the collaborater couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/collaboraters/{id}")
    public ResponseEntity<Collaborater> updateCollaborater(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Collaborater collaborater
    ) throws URISyntaxException {
        log.debug("REST request to update Collaborater : {}, {}", id, collaborater);
        if (collaborater.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, collaborater.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!collaboraterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Collaborater result = collaboraterRepository.save(collaborater);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, collaborater.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /collaboraters/:id} : Partial updates given fields of an existing collaborater, field will ignore if it is null
     *
     * @param id the id of the collaborater to save.
     * @param collaborater the collaborater to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated collaborater,
     * or with status {@code 400 (Bad Request)} if the collaborater is not valid,
     * or with status {@code 404 (Not Found)} if the collaborater is not found,
     * or with status {@code 500 (Internal Server Error)} if the collaborater couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/collaboraters/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Collaborater> partialUpdateCollaborater(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Collaborater collaborater
    ) throws URISyntaxException {
        log.debug("REST request to partial update Collaborater partially : {}, {}", id, collaborater);
        if (collaborater.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, collaborater.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!collaboraterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Collaborater> result = collaboraterRepository
            .findById(collaborater.getId())
            .map(existingCollaborater -> {
                if (collaborater.getName() != null) {
                    existingCollaborater.setName(collaborater.getName());
                }
                if (collaborater.getCreationDate() != null) {
                    existingCollaborater.setCreationDate(collaborater.getCreationDate());
                }
                if (collaborater.getArchived() != null) {
                    existingCollaborater.setArchived(collaborater.getArchived());
                }

                return existingCollaborater;
            })
            .map(collaboraterRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, collaborater.getId().toString())
        );
    }

    /**
     * {@code GET  /collaboraters} : get all the collaboraters.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of collaboraters in body.
     */
    @GetMapping("/collaboraters")
    public List<Collaborater> getAllCollaboraters() {
        log.debug("REST request to get all Collaboraters");
        return collaboraterRepository.findAll();
    }

    /**
     * {@code GET  /collaboraters/:id} : get the "id" collaborater.
     *
     * @param id the id of the collaborater to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the collaborater, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/collaboraters/{id}")
    public ResponseEntity<Collaborater> getCollaborater(@PathVariable Long id) {
        log.debug("REST request to get Collaborater : {}", id);
        Optional<Collaborater> collaborater = collaboraterRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(collaborater);
    }

    /**
     * {@code DELETE  /collaboraters/:id} : delete the "id" collaborater.
     *
     * @param id the id of the collaborater to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/collaboraters/{id}")
    public ResponseEntity<Void> deleteCollaborater(@PathVariable Long id) {
        log.debug("REST request to delete Collaborater : {}", id);
        collaboraterRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
