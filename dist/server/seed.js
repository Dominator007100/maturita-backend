"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const storage_1 = require("./storage");
const seedNews = [
    {
        title: "NUKIB varuje: Nárůst ransomware útoků na české organizace",
        summary: "Národní úřad pro kybernetickou bezpečnost vydal varování před novými hrozbami cílenými na české organizace.",
        content: "Národní úřad pro kybernetickou a informační bezpečnost (NÚKIB) vydal varování před nárůstem ransomware útoků zaměřených na české organizace. Podle analýzy NÚKIB došlo v posledních měsících k výrazné eskalaci pokročilých kampaní, které zneužívají zranitelnosti v zastaralých systémech.\n\nÚtočníci využívají především phishingové e‑maily a zneužívají neaktualizované zranitelnosti ve VPN řešeních. NÚKIB doporučuje organizacím okamžitě aktualizovat své systémy, implementovat vícefaktorovou autentizaci a pravidelně zálohovat kritická data.\n\nÚřad také zdůrazňuje důležitost školení zaměstnanců v rozpoznávání phishingových útoků a hlášení podezřelých aktivit.",
        category: "Hrozby",
        source: "NÚKIB",
        sourceUrl: "https://nukib.gov.cz/cs/infoservis/aktuality/2215-nukib-v-roce-2024-zaznamenal-vice-kybernetickych-incidentu-nez-v-predchozich-letech/",
        imageUrl: null,
        featured: true,
    },
    {
        title: "Nová verze ISO/IEC 27001:2022 – klíčové změny pro organizace",
        summary: "Aktualizovaná norma přináší změny ve struktuře kontrolních opatření a klade větší důraz na cloudovou bezpečnost.",
        content: "Mezinárodní organizace pro standardizaci (ISO) zveřejnila aktualizovanou verzi normy ISO/IEC 27001:2022, která přináší významné změny oproti verzi z roku 2013.\n\nKlíčové změny zahrnují reorganizaci kontrolních opatření ze 114 na 93, rozdělení do čtyř tematických skupin místo původních 14 a přidání 11 nových kontrolních opatření.\n\nMezi nová opatření patří například: Cloud services security, ICT readiness for business continuity, Physical security monitoring, Data masking a Web filtering.\n\nOrganizace s existující certifikací mají přechodné období pro implementaci nové verze normy.",
        category: "Legislativa",
        source: "ISO",
        sourceUrl: "https://www.iso.org/standard/27001",
        imageUrl: null,
        featured: false,
    },
    {
        title: "Zero Trust architektura: Budoucnost firemní bezpečnosti",
        summary: "Proč tradiční perimetrický přístup nestačí a jak implementovat Zero Trust model ve vaší organizaci.",
        content: "Koncept Zero Trust se stává standardem moderní kybernetické bezpečnosti. Místo tradičního přístupu „důvěřuj a ověřuj“ zavádí princip „nikdy nedůvěřuj, vždy ověřuj“.\n\nZero Trust architektura vyžaduje ověřování každé transakce, minimalizaci přístupových práv a předpoklad, že síť může být kompromitována. Klíčové komponenty zahrnují identitu jako nový perimetr, mikrosegmentaci sítě, kontinuální monitorování a analýzu.\n\nImplementace Zero Trust je postupný proces zahrnující mapování datových toků, zavedení silné autentizace, segmentaci sítě a nasazení nástrojů pro detekci anomálií.",
        category: "Technologie",
        source: "NIST",
        sourceUrl: "https://www.nist.gov/publications/zero-trust-architecture",
        imageUrl: null,
        featured: false,
    },
    {
        title: "CSIRT.CZ: Aktuální přehled kybernetických incidentů v ČR",
        summary: "Národní CSIRT tým zveřejnil přehled nejzávažnějších kybernetických incidentů za poslední období.",
        content: "CSIRT.CZ, národní tým pro reakci na počítačové bezpečnostní incidenty, pravidelně zveřejňuje přehled nejzávažnějších kybernetických incidentů v České republice.\n\nMezi nejčastější typy incidentů patří phishingové kampaně, ransomware útoky, DDoS útoky a zneužívání zranitelností ve webových aplikacích. CSIRT.CZ také poskytuje doporučení pro prevenci a reakci na tyto incidenty.\n\nOrganizace mohou hlásit bezpečnostní incidenty prostřednictvím oficiálního portálu CSIRT.CZ a získat podporu při jejich řešení.",
        category: "Incidenty",
        source: "CSIRT.CZ",
        sourceUrl: "https://csirt.cz/en/",
        imageUrl: null,
        featured: false,
    },
    {
        title: "Směrnice NIS2: Co musí české firmy splnit",
        summary: "Kompletní přehled nových povinností pro české organizace vyplývajících ze směrnice NIS2.",
        content: "Směrnice NIS2 (Network and Information Security Directive 2) výrazně rozšiřuje požadavky na kybernetickou bezpečnost v EU. Česká republika připravuje nový zákon o kybernetické bezpečnosti, který směrnici transponuje.\n\nNové povinnosti zahrnují: řízení rizik, zabezpečení dodavatelského řetězce, povinné hlášení incidentů do 24 hodin, školení managementu a vyšší pokuty za nesplnění požadavků.\n\nOrganizace by měly provést gap analýzu, identifikovat oblasti nesouladu a připravit plán implementace s dostatečným předstihem.",
        category: "Legislativa",
        source: "EUR-Lex",
        sourceUrl: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj/eng",
        imageUrl: null,
        featured: false,
    },
    {
        title: "ENISA: Zpráva o stavu kybernetických hrozeb v EU",
        summary: "Evropská agentura pro kybernetickou bezpečnost publikovala výroční zprávu o nejzávažnějších hrozbách.",
        content: "Evropská agentura pro síťovou a informační bezpečnost (ENISA) vydala výroční zprávu Threat Landscape, která analyzuje hlavní kybernetické hrozby v Evropě.\n\nMezi nejvýznamnější hrozby patří ransomware, malware, sociální inženýrství, útoky na data, útoky na dostupnost (DDoS) a útoky na dodavatelský řetězec. Zpráva zdůrazňuje rostoucí sofistikovanost útočníků a využívání umělé inteligence.\n\nENISA doporučuje organizacím pravidelně hodnotit bezpečnostní rizika a implementovat vícevrstvý přístup k ochraně.",
        category: "Hrozby",
        source: "ENISA",
        sourceUrl: "https://www.enisa.europa.eu/publications/enisa-threat-landscape-2024",
        imageUrl: null,
        featured: false,
    },
    {
        title: "Phishing kampaně v ČR: Jak se bránit",
        summary: "Analýza nejčastějších phishingových kampaní cílených na české uživatele a doporučení pro ochranu.",
        content: "Podle dat CZ.NIC a CSIRT.CZ došlo k výraznému nárůstu phishingových kampaní zaměřených na české uživatele. Nejčastěji zneužívané značky zahrnují Českou poštu, bankovní instituce a energetické společnosti.\n\nNové trendy zahrnují využití QR kódů (quishing), smishing (SMS phishing) a deepfake hlasové zprávy. Útočníci také častěji využívají legitimní cloudové služby pro hosting phishingových stránek.\n\nDoporučení pro organizace: implementace DMARC, SPF a DKIM, pravidelné phishingové simulace a školení zaměstnanců.",
        category: "Vzdělávání",
        source: "NÚKIB",
        sourceUrl: "https://nukib.gov.cz/cs/infoservis/hrozby/2182-upozornujeme-na-zneuzivani-identit-amazon-microsoft-a-ceskych-instituci/",
        imageUrl: null,
        featured: false,
    },
    {
        title: "Kybernetická bezpečnost v Průmyslu 4.0: OT security",
        summary: "Zabezpečení operačních technologií je klíčové s rostoucí digitalizací průmyslové výroby.",
        content: "S nástupem Průmyslu 4.0 a propojováním IT a OT systémů vzniká nová kategorie bezpečnostních rizik. Průmyslové řídicí systémy (ICS), SCADA systémy a IoT zařízení často postrádají dostatečné bezpečnostní mechanismy.\n\nKlíčové výzvy zahrnují zastaralé protokoly bez šifrování, dlouhé životní cykly zařízení, omezené možnosti patchování a nedostatek viditelnosti do OT provozu.\n\nDoporučení: segmentace IT a OT sítí, monitoring OT provozu, asset management a incident response plány specifické pro OT prostředí.",
        category: "Technologie",
        source: "NÚKIB",
        sourceUrl: "https://nukib.gov.cz/cs/infoservis/doporuceni/",
        imageUrl: null,
        featured: false,
    },
];
async function seedDatabase() {
    try {
        const articleCount = await storage_1.storage.getNewsArticleCount();
        if (articleCount > 0) {
            console.log("Database already seeded, skipping...");
            return;
        }
        console.log("Seeding database with news articles...");
        for (const article of seedNews) {
            await storage_1.storage.createNewsArticle({ ...article });
        }
        console.log(`Seeded ${seedNews.length} news articles.`);
        const sampleSubmissions = [
            {
                respondentName: "Jan Novák",
                respondentEmail: "jan.novak@firma.cz",
                companyName: "TechCorp s.r.o.",
                answers: { q1: 2, q2: 2, q3: 3, q4: 2, q5: 3, q6: 2, q7: 2, q8: 1, q9: 2, q10: 1, q11: 2, q12: 1 },
                totalScore: 23,
                maxScore: 36,
                percentScore: 64,
                riskLevel: "Střední",
            },
            {
                respondentName: "Eva Svobodová",
                respondentEmail: "eva@securebank.cz",
                companyName: "SecureBank a.s.",
                answers: { q1: 3, q2: 3, q3: 3, q4: 3, q5: 3, q6: 3, q7: 3, q8: 3, q9: 3, q10: 2, q11: 3, q12: 3 },
                totalScore: 35,
                maxScore: 36,
                percentScore: 97,
                riskLevel: "Nízké",
            },
            {
                respondentName: "Petr Dvořák",
                respondentEmail: "petr@mala-firma.cz",
                companyName: "Malá Firma s.r.o.",
                answers: { q1: 0, q2: 0, q3: 1, q4: 0, q5: 1, q6: 0, q7: 0, q8: 0, q9: 1, q10: 0, q11: 0, q12: 0 },
                totalScore: 3,
                maxScore: 36,
                percentScore: 8,
                riskLevel: "Kritické",
            },
            {
                respondentName: "Marie Králová",
                respondentEmail: "marie@stredni-podnik.cz",
                companyName: "Střední Podnik a.s.",
                answers: { q1: 2, q2: 1, q3: 2, q4: 1, q5: 2, q6: 1, q7: 1, q8: 1, q9: 2, q10: 1, q11: 1, q12: 1 },
                totalScore: 16,
                maxScore: 36,
                percentScore: 44,
                riskLevel: "Zvýšené",
            },
            {
                respondentName: "Tomáš Kučera",
                respondentEmail: "tomas@it-solutions.cz",
                companyName: "IT Solutions s.r.o.",
                answers: { q1: 3, q2: 2, q3: 3, q4: 3, q5: 3, q6: 2, q7: 2, q8: 2, q9: 3, q10: 2, q11: 2, q12: 2 },
                totalScore: 29,
                maxScore: 36,
                percentScore: 81,
                riskLevel: "Nízké",
            },
        ];
        for (const sub of sampleSubmissions) {
            await storage_1.storage.createQuizSubmission(sub);
        }
        console.log(`Seeded ${sampleSubmissions.length} quiz submissions.`);
    }
    catch (error) {
        console.error("Error seeding database:", error);
    }
}
