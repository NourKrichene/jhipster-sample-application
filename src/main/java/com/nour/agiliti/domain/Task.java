package com.nour.agiliti.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.nour.agiliti.domain.enumeration.Status;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Task.
 */
@Document(collection = "task")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Task implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    @Field("status")
    private Status status;

    @Field("name")
    private String name;

    @Field("creation_date")
    private Instant creationDate;

    @Field("archived")
    private Boolean archived;

    @DBRef
    @Field("creator")
    private Collaborater creator;

    @DBRef
    @Field("collaboraters")
    @JsonIgnoreProperties(value = { "creator", "tasks" }, allowSetters = true)
    private Set<Collaborater> collaboraters = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Task id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Status getStatus() {
        return this.status;
    }

    public Task status(Status status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getName() {
        return this.name;
    }

    public Task name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getCreationDate() {
        return this.creationDate;
    }

    public Task creationDate(Instant creationDate) {
        this.setCreationDate(creationDate);
        return this;
    }

    public void setCreationDate(Instant creationDate) {
        this.creationDate = creationDate;
    }

    public Boolean getArchived() {
        return this.archived;
    }

    public Task archived(Boolean archived) {
        this.setArchived(archived);
        return this;
    }

    public void setArchived(Boolean archived) {
        this.archived = archived;
    }

    public Collaborater getCreator() {
        return this.creator;
    }

    public void setCreator(Collaborater collaborater) {
        this.creator = collaborater;
    }

    public Task creator(Collaborater collaborater) {
        this.setCreator(collaborater);
        return this;
    }

    public Set<Collaborater> getCollaboraters() {
        return this.collaboraters;
    }

    public void setCollaboraters(Set<Collaborater> collaboraters) {
        this.collaboraters = collaboraters;
    }

    public Task collaboraters(Set<Collaborater> collaboraters) {
        this.setCollaboraters(collaboraters);
        return this;
    }

    public Task addCollaborater(Collaborater collaborater) {
        this.collaboraters.add(collaborater);
        collaborater.getTasks().add(this);
        return this;
    }

    public Task removeCollaborater(Collaborater collaborater) {
        this.collaboraters.remove(collaborater);
        collaborater.getTasks().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Task)) {
            return false;
        }
        return id != null && id.equals(((Task) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Task{" +
            "id=" + getId() +
            ", status='" + getStatus() + "'" +
            ", name='" + getName() + "'" +
            ", creationDate='" + getCreationDate() + "'" +
            ", archived='" + getArchived() + "'" +
            "}";
    }
}
