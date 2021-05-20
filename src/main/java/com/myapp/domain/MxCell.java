package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
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

    @OneToMany(mappedBy = "mxCell")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "mxCell" }, allowSetters = true)
    private Set<Task> tasks = new HashSet<>();

    @OneToMany(mappedBy = "mxCell")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "mxCell" }, allowSetters = true)
    private Set<Event> events = new HashSet<>();

    @OneToMany(mappedBy = "mxCell")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "mxCell" }, allowSetters = true)
    private Set<Gateway> gateways = new HashSet<>();

    @OneToMany(mappedBy = "mxCell")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "mxCell" }, allowSetters = true)
    private Set<Message> messages = new HashSet<>();

    @OneToMany(mappedBy = "mxCell")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "mxCell" }, allowSetters = true)
    private Set<Process> processes = new HashSet<>();

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

    public Set<Task> getTasks() {
        return this.tasks;
    }

    public MxCell tasks(Set<Task> tasks) {
        this.setTasks(tasks);
        return this;
    }

    public MxCell addTask(Task task) {
        this.tasks.add(task);
        task.setMxCell(this);
        return this;
    }

    public MxCell removeTask(Task task) {
        this.tasks.remove(task);
        task.setMxCell(null);
        return this;
    }

    public void setTasks(Set<Task> tasks) {
        if (this.tasks != null) {
            this.tasks.forEach(i -> i.setMxCell(null));
        }
        if (tasks != null) {
            tasks.forEach(i -> i.setMxCell(this));
        }
        this.tasks = tasks;
    }

    public Set<Event> getEvents() {
        return this.events;
    }

    public MxCell events(Set<Event> events) {
        this.setEvents(events);
        return this;
    }

    public MxCell addEvent(Event event) {
        this.events.add(event);
        event.setMxCell(this);
        return this;
    }

    public MxCell removeEvent(Event event) {
        this.events.remove(event);
        event.setMxCell(null);
        return this;
    }

    public void setEvents(Set<Event> events) {
        if (this.events != null) {
            this.events.forEach(i -> i.setMxCell(null));
        }
        if (events != null) {
            events.forEach(i -> i.setMxCell(this));
        }
        this.events = events;
    }

    public Set<Gateway> getGateways() {
        return this.gateways;
    }

    public MxCell gateways(Set<Gateway> gateways) {
        this.setGateways(gateways);
        return this;
    }

    public MxCell addGateway(Gateway gateway) {
        this.gateways.add(gateway);
        gateway.setMxCell(this);
        return this;
    }

    public MxCell removeGateway(Gateway gateway) {
        this.gateways.remove(gateway);
        gateway.setMxCell(null);
        return this;
    }

    public void setGateways(Set<Gateway> gateways) {
        if (this.gateways != null) {
            this.gateways.forEach(i -> i.setMxCell(null));
        }
        if (gateways != null) {
            gateways.forEach(i -> i.setMxCell(this));
        }
        this.gateways = gateways;
    }

    public Set<Message> getMessages() {
        return this.messages;
    }

    public MxCell messages(Set<Message> messages) {
        this.setMessages(messages);
        return this;
    }

    public MxCell addMessage(Message message) {
        this.messages.add(message);
        message.setMxCell(this);
        return this;
    }

    public MxCell removeMessage(Message message) {
        this.messages.remove(message);
        message.setMxCell(null);
        return this;
    }

    public void setMessages(Set<Message> messages) {
        if (this.messages != null) {
            this.messages.forEach(i -> i.setMxCell(null));
        }
        if (messages != null) {
            messages.forEach(i -> i.setMxCell(this));
        }
        this.messages = messages;
    }

    public Set<Process> getProcesses() {
        return this.processes;
    }

    public MxCell processes(Set<Process> processes) {
        this.setProcesses(processes);
        return this;
    }

    public MxCell addProcess(Process process) {
        this.processes.add(process);
        process.setMxCell(this);
        return this;
    }

    public MxCell removeProcess(Process process) {
        this.processes.remove(process);
        process.setMxCell(null);
        return this;
    }

    public void setProcesses(Set<Process> processes) {
        if (this.processes != null) {
            this.processes.forEach(i -> i.setMxCell(null));
        }
        if (processes != null) {
            processes.forEach(i -> i.setMxCell(this));
        }
        this.processes = processes;
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
            "}";
    }
}
