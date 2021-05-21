package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Gateway.
 */
@Entity
@Table(name = "gateway")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Gateway implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties(value = { "tasks", "events", "gateways", "messages", "processes" }, allowSetters = true)
    private MxCell mxCell;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Gateway id(Long id) {
        this.id = id;
        return this;
    }

    public MxCell getMxCell() {
        return this.mxCell;
    }

    public Gateway mxCell(MxCell mxCell) {
        this.setMxCell(mxCell);
        return this;
    }

    public void setMxCell(MxCell mxCell) {
        this.mxCell = mxCell;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Gateway)) {
            return false;
        }
        return id != null && id.equals(((Gateway) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Gateway{" +
            "id=" + getId() +
            "}";
    }
}
