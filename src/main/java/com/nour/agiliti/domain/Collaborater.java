package com.nour.agiliti.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Collaborater.
 */
@Document(collection = "collaborater")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Collaborater implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

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
    @Field("tasks")
    @JsonIgnoreProperties(value = { "creator", "collaboraters" }, allowSetters = true)
    private Set<Task> tasks = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Collaborater id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Collaborater name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getCreationDate() {
        return this.creationDate;
    }

    public Collaborater creationDate(Instant creationDate) {
        this.setCreationDate(creationDate);
        return this;
    }

    public void setCreationDate(Instant creationDate) {
        this.creationDate = creationDate;
    }

    public Boolean getArchived() {
        return this.archived;
    }

    public Collaborater archived(Boolean archived) {
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

    public Collaborater creator(Collaborater collaborater) {
        this.setCreator(collaborater);
        return this;
    }

    public Set<Task> getTasks() {
        return this.tasks;
    }

    public void setTasks(Set<Task> tasks) {
        if (this.tasks != null) {
            this.tasks.forEach(i -> i.removeCollaborater(this));
        }
        if (tasks != null) {
            tasks.forEach(i -> i.addCollaborater(this));
        }
        this.tasks = tasks;
    }

    public Collaborater tasks(Set<Task> tasks) {
        this.setTasks(tasks);
        return this;
    }

    public Collaborater addTask(Task task) {
        this.tasks.add(task);
        task.getCollaboraters().add(this);
        return this;
    }

    public Collaborater removeTask(Task task) {
        this.tasks.remove(task);
        task.getCollaboraters().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Collaborater)) {
            return false;
        }
        return id != null && id.equals(((Collaborater) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Collaborater{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", creationDate='" + getCreationDate() + "'" +
            ", archived='" + getArchived() + "'" +
            "}";
    }
}
