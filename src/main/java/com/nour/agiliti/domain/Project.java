package com.nour.agiliti.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.nour.agiliti.domain.enumeration.Status;
import java.io.Serializable;
import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Project.
 */
@Document(collection = "project")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Project implements Serializable {

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
    private Project creator;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Project id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Status getStatus() {
        return this.status;
    }

    public Project status(Status status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getName() {
        return this.name;
    }

    public Project name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getCreationDate() {
        return this.creationDate;
    }

    public Project creationDate(Instant creationDate) {
        this.setCreationDate(creationDate);
        return this;
    }

    public void setCreationDate(Instant creationDate) {
        this.creationDate = creationDate;
    }

    public Boolean getArchived() {
        return this.archived;
    }

    public Project archived(Boolean archived) {
        this.setArchived(archived);
        return this;
    }

    public void setArchived(Boolean archived) {
        this.archived = archived;
    }

    public Project getCreator() {
        return this.creator;
    }

    public void setCreator(Project project) {
        this.creator = project;
    }

    public Project creator(Project project) {
        this.setCreator(project);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Project)) {
            return false;
        }
        return id != null && id.equals(((Project) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Project{" +
            "id=" + getId() +
            ", status='" + getStatus() + "'" +
            ", name='" + getName() + "'" +
            ", creationDate='" + getCreationDate() + "'" +
            ", archived='" + getArchived() + "'" +
            "}";
    }
}
