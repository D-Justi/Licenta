

let historyStack = [];

let lawyerData = [];
let wizardData = [];

document.addEventListener('DOMContentLoaded',async () => {
    try{
        const response = await fetch("http://localhost:3000/api/lawyers",{
            method: "GET"
        });

        lawyerData = await response.json();

        console.log("Avocați încărcați: ", lawyerData);

        const wizardResponse = await fetch("http://localhost:3000/api/wizard",{
            method: "GET"
        });

        wizardData = await wizardResponse.json();

        injectWizardHTML();
    }catch(err){
        console.error("Nu am putut încărca avocații: ",err);
    }
});

function injectWizardHTML() {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'lawyerWizard';
    modalDiv.className = 'wizard-modal';
    modalDiv.innerHTML = `
        <div class="wizard-content">
            <div class="wizard-header">
                <h2>Ghidează-mă</h2>
                <span class="close-wizard" onclick="closeWizard()">&times;</span>
            </div>
            <div class="wizard-body" id="wizard-container">
                <!-- Dynamic Content -->
            </div>
            <div class="wizard-footer">
                <button id="wizard-back-btn" class="wizard-nav-btn" onclick="goBack()" style="display:none;">Înapoi</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalDiv);

    const floatBtn = document.createElement('div');
    floatBtn.className = 'wizard-floating-btn';
    floatBtn.onclick = openWizard;
    floatBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
    `;
    document.body.appendChild(floatBtn);

    window.onclick = function (event) {
        const modal = document.getElementById('lawyerWizard');
        if (event.target == modal) {
            closeWizard();
        }
    }
}

function openWizard() {
    const modal = document.getElementById('lawyerWizard');
    modal.style.display = 'block';
    renderQuestion('start');
    historyStack = [];
    updateBackButton();
}

function closeWizard() {
    document.getElementById('lawyerWizard').style.display = 'none';
}

function renderQuestion(stepSlug) {
    const container = document.getElementById('wizard-container');
    const stepObj = wizardData.find(s => s.slug === stepSlug);

    if (!stepObj) {
        console.error("Pasul nu a fost găsit:", stepSlug);
        return;
    }

    let html = `<div class="wizard-question">${stepObj.questionText}</div>`;
    html += `<div class="wizard-options">`;

    stepObj.options.forEach(opt => {
        let onClick = '';
  
        if (opt.nextStepId) {
            const nextStepObj = wizardData.find(s => s.id === opt.nextStepId);
            if (nextStepObj) {
                onClick = `nextStep('${nextStepObj.slug}', '${stepSlug}')`;
            }
        } 
        else if (opt.recommendedLawyerId) {
            onClick = `showResult(${opt.recommendedLawyerId}, '${stepSlug}')`;
        }

        html += `<button class="wizard-btn" onclick="${onClick}">${opt.label}</button>`;
    });

    html += `</div>`;
    container.innerHTML = html;
}

function nextStep(nextId, currentId) {
    historyStack.push(currentId);
    renderQuestion(nextId);
    updateBackButton();
}

async function showResult(lawyerId, currentId) {
    historyStack.push(currentId);
    updateBackButton();

    const lawyer = lawyerData.find(l => l.id === lawyerId);
    const container = document.getElementById('wizard-container');

    container.innerHTML = `
        <div class="wizard-result">
            <img src="${lawyer.imagePath}" alt="${lawyer.fullName}">
            <h3>${lawyer.fullName}</h3>
            <p><strong>${lawyer.role}</strong></p>
            <p>${lawyer.description}</p>
            <a href="/programare?lawyerId=${lawyer.id}" class="wizard-cta">Programează o Întâlnire</a>
        </div>
    `;
}

function goBack() {
    if (historyStack.length === 0) return;
    const prevId = historyStack.pop();
    renderQuestion(prevId);
    updateBackButton();
}

function updateBackButton() {
    const btn = document.getElementById('wizard-back-btn');
    btn.disabled = historyStack.length === 0;
    btn.style.display = historyStack.length === 0 ? 'none' : 'inline-block';
}
