import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";


export const emailSubscriptions = pgTable("email_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  confirmed: boolean("confirmed").default(true).notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("admin").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const insertUserSchema = z.object({
  email: z.string().email(),
  passwordHash: z.string(),
  role: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;


export const quizSubmissions = pgTable("quiz_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  respondentName: text("respondent_name").notNull(),
  respondentEmail: text("respondent_email").notNull(),
  companyName: text("company_name"),
  answers: jsonb("answers").notNull().$type<Record<string, number>>(),
  totalScore: integer("total_score").notNull(),
  maxScore: integer("max_score").notNull(),
  percentScore: integer("percent_score").notNull(),
  riskLevel: text("risk_level").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertQuizSubmissionSchema = createInsertSchema(quizSubmissions).omit({
  id: true,
  submittedAt: true,
});

export type InsertQuizSubmission = z.infer<typeof insertQuizSubmissionSchema>;
export type QuizSubmission = typeof quizSubmissions.$inferSelect;

export const newsArticles = pgTable("news_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  source: text("source").notNull(),
  sourceUrl: text("source_url"),
  imageUrl: text("image_url"),
publishedAt: timestamp("published_at"),
  featured: boolean("featured").default(false),
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
}).extend({
  publishedAt: z.date().optional(),
});

export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;

export type QuizQuestionType = "choice" | "phishing_email" | "phishing_url";

export interface QuizOption {
  value: number;
  label: string;
}

export interface PhishingEmail {
  from: string;
  subject: string;
  body: string;
  isPhishing: boolean;
  clues: string[];
}

export interface PhishingUrl {
  url: string;
  isPhishing: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  type: QuizQuestionType;
  options?: QuizOption[];
  explanation?: string;
  phishingEmail?: PhishingEmail;
  phishingUrls?: PhishingUrl[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    type: "choice",
    category: "Základy bezpečnosti",
    question: "Co je hlavním účelem firewallu?",
    explanation:
      "Firewall je síťové bezpečnostní zařízení, které monitoruje a filtruje příchozí a odchozí síťový provoz na základě definovaných bezpečnostních pravidel. Jeho hlavní funkcí je blokovat neoprávněný přístup a chránit vnitřní síť před hrozbami z internetu.",
    options: [
      { value: 0, label: "Zrychluje připojení k internetu" },
      { value: 1, label: "Ukládá hesla uživatelů" },
      { value: 2, label: "Skenuje soubory na viry" },
      { value: 3, label: "Filtruje síťový provoz a blokuje neoprávněný přístup" },
    ],
  },
  {
    id: "q2",
    type: "choice",
    category: "Základy bezpečnosti",
    question: "Co znamená zkratka VPN?",
    explanation:
      "VPN znamená Virtual Private Network (virtuální privátní síť). Vytváří šifrovaný tunel mezi vaším zařízením a serverem, čímž chrání komunikaci a skrývá vaši IP adresu. Používá se pro bezpečný vzdálený přístup do firemní sítě i pro ochranu soukromí na veřejných Wi‑Fi sítích.",
    options: [
      { value: 0, label: "Very Private Network" },
      { value: 1, label: "Virtual Personal Network" },
      { value: 2, label: "Visible Protected Node" },
      { value: 3, label: "Virtual Private Network" },
    ],
  },
  {
    id: "q3",
    type: "choice",
    category: "Hesla a autentizace",
    question: "Které heslo je nejbezpečnější?",
    explanation:
      "Bezpečné heslo by mělo být dlouhé alespoň 12 znaků, obsahovat kombinaci velkých a malých písmen, číslic a speciálních znaků a nemělo by obsahovat snadno uhodnutelné informace. Náhodně generovaná hesla, jako například „k9$Lm!pQ2x&vR7w“, jsou nejodolnější vůči útokům hrubou silou.",
    options: [
      { value: 0, label: "password123" },
      { value: 1, label: "MojeJmeno2024" },
      { value: 2, label: "Heslo!Firma" },
      { value: 3, label: "k9$Lm!pQ2x&vR7w" },
    ],
  },
  {
    id: "q4",
    type: "choice",
    category: "Hesla a autentizace",
    question: "Co je vícefaktorová autentizace (MFA)?",
    explanation:
      "Vícefaktorová autentizace (MFA) vyžaduje ověření identity pomocí dvou či více nezávislých faktorů: něco, co víte (heslo), něco, co máte (telefon, token), a něco, čím jste (otisk prstu). Kombinace těchto faktorů výrazně zvyšuje bezpečnost.",
    options: [
      { value: 0, label: "Použití jednoho silného hesla" },
      { value: 1, label: "Přihlášení pomocí otisku prstu" },
      { value: 2, label: "Použití dvou různých hesel" },
      { value: 3, label: "Ověření identity pomocí dvou a více nezávislých faktorů (např. heslo + SMS kód)" },
    ],
  },
  {
    id: "q5",
    type: "choice",
    category: "Síťová bezpečnost",
    question: "Co označuje protokol HTTPS?",
    explanation:
      "HTTPS (HyperText Transfer Protocol Secure) je zabezpečená verze protokolu HTTP, která používá šifrování TLS/SSL pro ochranu dat přenášených mezi prohlížečem a webovým serverem. Poznáte jej podle ikony zámku v adresním řádku.",
    options: [
      { value: 0, label: "Rychlejší verzi protokolu HTTP" },
      { value: 1, label: "Protokol pro stahování souborů" },
      { value: 2, label: "Protokol pouze pro e‑mailovou komunikaci" },
      { value: 3, label: "Zabezpečenou verzi HTTP se šifrováním pomocí TLS/SSL" },
    ],
  },
  {
    id: "q6",
    type: "choice",
    category: "Síťová bezpečnost",
    question:
      "Jaký typ útoku zaplavuje server obrovským množstvím požadavků, aby ho vyřadil z provozu?",
    explanation:
      "DDoS (Distributed Denial of Service) útok využívá velké množství infikovaných zařízení (botnet), která posílají obrovské množství požadavků na cílový server. Ten se následně zahltí a stává se nedostupným pro legitimní uživatele.",
    options: [
      { value: 0, label: "Phishing" },
      { value: 1, label: "Man‑in‑the‑Middle" },
      { value: 2, label: "SQL Injection" },
      { value: 3, label: "DDoS (Distributed Denial of Service)" },
    ],
  },
  {
    id: "q7",
    type: "choice",
    category: "Hrozby a útoky",
    question: "Co je ransomware?",
    explanation:
      "Ransomware je typ škodlivého softwaru, který po infikování zařízení zašifruje data oběti a požaduje zaplacení výkupného za jejich dešifrování. Šíří se nejčastěji prostřednictvím phishingových e‑mailů nebo škodlivých příloh.",
    options: [
      { value: 0, label: "Antivirový program" },
      { value: 1, label: "Typ firewallu" },
      { value: 2, label: "Nástroj pro zálohování dat" },
      { value: 3, label: "Škodlivý software, který šifruje data a požaduje výkupné" },
    ],
  },
  {
    id: "q8",
    type: "choice",
    category: "Hrozby a útoky",
    question: "Co je social engineering (sociální inženýrství)?",
    explanation:
      "Sociální inženýrství je technika manipulace s lidmi za účelem získání důvěrných informací, přístupu k systémům nebo finančních prostředků. Útočníci využívají psychologické triky, jako je naléhavost, autorita nebo důvěra.",
    options: [
      { value: 0, label: "Vývoj sociálních sítí" },
      { value: 1, label: "Správa účtů na sociálních sítích" },
      { value: 2, label: "Oprava chyb v softwaru" },
      { value: 3, label: "Manipulace s lidmi za účelem získání důvěrných informací" },
    ],
  },
  {
    id: "q9",
    type: "choice",
    category: "Ochrana dat",
    question: "Jaký je nejbezpečnější způsob zálohování důležitých dat?",
    explanation:
      "Pravidlo 3‑2‑1 je osvědčená strategie zálohování: 3 kopie dat, na 2 různých typech médií, z toho 1 kopie mimo hlavní pracoviště. Tento přístup chrání data před selháním hardwaru, krádeží, požárem i ransomwarem.",
    options: [
      { value: 0, label: "Uložení všech dat na jednom USB disku" },
      { value: 1, label: "Zálohování pouze na lokální pevný disk" },
      { value: 2, label: "Zálohování do jednoho cloudového úložiště" },
      { value: 3, label: "Pravidlo 3‑2‑1: tři kopie na dvou různých médiích, jedna mimo pracoviště" },
    ],
  },
  {
    id: "q10",
    type: "choice",
    category: "Ochrana dat",
    question: "Co je to šifrování dat?",
    explanation:
      "Šifrování je proces převodu čitelných dat do nečitelné podoby pomocí matematických algoritmů. Data lze zpět dešifrovat pouze pomocí správného klíče. Používá se k ochraně citlivých informací při přenosu i při ukládání.",
    options: [
      { value: 0, label: "Mazání nepotřebných souborů" },
      { value: 1, label: "Komprese dat pro úsporu místa" },
      { value: 2, label: "Přemístění dat na jiný server" },
      { value: 3, label: "Převod dat do nečitelné formy, kterou lze dešifrovat pouze správným klíčem" },
    ],
  },
  {
    id: "q11",
    type: "choice",
    category: "Předpisy a standardy",
    question: "Co je NÚKIB v kontextu kybernetické bezpečnosti v ČR?",
    explanation:
      "NÚKIB (Národní úřad pro kybernetickou a informační bezpečnost) je ústřední orgán státní správy pro oblast kybernetické bezpečnosti v České republice. Koordinuje reakce na incidenty, vydává varování a doporučení a dohlíží na dodržování zákona o kybernetické bezpečnosti.",
    options: [
      { value: 0, label: "Antivirový program" },
      { value: 1, label: "Typ šifrovacího algoritmu" },
      { value: 2, label: "Mezinárodní bezpečnostní standard" },
      { value: 3, label: "Národní úřad pro kybernetickou a informační bezpečnost" },
    ],
  },
  {
    id: "q12",
    type: "choice",
    category: "Předpisy a standardy",
    question: "Co upravuje směrnice NIS2 v Evropské unii?",
    explanation:
      "Směrnice NIS2 stanovuje požadavky na kybernetickou bezpečnost pro důležité organizace a kritickou infrastrukturu. Rozšiřuje působnost původní směrnice NIS1 a zavádí přísnější sankce za nedodržení.",
    options: [
      { value: 0, label: "Ochranu osobních údajů (GDPR)" },
      { value: 1, label: "Licencování softwaru" },
      { value: 2, label: "Regulaci sociálních sítí" },
      { value: 3, label: "Požadavky na kybernetickou bezpečnost pro důležité organizace a infrastrukturu" },
    ],
  },
  {
    id: "q13",
    type: "phishing_email",
    category: "Phishing simulace",
    question:
      "Simulační úkol: Přečtěte si následující e‑mail a rozhodněte, zda jde o phishing, nebo legitimní zprávu.",
    phishingEmail: {
      from: "bezpecnost@csska-posta.cz",
      subject: "Vaše zásilka čeká na doručení – ověření údajů",
      body:
        "Vážený zákazníku,\n\nVaše zásilka č. CZ‑2024‑88291 nemohla být doručena kvůli neúplné adrese. Pro dokončení doručení prosím klikněte na odkaz níže a aktualizujte své údaje včetně čísla platební karty.\n\nAktualizovat údaje: http://ceska-posta-doruceni.com/overeni\n\nPokud neprovedete ověření do 24 hodin, zásilka bude vrácena odesílateli.\n\nS pozdravem,\nZákaznický servis České pošty",
      isPhishing: true,
      clues: [
        "Podezřelá doména odesílatele: csska‑posta.cz (překlep v názvu)",
        "Požadavek na číslo platební karty",
        "Neoficiální doména: ceska‑posta‑doruceni.com",
        "Nátlak na rychlé jednání (24 hodin)",
        "Obecné oslovení bez jména",
      ],
    },
    options: [
      { value: 3, label: "Phishing – tento e‑mail je podvodný" },
      { value: 0, label: "Legitimní – tento e‑mail je pravdivý" },
    ],
  },
  {
    id: "q14",
    type: "phishing_email",
    category: "Phishing simulace",
    question:
      "Simulační úkol: Přečtěte si následující e‑mail a rozhodněte, zda jde o phishing, nebo legitimní zprávu.",
    phishingEmail: {
      from: "noreply@microsoft.com",
      subject: "Potvrzení změny hesla k vašemu účtu",
      body:
        "Dobrý den,\n\nPotvrzujeme, že heslo k vašemu účtu jan.novak@firma.cz bylo úspěšně změněno dne 15. 1. 2025 ve 14:32.\n\nPokud jste tuto změnu neprovedli vy, okamžitě kontaktujte podporu na https://account.microsoft.com/security\n\nS pozdravem,\nTým zabezpečení účtů Microsoft",
      isPhishing: false,
      clues: [
        "Legitimní doména odesílatele: microsoft.com",
        "Oficiální URL adresa: account.microsoft.com",
        "Nežádá žádné citlivé údaje",
        "Obsahuje konkrétní informace (datum, čas, e‑mail)",
        "Standardní formát bezpečnostního oznámení",
      ],
    },
    options: [
      { value: 0, label: "Phishing – tento e‑mail je podvodný" },
      { value: 3, label: "Legitimní – tento e‑mail je pravdivý" },
    ],
  },
  {
    id: "q15",
    type: "phishing_url",
    category: "Phishing simulace",
    question:
      "Praktický úkol: Mezi následujícími URL adresami je jedna podvodná. Najdete ji?",
    phishingUrls: [
      {
        url: "https://www.mojebanka.cz/internetbanking",
        isPhishing: false,
        explanation: "Oficiální doména banky s HTTPS.",
      },
      {
        url: "https://www.m0jebanka-prihlaseni.com/login",
        isPhishing: true,
        explanation:
          "Podvržená doména: číslice 0 místo písmene „o“, jiná doménová koncovka (.com místo .cz).",
      },
      {
        url: "https://portal.gov.cz/sluzby",
        isPhishing: false,
        explanation: "Oficiální vládní portál České republiky.",
      },
    ],
    options: [
      { value: 0, label: "https://www.mojebanka.cz/internetbanking" },
      { value: 3, label: "https://www.m0jebanka-prihlaseni.com/login" },
      { value: 1, label: "https://portal.gov.cz/sluzby" },
    ],
  },
];
