package com.myapp.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A MxCell.
 */
@Entity
@Table(name = "mx_cell")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class MxCell implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lg")
    private String lg;

    @Column(name = "style")
    private String style;

    @Column(name = "value")
    private String value;

    @Column(name = "parent")
    private String parent;

    @Column(name = "source")
    private String source;

    @Column(name = "target")
    private String target;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MxCell id(Long id) {
        this.id = id;
        return this;
    }

    public String getLg() {
        return this.lg;
    }

    public MxCell lg(String lg) {
        this.lg = lg;
        return this;
    }

    public void setLg(String lg) {
        this.lg = lg;
    }

    public String getStyle() {
        return this.style;
    }

    public MxCell style(String style) {
        this.style = style;
        return this;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getValue() {
        return this.value;
    }

    public MxCell value(String value) {
        this.value = value;
        return this;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getParent() {
        return this.parent;
    }

    public MxCell parent(String parent) {
        this.parent = parent;
        return this;
    }

    public void setParent(String parent) {
        this.parent = parent;
    }

    public String getSource() {
        return this.source;
    }

    public MxCell source(String source) {
        this.source = source;
        return this;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getTarget() {
        return this.target;
    }

    public MxCell target(String target) {
        this.target = target;
        return this;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MxCell)) {
            return false;
        }
        return id != null && id.equals(((MxCell) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MxCell{" +
            "id=" + getId() +
            ", lg='" + getLg() + "'" +
            ", style='" + getStyle() + "'" +
            ", value='" + getValue() + "'" +
            ", parent='" + getParent() + "'" +
            ", source='" + getSource() + "'" +
            ", target='" + getTarget() + "'" +
            "}";
    }
}
