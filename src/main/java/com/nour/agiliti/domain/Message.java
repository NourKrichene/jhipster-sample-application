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
 * A Message.
 */
@Document(collection = "message")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Message implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    @Field("status")
    private Status status;

    @Field("text")
    private String text;

    @Field("sent_date")
    private Instant sentDate;

    @Field("archived")
    private Boolean archived;

    @Field("reaad")
    private Boolean reaad;

    @DBRef
    @Field("from")
    private Collaborater from;

    @DBRef
    @Field("too")
    private Collaborater too;

    @DBRef
    @Field("file")
    @JsonIgnoreProperties(value = { "creator", "file" }, allowSetters = true)
    private Set<File> files = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Message id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Status getStatus() {
        return this.status;
    }

    public Message status(Status status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getText() {
        return this.text;
    }

    public Message text(String text) {
        this.setText(text);
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Instant getSentDate() {
        return this.sentDate;
    }

    public Message sentDate(Instant sentDate) {
        this.setSentDate(sentDate);
        return this;
    }

    public void setSentDate(Instant sentDate) {
        this.sentDate = sentDate;
    }

    public Boolean getArchived() {
        return this.archived;
    }

    public Message archived(Boolean archived) {
        this.setArchived(archived);
        return this;
    }

    public void setArchived(Boolean archived) {
        this.archived = archived;
    }

    public Boolean getReaad() {
        return this.reaad;
    }

    public Message reaad(Boolean reaad) {
        this.setReaad(reaad);
        return this;
    }

    public void setReaad(Boolean reaad) {
        this.reaad = reaad;
    }

    public Collaborater getFrom() {
        return this.from;
    }

    public void setFrom(Collaborater collaborater) {
        this.from = collaborater;
    }

    public Message from(Collaborater collaborater) {
        this.setFrom(collaborater);
        return this;
    }

    public Collaborater getToo() {
        return this.too;
    }

    public void setToo(Collaborater collaborater) {
        this.too = collaborater;
    }

    public Message too(Collaborater collaborater) {
        this.setToo(collaborater);
        return this;
    }

    public Set<File> getFiles() {
        return this.files;
    }

    public void setFiles(Set<File> files) {
        if (this.files != null) {
            this.files.forEach(i -> i.setFile(null));
        }
        if (files != null) {
            files.forEach(i -> i.setFile(this));
        }
        this.files = files;
    }

    public Message files(Set<File> files) {
        this.setFiles(files);
        return this;
    }

    public Message addFile(File file) {
        this.files.add(file);
        file.setFile(this);
        return this;
    }

    public Message removeFile(File file) {
        this.files.remove(file);
        file.setFile(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Message)) {
            return false;
        }
        return id != null && id.equals(((Message) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Message{" +
            "id=" + getId() +
            ", status='" + getStatus() + "'" +
            ", text='" + getText() + "'" +
            ", sentDate='" + getSentDate() + "'" +
            ", archived='" + getArchived() + "'" +
            ", reaad='" + getReaad() + "'" +
            "}";
    }
}
