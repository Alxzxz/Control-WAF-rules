let rules = [];

async function loadRules() {
    try {
        const response = await fetch('/api/rules');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Reglas cargadas:', data); // Para debugging
        rules = data;
        updateRulesList();
    } catch (error) {
        console.error('Error loading rules:', error);
    }
}

document.getElementById('newRuleForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const newRule = {
        ruleId: document.getElementById('ruleId').value,
        name: document.getElementById('ruleName').value,
        description: document.getElementById('ruleDescription').value,
        active: document.getElementById('ruleActive').value,
        severity: parseInt(document.getElementById('ruleSeverity').value),
        group: document.getElementById('ruleGroup').value,
        comments: []
    };
    
    try {
        const response = await fetch('/api/rules', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newRule)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Regla creada:', result); // Para debugging
        
        await loadRules(); // Recargar la lista de reglas
        this.reset();
    } catch (error) {
        console.error('Error adding rule:', error);
        alert('Error al crear la regla: ' + error.message);
    }
});

function updateRulesList() {
    const rulesContainer = document.getElementById('rulesList');
    rulesContainer.innerHTML = '';
    
    if (rules.length === 0) {
        rulesContainer.innerHTML = '<p>No hay reglas disponibles</p>';
        return;
    }
    
    rules.forEach(rule => {
        const sortedComments = rule.comments.sort((a, b) => new Date(b.date) - new Date(a.date));
        const ruleElement = document.createElement('div');
        ruleElement.className = 'rule-card';
        ruleElement.innerHTML = `
            <h3>${rule.name}</h3>
            <p>Estado: ${getStatusLabel(rule.active)} | Severidad ${rule.severity}</p>
            <p>Grupo: ${rule.group || 'Sin grupo'}</p>
            <p>ID: ${rule.ruleId}</p>
            <p>Descripción: ${rule.description || 'Sin descripción'}</p>
            <div class="comments-section">
                <h4>Comentarios:</h4>
                <div class="comments-list">
                    ${sortedComments.length > 0 
                        ? sortedComments.map(comment => `
                            <div class="comment">
                                <p class="comment-text">${comment.text}</p>
                                <span class="comment-date">${new Date(comment.date).toLocaleString()}</span>
                            </div>
                        `).join('')
                        : '<p>Sin comentarios</p>'}
                </div>
                <div class="add-comment">
                    <input type="text" placeholder="Añadir comentario" class="comment-input">
                    <button onclick="addComment('${rule._id}')">Añadir Comentario</button>
                </div>
            </div>
            <div class="rule-actions">
                <button onclick="editRule('${rule._id}')">Editar</button>
                <button onclick="deleteRule('${rule._id}')">Eliminar</button>
            </div>
        `;
        rulesContainer.appendChild(ruleElement);
    });
}

function getStatusLabel(status) {
    const labels = {
        'active': 'Activa',
        'inactive': 'Inactiva',
        'testing': 'Preview',
        'disabled': 'Deshabilitada',
        'pending': 'Pendiente'
    };
    return labels[status] || status;
}

async function addComment(ruleId) {
    const commentInput = event.target.parentElement.querySelector('.comment-input');
    if (commentInput.value) {
        try {
            await fetch(`/api/rules/${ruleId}/comments`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: commentInput.value })
            });
            await loadRules();
            commentInput.value = '';
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }
}

function editRule(ruleId) {
    const rule = rules.find(r => r._id === ruleId);
    if (!rule) return;

    // Rellenar el formulario con los datos actuales
    document.getElementById('editRuleName').value = rule.name;
    document.getElementById('editRuleId').value = rule.ruleId;
    document.getElementById('editRuleDescription').value = rule.description;
    document.getElementById('editRuleActive').value = rule.active;
    document.getElementById('editRuleSeverity').value = rule.severity;
    document.getElementById('editRuleGroup').value = rule.group;

    // Mostrar el modal
    document.getElementById('editModal').style.display = 'block';

    // Guardar el ID de la regla actual para la actualización
    document.getElementById('editRuleForm').dataset.ruleId = ruleId;
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

document.getElementById('editRuleForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const ruleId = this.dataset.ruleId;

    const updatedRule = {
        name: document.getElementById('editRuleName').value,
        ruleId: document.getElementById('editRuleId').value,
        description: document.getElementById('editRuleDescription').value,
        active: document.getElementById('editRuleActive').value,
        severity: parseInt(document.getElementById('editRuleSeverity').value),
        group: document.getElementById('editRuleGroup').value
    };

    try {
        const response = await fetch(`/api/rules/${ruleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedRule)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        await loadRules();
        closeEditModal();
    } catch (error) {
        console.error('Error updating rule:', error);
        alert('Error al actualizar la regla: ' + error.message);
    }
});

// Cerrar el modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
}

async function deleteRule(ruleId) {
    const rule = rules.find(r => r._id === ruleId);
    if (!rule) return;

    const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar la regla "${rule.name}"?\nEsta acción no se puede deshacer.`);
    
    if (confirmDelete) {
        try {
            const response = await fetch(`/api/rules/${ruleId}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await loadRules();
        } catch (error) {
            console.error('Error deleting rule:', error);
            alert('Error al eliminar la regla: ' + error.message);
        }
    }
}

document.getElementById('searchRules').addEventListener('input', filterRules);
document.getElementById('filterStatus').addEventListener('change', filterRules);
document.getElementById('filterGroup').addEventListener('input', filterRules);

function filterRules() {
    const searchTerm = document.getElementById('searchRules').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    const groupFilter = document.getElementById('filterGroup').value;

    const filteredRules = rules.filter(rule => {
        const matchesSearch = rule.name.toLowerCase().includes(searchTerm) ||
                            rule.description.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || rule.active === statusFilter;
        const matchesGroup = !groupFilter || rule.group === groupFilter;

        return matchesSearch && matchesStatus && matchesGroup;
    });

    const rulesContainer = document.getElementById('rulesList');
    rulesContainer.innerHTML = '';
    
    filteredRules.forEach(rule => {
        const ruleElement = document.createElement('div');
        ruleElement.className = 'rule-card';
        ruleElement.innerHTML = `
            <h3>${rule.name}</h3>
            <p>Estado: ${getStatusLabel(rule.active)} | Severidad ${rule.severity}</p>
            <p>Grupo ${rule.group}</p>
            <p>ID: ${rule.ruleId}</p>
            <p>Descripción: ${rule.description}</p>
            <div class="comments-section">
                <h4>Comentarios:</h4>
                <div class="comments-list">
                    ${rule.comments.map(comment => `<p>${comment.text}</p>`).join('')}
                </div>
                <div class="add-comment">
                    <input type="text" placeholder="Añadir comentario" class="comment-input">
                    <button onclick="addComment('${rule._id}')">Añadir Comentario</button>
                </div>
            </div>
            <div class="rule-actions">
                <button onclick="editRule('${rule._id}')">Editar</button>
                <button onclick="deleteRule('${rule._id}')">Eliminar</button>
            </div>
        `;
        rulesContainer.appendChild(ruleElement);
    });
}

// Asegurarse de que las reglas se cargan al inicio
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, loading rules...');
    loadRules();
});