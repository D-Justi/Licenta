import { sequelize, Lawyer, WizardStep, WizardOption } from './src/models/index.js';

const seedDatabase = async () => {
    try {
        // 1. Resetăm baza de date (șterge tot și recreează tabelele curate)
        // ATENȚIE: { force: true } șterge toate datele vechi!
        await sequelize.sync({ force: true });
        console.log('🗑️  Baza de date a fost curățată.');

        // ===========================================
        // 2. BĂGĂM AVOCAȚII (Din lawyerData-ul tău)
        // ===========================================
        console.log('👨‍⚖️  Se introduc avocații...');
        
        const general = await Lawyer.create({
        slug: 'general',
        fullName: 'Av. Drăghici Cristian Constantin',
        role: 'Avocat Titular',
        // AICI E SCHIMBAREA: Fără punct, fără 'public'
        imagePath: '/img/17.jpg', 
        description: 'Specialist în drept Civil...',
        specialization: 'Civil / Comercial'
    });

    const cornea = await Lawyer.create({
        slug: 'cornea',
        fullName: 'Av. Cornea Daniel',
        role: 'Avocat Asociat',
        imagePath: '/img/28.jpg',
        description: 'Expertiză în litigii...',
        specialization: 'Penal'
    });

    const pistolea = await Lawyer.create({
        slug: 'pistolea',
        fullName: 'Av. Pistolea Mădălina',
        role: 'Avocat Asociat',
        imagePath: '/img/34.jpg',
        description: 'Specializat în dreptul familiei...',
        specialization: 'Familie'
    });

    const militaru = await Lawyer.create({
        slug: 'militaru',
        fullName: 'Av. Militaru Anca',
        role: 'Avocat Asociat',
        imagePath: '/img/38.jpg',
        description: 'Specializat în contencios...',
        specialization: 'Administrativ'
    });

        // ===========================================
        // 3. BĂGĂM ÎNTREBĂRILE (Wizard Steps)
        // ===========================================
        console.log('❓ Se introduc întrebările...');

        const start = await WizardStep.create({ slug: 'start', questionText: 'Cu ce tip de problemă juridică vă confruntați?' });
        const family = await WizardStep.create({ slug: 'family', questionText: 'Despre ce este vorba mai exact?' });
        const commercial = await WizardStep.create({ slug: 'commercial', questionText: 'Ce fel de situație comercială?' });
        const admin = await WizardStep.create({ slug: 'admin', questionText: 'Este vorba despre?' });
        const civil = await WizardStep.create({ slug: 'civil', questionText: 'Mai multe detalii?' });
        const criminal = await WizardStep.create({ slug: 'criminal', questionText: 'În ce stadiu este dosarul?' });

        // ===========================================
        // 4. BĂGĂM BUTOANELE (Wizard Options & Logic)
        // ===========================================
        console.log('🔀 Se creează logica de decizie...');

        // --- Întrebarea START ---
        await WizardOption.create({ label: 'Probleme de Familie', currentStepId: start.id, nextStepId: family.id });
        await WizardOption.create({ label: 'Litigii Comerciale', currentStepId: start.id, nextStepId: commercial.id });
        await WizardOption.create({ label: 'Probleme cu Statul / Taxe', currentStepId: start.id, nextStepId: admin.id });
        await WizardOption.create({ label: 'Moșteniri / Proprietăți', currentStepId: start.id, nextStepId: civil.id });
        await WizardOption.create({ label: 'Drept Penal', currentStepId: start.id, nextStepId: criminal.id });

        // --- Ramura FAMILY ---
        await WizardOption.create({ label: 'Divorț sau Partaj', currentStepId: family.id, recommendedLawyerId: pistolea.id });
        await WizardOption.create({ label: 'Custodie copii', currentStepId: family.id, recommendedLawyerId: pistolea.id });
        await WizardOption.create({ label: 'Altceva', currentStepId: family.id, recommendedLawyerId: general.id });

        // --- Ramura COMMERCIAL ---
        await WizardOption.create({ label: 'Insolvență / Faliment', currentStepId: commercial.id, recommendedLawyerId: general.id });
        await WizardOption.create({ label: 'Litigii între asociați', currentStepId: commercial.id, recommendedLawyerId: cornea.id });

        // --- Ramura ADMIN ---
        await WizardOption.create({ label: 'Contestație / ANAF', currentStepId: admin.id, recommendedLawyerId: militaru.id });

        // --- Ramura CIVIL ---
        await WizardOption.create({ label: 'Succesiune / Moștenire', currentStepId: civil.id, recommendedLawyerId: general.id });
        await WizardOption.create({ label: 'Revendicare imobiliară', currentStepId: civil.id, recommendedLawyerId: general.id });
        await WizardOption.create({ label: 'Executare silită', currentStepId: civil.id, recommendedLawyerId: cornea.id });
        
        // --- Ramura CRIMINAL ---
        await WizardOption.create({ label: 'Urmărire penală', currentStepId: criminal.id, recommendedLawyerId: cornea.id });
        await WizardOption.create({ label: 'Instanță', currentStepId: criminal.id, recommendedLawyerId: cornea.id });
        await WizardOption.create({ label: 'Consultantă', currentStepId: criminal.id, recommendedLawyerId: general.id });

        console.log('✅ GATA! Baza de date a fost populată cu succes.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Ceva a crăpat la seed:', error);
        process.exit(1);
    }
};

seedDatabase();
