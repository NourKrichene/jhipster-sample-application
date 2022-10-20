package com.nour.agiliti.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.nour.agiliti.IntegrationTest;
import com.nour.agiliti.domain.Collaborater;
import com.nour.agiliti.repository.CollaboraterRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link CollaboraterResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CollaboraterResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATION_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATION_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_ARCHIVED = false;
    private static final Boolean UPDATED_ARCHIVED = true;

    private static final String ENTITY_API_URL = "/api/collaboraters";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CollaboraterRepository collaboraterRepository;

    @Autowired
    private MockMvc restCollaboraterMockMvc;

    private Collaborater collaborater;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Collaborater createEntity() {
        Collaborater collaborater = new Collaborater().name(DEFAULT_NAME).creationDate(DEFAULT_CREATION_DATE).archived(DEFAULT_ARCHIVED);
        return collaborater;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Collaborater createUpdatedEntity() {
        Collaborater collaborater = new Collaborater().name(UPDATED_NAME).creationDate(UPDATED_CREATION_DATE).archived(UPDATED_ARCHIVED);
        return collaborater;
    }

    @BeforeEach
    public void initTest() {
        collaboraterRepository.deleteAll();
        collaborater = createEntity();
    }

    @Test
    void createCollaborater() throws Exception {
        int databaseSizeBeforeCreate = collaboraterRepository.findAll().size();
        // Create the Collaborater
        restCollaboraterMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(collaborater)))
            .andExpect(status().isCreated());

        // Validate the Collaborater in the database
        List<Collaborater> collaboraterList = collaboraterRepository.findAll();
        assertThat(collaboraterList).hasSize(databaseSizeBeforeCreate + 1);
        Collaborater testCollaborater = collaboraterList.get(collaboraterList.size() - 1);
        assertThat(testCollaborater.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCollaborater.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
        assertThat(testCollaborater.getArchived()).isEqualTo(DEFAULT_ARCHIVED);
    }

    @Test
    void createCollaboraterWithExistingId() throws Exception {
        // Create the Collaborater with an existing ID
        collaborater.setId(1L);

        int databaseSizeBeforeCreate = collaboraterRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCollaboraterMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(collaborater)))
            .andExpect(status().isBadRequest());

        // Validate the Collaborater in the database
        List<Collaborater> collaboraterList = collaboraterRepository.findAll();
        assertThat(collaboraterList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllCollaboraters() throws Exception {
        // Initialize the database
        collaboraterRepository.save(collaborater);

        // Get all the collaboraterList
        restCollaboraterMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(collaborater.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].archived").value(hasItem(DEFAULT_ARCHIVED.booleanValue())));
    }

    @Test
    void getCollaborater() throws Exception {
        // Initialize the database
        collaboraterRepository.save(collaborater);

        // Get the collaborater
        restCollaboraterMockMvc
            .perform(get(ENTITY_API_URL_ID, collaborater.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(collaborater.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()))
            .andExpect(jsonPath("$.archived").value(DEFAULT_ARCHIVED.booleanValue()));
    }

    @Test
    void getNonExistingCollaborater() throws Exception {
        // Get the collaborater
        restCollaboraterMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingCollaborater() throws Exception {
        // Initialize the database
        collaboraterRepository.save(collaborater);

        int databaseSizeBeforeUpdate = collaboraterRepository.findAll().size();

        // Update the collaborater
        Collaborater updatedCollaborater = collaboraterRepository.findById(collaborater.getId()).get();
        updatedCollaborater.name(UPDATED_NAME).creationDate(UPDATED_CREATION_DATE).archived(UPDATED_ARCHIVED);

        restCollaboraterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCollaborater.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCollaborater))
            )
            .andExpect(status().isOk());

        // Validate the Collaborater in the database
        List<Collaborater> collaboraterList = collaboraterRepository.findAll();
        assertThat(collaboraterList).hasSize(databaseSizeBeforeUpdate);
        Collaborater testCollaborater = collaboraterList.get(collaboraterList.size() - 1);
        assertThat(testCollaborater.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCollaborater.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
        assertThat(testCollaborater.getArchived()).isEqualTo(UPDATED_ARCHIVED);
    }

    @Test
    void putNonExistingCollaborater() throws Exception {
        int databaseSizeBeforeUpdate = collaboraterRepository.findAll().size();
        collaborater.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCollaboraterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, collaborater.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(collaborater))
            )
            .andExpect(status().isBadRequest());

        // Validate the Collaborater in the database
        List<Collaborater> collaboraterList = collaboraterRepository.findAll();
        assertThat(collaboraterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchCollaborater() throws Exception {
        int databaseSizeBeforeUpdate = collaboraterRepository.findAll().size();
        collaborater.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCollaboraterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(collaborater))
            )
            .andExpect(status().isBadRequest());

        // Validate the Collaborater in the database
        List<Collaborater> collaboraterList = collaboraterRepository.findAll();
        assertThat(collaboraterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamCollaborater() throws Exception {
        int databaseSizeBeforeUpdate = collaboraterRepository.findAll().size();
        collaborater.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCollaboraterMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(collaborater)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Collaborater in the database
        List<Collaborater> collaboraterList = collaboraterRepository.findAll();
        assertThat(collaboraterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateCollaboraterWithPatch() throws Exception {
        // Initialize the database
        collaboraterRepository.save(collaborater);

        int databaseSizeBeforeUpdate = collaboraterRepository.findAll().size();

        // Update the collaborater using partial update
        Collaborater partialUpdatedCollaborater = new Collaborater();
        partialUpdatedCollaborater.setId(collaborater.getId());

        partialUpdatedCollaborater.name(UPDATED_NAME);

        restCollaboraterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCollaborater.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCollaborater))
            )
            .andExpect(status().isOk());

        // Validate the Collaborater in the database
        List<Collaborater> collaboraterList = collaboraterRepository.findAll();
        assertThat(collaboraterList).hasSize(databaseSizeBeforeUpdate);
        Collaborater testCollaborater = collaboraterList.get(collaboraterList.size() - 1);
        assertThat(testCollaborater.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCollaborater.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
        assertThat(testCollaborater.getArchived()).isEqualTo(DEFAULT_ARCHIVED);
    }

    @Test
    void fullUpdateCollaboraterWithPatch() throws Exception {
        // Initialize the database
        collaboraterRepository.save(collaborater);

        int databaseSizeBeforeUpdate = collaboraterRepository.findAll().size();

        // Update the collaborater using partial update
        Collaborater partialUpdatedCollaborater = new Collaborater();
        partialUpdatedCollaborater.setId(collaborater.getId());

        partialUpdatedCollaborater.name(UPDATED_NAME).creationDate(UPDATED_CREATION_DATE).archived(UPDATED_ARCHIVED);

        restCollaboraterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCollaborater.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCollaborater))
            )
            .andExpect(status().isOk());

        // Validate the Collaborater in the database
        List<Collaborater> collaboraterList = collaboraterRepository.findAll();
        assertThat(collaboraterList).hasSize(databaseSizeBeforeUpdate);
        Collaborater testCollaborater = collaboraterList.get(collaboraterList.size() - 1);
        assertThat(testCollaborater.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCollaborater.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
        assertThat(testCollaborater.getArchived()).isEqualTo(UPDATED_ARCHIVED);
    }

    @Test
    void patchNonExistingCollaborater() throws Exception {
        int databaseSizeBeforeUpdate = collaboraterRepository.findAll().size();
        collaborater.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCollaboraterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, collaborater.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(collaborater))
            )
            .andExpect(status().isBadRequest());

        // Validate the Collaborater in the database
        List<Collaborater> collaboraterList = collaboraterRepository.findAll();
        assertThat(collaboraterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchCollaborater() throws Exception {
        int databaseSizeBeforeUpdate = collaboraterRepository.findAll().size();
        collaborater.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCollaboraterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(collaborater))
            )
            .andExpect(status().isBadRequest());

        // Validate the Collaborater in the database
        List<Collaborater> collaboraterList = collaboraterRepository.findAll();
        assertThat(collaboraterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamCollaborater() throws Exception {
        int databaseSizeBeforeUpdate = collaboraterRepository.findAll().size();
        collaborater.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCollaboraterMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(collaborater))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Collaborater in the database
        List<Collaborater> collaboraterList = collaboraterRepository.findAll();
        assertThat(collaboraterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteCollaborater() throws Exception {
        // Initialize the database
        collaboraterRepository.save(collaborater);

        int databaseSizeBeforeDelete = collaboraterRepository.findAll().size();

        // Delete the collaborater
        restCollaboraterMockMvc
            .perform(delete(ENTITY_API_URL_ID, collaborater.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Collaborater> collaboraterList = collaboraterRepository.findAll();
        assertThat(collaboraterList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
