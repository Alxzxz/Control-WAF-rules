class WafRule {
    constructor(name, id, description, status) {
        this.name = name;
        this.id = id;
        this.description = description;
        this.status = status;
        this.comments = [];
        this.createdAt = new Date();
    }
}

class WafRuleManager {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api';
        this.rules = [];  // Almacenar todas las reglas
        this.init();
    }

    init() {
        this.loadRules();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('addRuleForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addRule();
        });
        
        const searchInput = document.getElementById('searchInput');
        const searchType = document.getElementById('searchType');
        const statusFilter = document.getElementById('statusFilter');
        
        searchInput.addEventListener('input', () => this.filterRules());
        searchType.addEventListener('change', () => this.filterRules());
        statusFilter.addEventListener('change', () => this.filterRules());
    }

    async addRule() {
        const name = document.getElementById('ruleName').value;
        const id = document.getElementById('ruleId').value;
        const description = document.getElementById('ruleDescription').value;
        const status = document.getElementById('ruleStatus').value;
        const severity = parseInt(document.getElementById('ruleSeverity').value);

        try {
            await fetch(`${this.apiUrl}/rules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, id, description, status, severity })
            });
            this.loadRules();
            document.getElementById('addRuleForm').reset();
        } catch (error) {
            console.error('Error adding rule:', error);
        }
    }

    async deleteRule(id) {
        try {
            await fetch(`${this.apiUrl}/rules/${id}`, {
                method: 'DELETE'
            });
            this.loadRules();
        } catch (error) {
            console.error('Error deleting rule:', error);
        }
    }

    async toggleStatus(id) {
        try {
            await fetch(`${this.apiUrl}/rules/${id}/status`, {
                method: 'PATCH'
            });
            this.loadRules();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    }

    async addComment(id, comment) {
        try {
            await fetch(`${this.apiUrl}/rules/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: comment })
            });
            this.loadRules();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }

    async updateRule(id, updatedData) {
        try {
            await fetch(`${this.apiUrl}/rules/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });
            this.loadRules();
        } catch (error) {
            console.error('Error updating rule:', error);
        }
    }

    async loadRules() {
        try {
            const response = await fetch(`${this.apiUrl}/rules`);
            console.log('API Response:', response); // Log completo de la respuesta
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text(); // Obtener respuesta como texto
            console.log('Response text:', text); // Ver el texto crudo de la respuesta
            
            let data;
            try {
                data = JSON.parse(text); // Intentar parsear el JSON
            } catch (e) {
                console.error('Error parsing JSON:', e);
                data = [];
            }
            
            console.log('Parsed data:', data);
            this.rules = Array.isArray(data) ? data : [];
            console.log('Final rules array:', this.rules);
            
            this.filterRules();
        } catch (error) {
            console.error('Error in loadRules:', error);
            this.rules = [];
            this.filterRules();
        }
    }

    filterRules() {
        const searchInput = document.getElementById('searchInput');
        const searchType = document.getElementById('searchType');
        const statusFilter = document.getElementById('statusFilter');
        const searchText = searchInput.value.toLowerCase();
        const filterType = searchType.value;
        const statusValue = statusFilter.value;

        if (!Array.isArray(this.rules)) {
            console.error('this.rules is not an array:', this.rules);
            this.rules = [];
        }

        const filteredRules = this.rules.filter(rule => {
            let matchesSearch = false;
            
            if (filterType === 'comments') {
                // Buscar en los comentarios
                matchesSearch = rule.comments.some(comment => 
                    comment.text.toLowerCase().includes(searchText)
                );
            } else {
                // Búsqueda normal en otros campos
                const searchField = String(rule[filterType]).toLowerCase();
                matchesSearch = searchField.includes(searchText);
            }

            const matchesStatus = statusValue === 'all' || rule.status === statusValue;
            return matchesSearch && matchesStatus;
        });

        const rulesContainer = document.getElementById('rulesList');
        if (!rulesContainer) {
            console.error('Rules container not found!');
            return;
        }
        
        rulesContainer.innerHTML = '';
        
        if (this.rules.length === 0) {
            rulesContainer.innerHTML = '<p>No hay reglas disponibles</p>';
            return;
        }

        if (filteredRules.length === 0) {
            rulesContainer.innerHTML = '<p>No se encontraron reglas que coincidan con la búsqueda</p>';
            return;
        }

        filteredRules.forEach(rule => {
            const ruleElement = this.createRuleElement(rule);
            rulesContainer.appendChild(ruleElement);
        });
    }

    createRuleElement(rule) {
        const div = document.createElement('div');
        div.className = 'rule-card';
        div.innerHTML = `
            <div class="rule-content" id="rule-content-${rule.id}">
                <h3>${rule.name}</h3>
                <span class="status ${rule.status}">${rule.status}</span>
                <span class="severity severity-${rule.severity}">Severidad ${rule.severity}</span>
                <p><strong>ID:</strong> ${rule.id}</p>
                <p><strong>Descripción:</strong> ${rule.description}</p>
            </div>
            
            <div class="rule-edit-form" id="rule-edit-${rule.id}" style="display: none;">
                <input type="text" id="edit-name-${rule.id}" value="${rule.name}">
                <textarea id="edit-description-${rule.id}">${rule.description}</textarea>
                <select id="edit-status-${rule.id}">
                    <option value="active" ${rule.status === 'active' ? 'selected' : ''}>Activa</option>
                    <option value="inactive" ${rule.status === 'inactive' ? 'selected' : ''}>Inactiva</option>
                    <option value="preview" ${rule.status === 'preview' ? 'selected' : ''}>Preview</option>
                    <option value="false_positive" ${rule.status === 'false_positive' ? 'selected' : ''}>Falso Positivo</option>
                </select>
                <select id="edit-severity-${rule.id}">
                    <option value="1" ${rule.severity === 1 ? 'selected' : ''}>Severidad 1 (Baja)</option>
                    <option value="2" ${rule.severity === 2 ? 'selected' : ''}>Severidad 2 (Media)</option>
                    <option value="3" ${rule.severity === 3 ? 'selected' : ''}>Severidad 3 (Alta)</option>
                    <option value="4" ${rule.severity === 4 ? 'selected' : ''}>Severidad 4 (Crítica)</option>
                </select>
                <button onclick="wafManager.saveEdit('${rule.id}')">Guardar</button>
                <button onclick="wafManager.cancelEdit('${rule.id}')" class="cancel-btn">Cancelar</button>
            </div>

            <div class="comments">
                <h4>Comentarios:</h4>
                ${rule.comments.map(comment => `
                    <p>${comment.text} - ${new Date(comment.date).toLocaleString()}</p>
                `).join('')}
            </div>
            
            <div class="edit-comment">
                <input type="text" placeholder="Añadir comentario" id="comment-${rule.id}">
                <button onclick="wafManager.addComment('${rule.id}', document.getElementById('comment-${rule.id}').value)">
                    Añadir Comentario
                </button>
            </div>
            
            <div class="rule-actions">
                <button onclick="wafManager.toggleEdit('${rule.id}')" class="edit-btn">
                    Editar
                </button>
                <button onclick="wafManager.deleteRule('${rule.id}')" style="background: #dc3545">
                    Eliminar
                </button>
            </div>
        `;
        return div;
    }

    toggleEdit(id) {
        const contentDiv = document.getElementById(`rule-content-${id}`);
        const editDiv = document.getElementById(`rule-edit-${id}`);
        contentDiv.style.display = contentDiv.style.display === 'none' ? 'block' : 'none';
        editDiv.style.display = editDiv.style.display === 'none' ? 'block' : 'none';
    }

    async saveEdit(id) {
        const updatedData = {
            name: document.getElementById(`edit-name-${id}`).value,
            description: document.getElementById(`edit-description-${id}`).value,
            status: document.getElementById(`edit-status-${id}`).value,
            severity: parseInt(document.getElementById(`edit-severity-${id}`).value)
        };
        await this.updateRule(id, updatedData);
        this.toggleEdit(id);
    }

    cancelEdit(id) {
        this.toggleEdit(id);
    }
}

const wafManager = new WafRuleManager();
