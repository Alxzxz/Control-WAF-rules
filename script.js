let rules = [];

async function loadRules() {
    try {
        const response = await fetch('/api/rules');
        rules = await response.json();
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
        active: document.getElementById('ruleActive').checked,
        severity: parseInt(document.getElementById('ruleSeverity').value),
        group: document.getElementById('ruleGroup').value
    };
    
    try {
        const response = await fetch('/api/rules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRule)
        });
        
        if (response.ok) {
            await loadRules();
            this.reset();
        }
    } catch (error) {
        console.error('Error adding rule:', error);
    }
});

function updateRulesList() {
    const rulesContainer = document.getElementById('rulesList');
    rulesContainer.innerHTML = '';
    
    rules.forEach(rule => {
        const ruleElement = document.createElement('div');
        ruleElement.className = 'rule-card';
        ruleElement.innerHTML = `
            <h3>${rule.name}</h3>
            <p>${rule.active ? 'active' : 'inactive'} Severidad ${rule.severity}</p>
            <p>Grupo ${rule.group}</p>
            <p>ID: ${rule.ruleId}</p>
            <p>Descripción: ${rule.description}</p>
            <div class="comments-section">
                <h4>Comentarios:</h4>
                <div class="comments-list">
                    ${rule.comments.map(comment => `<p>${comment}</p>`).join('')}
                </div>
                <div class="add-comment">
                    <input type="text" placeholder="Añadir comentario" class="comment-input">
                    <button onclick="addComment('${rule.ruleId}')">Añadir Comentario</button>
                </div>
            </div>
            <div class="rule-actions">
                <button onclick="editRule('${rule.ruleId}')">Editar</button>
                <button onclick="deleteRule('${rule.ruleId}')">Eliminar</button>
            </div>
        `;
        rulesContainer.appendChild(ruleElement);
    });
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
    const rule = rules.find(r => r.ruleId === ruleId);
    // Implement edit functionality
}

async function deleteRule(ruleId) {
    try {
        await fetch(`/api/rules/${ruleId}`, { method: 'DELETE' });
        await loadRules();
    } catch (error) {
        console.error('Error deleting rule:', error);
    }
}

document.getElementById('searchRules').addEventListener('input', filterRules);
document.getElementById('filterStatus').addEventListener('change', filterRules);
document.getElementById('filterGroup').addEventListener('input', filterRules);

function filterRules() {
    // Implement filtering functionality
}

// Load rules when page loads
document.addEventListener('DOMContentLoaded', loadRules);
