package com.nour.agiliti.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A File.
 */
@Document(collection = "file")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class File implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    @Field("name")
    private String name;

    @Field("creation_date")
    private Instant creationDate;

    @Field("archived")
    private Boolean archived;

    @Field("path")
    private String path;

    @DBRef
    @Field("creator")
    private Collaborater creator;

    @DBRef
    @Field("file")
    @JsonIgnoreProperties(value = { "from", "too", "files" }, allowSetters = true)
    private Message file;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public File id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public File name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getCreationDate() {
        return this.creationDate;
    }

    public File creationDate(Instant creationDate) {
        this.setCreationDate(creationDate);
        return this;
    }

    public void setCreationDate(Instant creationDate) {
        this.creationDate = creationDate;
    }

    public Boolean getArchived() {
        return this.archived;
    }

    public File archived(Boolean archived) {
        this.setArchived(archived);
        return this;
    }

    public void setArchived(Boolean archived) {
        this.archived = archived;
    }

    public String getPath() {
        return this.path;
    }

    public File path(String path) {
        this.setPath(path);
        return this;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Collaborater getCreator() {
        return this.creator;
    }

    public void setCreator(Collaborater collaborater) {
        this.creator = collaborater;
    }

    public File creator(Collaborater collaborater) {
        this.setCreator(collaborater);
        return this;
    }

    public Message getFile() {
        return this.file;
    }

    public void setFile(Message message) {
        this.file = message;
    }

    public File file(Message message) {
        this.setFile(message);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof File)) {
            return false;
        }
        return id != null && id.equals(((File) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "File{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", creationDate='" + getCreationDate() + "'" +
            ", archived='" + getArchived() + "'" +
            ", path='" + getPath() + "'" +
            "}";
    }
}
