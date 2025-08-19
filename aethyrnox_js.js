// Game data dengan nominal yang sesuai
const gameData = {
    'mobile-legends': {
        name: 'Mobile Legends',
        needZone: true,
        items: [
            { amount: '86 Diamond', price: 22000, category: 'weekly' },
            { amount: '172 Diamond', price: 43000, category: 'weekly' },
            { amount: '257 Diamond', price: 65000, category: 'weekly' },
            { amount: '344 Diamond', price: 86000, category: 'weekly' },
            { amount: '429 Diamond', price: 108000, category: 'monthly' },
            { amount: '514 Diamond', price: 129000, category: 'monthly' },
            { amount: '706 Diamond', price: 172000, category: 'monthly' },
            { amount: '878 Diamond', price: 215000, category: 'monthly' },
            { amount: '1159 Diamond', price: 280000, category: 'starlight' },
            { amount: '1412 Diamond', price: 344000, category: 'starlight' },
            { amount: '2195 Diamond', price: 516000, category: 'starlight' },
            { amount: '3073 Diamond', price: 688000, category: 'starlight' }
        ]
    },
    'valorant': {
        name: 'Valorant',
        needZone: false,
        items: [
            { amount: '420 VP', price: 55000, category: 'battle-pass' },
            { amount: '700 VP', price: 85000, category: 'battle-pass' },
            { amount: '1000 VP', price: 120000, category: 'skin' },
            { amount: '1375 VP', price: 165000, category: 'skin' },
            { amount: '2400 VP', price: 280000, category: 'bundle' },
            { amount: '4000 VP', price: 460000, category: 'bundle' },
            { amount: '5350 VP', price: 610000, category: 'bundle' },
            { amount: '8150 VP', price: 920000, category: 'premium' }
        ]
    }
};

// State management
let selectedGame = '';
let selectedItem = null;
let selectedPayment = '';
let currentStep = 1;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    showStep(1);
});

function setupEventListeners() {
    // Game selection
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function() {
            selectGame(this.dataset.game);
        });
    });

    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            selectPayment(this.dataset.method);
        });
    });

    // Form inputs
    document.getElementById('user-id').addEventListener('input', validateAndProgress);
    document.getElementById('zone-id').addEventListener('input', validateAndProgress);
    document.getElementById('whatsapp').addEventListener('input', validateAndProgress);

    // Order button
    document.getElementById('order-btn').addEventListener('click', createOrder);
}

function showStep(step) {
    currentStep = step;
    
    // Hide all sections first
    const sections = [
        'user-data-section',
        'items-section', 
        'payment-section',
        'contact-section'
    ];
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        section.style.display = 'none';
        section.classList.remove('show');
    });
    
    // Show sections based on step
    if (step >= 2) {
        showSection('user-data-section');
    }
    if (step >= 3) {
        showSection('items-section');
    }
    if (step >= 4) {
        showSection('payment-section');
    }
    if (step >= 5) {
        showSection('contact-section');
    }
}

function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.style.display = 'block';
    
    // Add animation delay
    setTimeout(() => {
        section.classList.add('show');
    }, 100);
}

function selectGame(game) {
    selectedGame = game;
    
    // Update UI
    document.querySelectorAll('.game-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-game="${game}"]`).classList.add('selected');

    // Show/hide zone ID
    const zoneGroup = document.getElementById('zone-id-group');
    if (gameData[game].needZone) {
        zoneGroup.style.display = 'block';
    } else {
        zoneGroup.style.display = 'none';
        document.getElementById('zone-id').value = '';
    }

    // Clear previous selections
    selectedItem = null;
    selectedPayment = '';
    
    // Reset UI
    document.querySelectorAll('.diamond-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('selected');
    });

    // Load items for selected game
    loadItems(game);
    
    // Progress to next step
    showStep(2);
    
    // Scroll to next section
    setTimeout(() => {
        document.getElementById('user-data-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 300);
}

function loadItems(game) {
    const itemsGrid = document.getElementById('items-grid');
    itemsGrid.innerHTML = '';

    const items = gameData[game].items;
    
    // Group items by category for better organization
    const categories = {
        'weekly': 'Weekly Diamond',
        'monthly': 'Monthly Diamond', 
        'starlight': 'Starlight Member',
        'battle-pass': 'Battle Pass',
        'skin': 'Skin Purchase',
        'bundle': 'Bundle Purchase',
        'premium': 'Premium Purchase'
    };

    // Create sections for each category
    const usedCategories = [...new Set(items.map(item => item.category))];
    
    usedCategories.forEach(category => {
        // Add category header
        if (Object.keys(categories).length > 1) {
            const categoryHeader = document.createElement('div');
            categoryHeader.style.gridColumn = '1 / -1';
            categoryHeader.style.textAlign = 'center';
            categoryHeader.style.color = '#00ffff';
            categoryHeader.style.fontSize = '1.1em';
            categoryHeader.style.fontWeight = 'bold';
            categoryHeader.style.marginTop = '20px';
            categoryHeader.style.marginBottom = '10px';
            categoryHeader.style.textShadow = '0 0 8px rgba(0, 255, 255, 0.5)';
            categoryHeader.textContent = categories[category] || category.toUpperCase();
            itemsGrid.appendChild(categoryHeader);
        }
        
        // Add items for this category
        items.filter(item => item.category === category).forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'diamond-option';
            itemElement.dataset.game = game;
            itemElement.dataset.index = items.indexOf(item);
            itemElement.innerHTML = `
                <div class="diamond-amount">${item.amount}</div>
                <div class="diamond-price">Rp ${item.price.toLocaleString('id-ID')}</div>
            `;
            
            itemElement.addEventListener('click', function() {
                selectItem(game, items.indexOf(item));
            });
            
            itemsGrid.appendChild(itemElement);
        });
    });
}

function selectItem(game, index) {
    selectedItem = gameData[game].items[index];
    
    // Update UI
    document.querySelectorAll('.diamond-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[data-index="${index}"]`).classList.add('selected');
    
    // Progress to next step if user data is complete
    if (validateUserData()) {
        showStep(4);
        setTimeout(() => {
            document.getElementById('payment-section').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    }
    
    updateOrderSummary();
}

function selectPayment(method) {
    selectedPayment = method;
    
    // Update UI
    document.querySelectorAll('.payment-method').forEach(pm => {
        pm.classList.remove('selected');
    });
    document.querySelector(`[data-method="${method}"]`).classList.add('selected');
    
    // Progress to final step
    showStep(5);
    setTimeout(() => {
        document.getElementById('contact-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 300);
    
    updateOrderSummary();
}

function validateUserData() {
    const userId = document.getElementById('user-id').value.trim();
    const zoneId = document.getElementById('zone-id').value.trim();
    
    if (!selectedGame) return false;
    if (!userId) return false;
    if (gameData[selectedGame].needZone && !zoneId) return false;
    
    return true;
}

function validateAndProgress() {
    if (validateUserData() && selectedItem) {
        if (!document.getElementById('payment-section').classList.contains('show')) {
            showStep(4);
        }
    }
    updateOrderSummary();
}

function updateOrderSummary() {
    const summary = document.getElementById('order-summary');
    const orderBtn = document.getElementById('order-btn');
    
    if (selectedGame && selectedItem && selectedPayment) {
        const userId = document.getElementById('user-id').value.trim();
        const zoneId = document.getElementById('zone-id').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        
        // Update summary content
        document.getElementById('summary-game').textContent = gameData[selectedGame].name;
        document.getElementById('summary-userid').textContent = userId || '-';
        
        // Show/hide zone ID row
        const zoneRow = document.getElementById('summary-zone-row');
        if (gameData[selectedGame].needZone) {
            zoneRow.style.display = 'flex';
            document.getElementById('summary-zoneid').textContent = zoneId || '-';
        } else {
            zoneRow.style.display = 'none';
        }
        
        document.getElementById('summary-item').textContent = selectedItem.amount;
        document.getElementById('summary-payment').textContent = selectedPayment.toUpperCase();
        document.getElementById('summary-total').textContent = `Rp ${selectedItem.price.toLocaleString('id-ID')}`;
        
        summary.style.display = 'block';
        orderBtn.style.display = 'block';
        
        // Check if all required fields are filled
        const isFormComplete = userId && whatsapp && 
            (gameData[selectedGame].needZone ? zoneId : true);
            
        orderBtn.disabled = !isFormComplete;
        
        // Scroll to summary when complete
        if (isFormComplete) {
            setTimeout(() => {
                summary.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300);
        }
    } else {
        summary.style.display = 'none';
        orderBtn.style.display = 'none';
    }
}

function createOrder() {
    const userId = document.getElementById('user-id').value.trim();
    const zoneId = document.getElementById('zone-id').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    
    if (!userId || !whatsapp || (gameData[selectedGame].needZone && !zoneId)) {
        alert('Mohon lengkapi semua data yang diperlukan!');
        return;
    }
    
    // Generate order ID with more specific format
    const gamePrefix = selectedGame === 'mobile-legends' ? 'ML' : 'VL';
    const timestamp = Date.now().toString().slice(-6);
    const orderId = `ATS-${gamePrefix}-${timestamp}`;
    
    // Show success modal with enhanced message
    const message = `
        <strong>🎮 Order ID: ${orderId}</strong><br><br>
        <div style="text-align: left; display: inline-block;">
            <strong>📋 Detail Pesanan:</strong><br>
            🎯 Game: ${gameData[selectedGame].name}<br>
            👤 User ID: ${userId}<br>
            ${gameData[selectedGame].needZone ? `🌍 Zone ID: ${zoneId}<br>` : ''}
            💎 Item: ${selectedItem.amount}<br>
            💳 Pembayaran: ${selectedPayment.toUpperCase()}<br>
            💰 Total: <strong style="color: #00ff00;">Rp ${selectedItem.price.toLocaleString('id-ID')}</strong><br>
            📱 WhatsApp: ${whatsapp}
        </div>
        <br><br>
        <strong style="color: #00ffff;">Silakan lanjutkan pembayaran melalui WhatsApp Customer Service kami untuk konfirmasi pesanan.</strong>
    `;
    
    document.getElementById('modal-message').innerHTML = message;
    document.getElementById('modal').style.display = 'block';
    
    // Store order data for WhatsApp
    window.currentOrder = {
        orderId: orderId,
        game: gameData[selectedGame].name,
        userId: userId,
        zoneId: zoneId,
        item: selectedItem.amount,
        payment: selectedPayment.toUpperCase(),
        total: selectedItem.price,
        whatsapp: whatsapp,
        timestamp: new Date().toLocaleString('id-ID')
    };
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function redirectToWhatsApp() {
    const order = window.currentOrder;
    
    const message = `🎮 *AETHYRNOX STORE* - Pesanan Topup Game

📋 *DETAIL PESANAN:*
🆔 Order ID: ${order.orderId}
🎯 Game: ${order.game}
👤 User ID: ${order.userId}${order.zoneId ? `\n🌍 Zone ID: ${order.zoneId}` : ''}
💎 Item: ${order.item}
💳 Metode Pembayaran: ${order.payment}
💰 Total Pembayaran: *Rp ${order.total.toLocaleString('id-ID')}*
📱 WhatsApp: ${order.whatsapp}
🕒 Waktu Order: ${order.timestamp}

---
Halo admin! Saya ingin melakukan topup game dengan detail di atas. Mohon bantuannya untuk proses pembayaran dan konfirmasi. Terima kasih! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/081997718002?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    closeModal();
    
    // Reset form after successful order
    setTimeout(() => {
        resetForm();
    }, 1000);
}

function contactCS() {
    const message = `🎮 *AETHYRNOX STORE* - Customer Service

Halo admin! Saya butuh bantuan terkait topup game. Bisa dibantu? Terima kasih! 😊`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/081997718002?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

function resetForm() {
    // Reset all selections
    selectedGame = '';
    selectedItem = null;
    selectedPayment = '';
    currentStep = 1;
    
    // Clear UI selections
    document.querySelectorAll('.game-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelectorAll('.diamond-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('selected');
    });
    
    // Clear form inputs
    document.getElementById('user-id').value = '';
    document.getElementById('zone-id').value = '';
    document.getElementById('whatsapp').value = '';
    
    // Hide all sections
    showStep(1);
    
    // Hide summary and order button
    document.getElementById('order-summary').style.display = 'none';
    document.getElementById('order-btn').style.display = 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Add loading animation for better UX
function showLoading() {
    const orderBtn = document.getElementById('order-btn');
    const originalText = orderBtn.innerHTML;
    orderBtn.innerHTML = '⏳ MEMPROSES...';
    orderBtn.disabled = true;
    
    setTimeout(() => {
        orderBtn.innerHTML = originalText;
        orderBtn.disabled = false;
    }, 2000);
}

// Enhanced form validation with real-time feedback
function validateInput(input) {
    const value = input.value.trim();
    
    if (input.id === 'user-id') {
        if (value.length < 3) {
            input.style.borderColor = '#ff0000';
            return false;
        }
    } else if (input.id === 'zone-id') {
        if (gameData[selectedGame]?.needZone && value.length < 1) {
            input.style.borderColor = '#ff0000';
            return false;
        }
    } else if (input.id === 'whatsapp') {
        const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            input.style.borderColor = '#ff0000';
            return false;
        }
    }
    
    input.style.borderColor = '#00ffff';
    return true;
}

// Add input validation listeners
document.addEventListener('DOMContentLoaded', function() {
    ['user-id', 'zone-id', 'whatsapp'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    validateInput(input);
                }
            });
        }
    });
});