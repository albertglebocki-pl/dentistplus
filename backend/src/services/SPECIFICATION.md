> ⚠️ **Dokument wewnętrzny — wyłącznie dla zespołu deweloperskiego.**

## Spis treści

- [Autoryzacja](#autoryzacja)
- [Role użytkowników](#role-użytkowników)
- [Struktura plików](#struktura-plików)
- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [Visits](#visits)
  - [Procedures](#procedures)
  - [Payments](#payments)
  - [Catalog](#catalog)
  - [Patients](#patients)
  - [Teeth](#teeth)
  - [Images](#images)
- [Schematy baz danych](#schematy-baz-danych)

---

## Autoryzacja

Wszystkie chronione endpointy wymagają nagłówka:

```
Authorization: Bearer <token>
```

Token JWT jest zwracany przy logowaniu i rejestracji. Ważność tokenu: **7 dni**.

Payload JWT:
```json
{
  "userId": 1,
  "role": "USER" | "DOCTOR" | "ADMIN",
  "exp": 1234567890
}
```

---

## Role użytkowników

| Rola | Opis |
|------|------|
| `USER` | Pacjent — widzi swoje dane, historię leczenia, płatności, zdjęcia |
| `DOCTOR` | Lekarz — zarządza pacjentami, tworzy procedury, wystawia płatności, wgrywa zdjęcia |
| `ADMIN` | Administrator — zarządza katalogiem zabiegów |

---

## Struktura plików

```
backend/src/
├── app.ts
├── openapi.ts
├── postgres/
│   ├── connection.ts
│   └── schema.ts
├── mongo/
│   └── schema.ts
└── services/
    ├── auth/
    │   ├── middleware.ts
    │   ├── service.ts
    │   └── routes/
    │       ├── login.ts
    │       ├── register.ts
    │       └── me.ts
    ├── visits/
    │   ├── service.ts
    │   └── routes/
    │       ├── list.ts
    │       ├── slots.ts
    │       ├── detail.ts
    │       ├── create.ts
    │       ├── update.ts
    │       └── cancel.ts
    ├── procedures/
    │   ├── service.ts
    │   └── routes/
    │       ├── list.ts
    │       ├── detail.ts
    │       ├── create.ts
    │       └── update.ts
    ├── payments/
    │   ├── service.ts
    │   └── routes/
    │       ├── list.ts
    │       ├── detail.ts
    │       ├── create.ts
    │       ├── pay.ts
    │       └── fail.ts
    ├── catalog/
    │   ├── service.ts
    │   └── routes/
    │       ├── list.ts
    │       ├── detail.ts
    │       ├── create.ts
    │       ├── update.ts
    │       └── deactivate.ts
    ├── patients/
    │   ├── service.ts
    │   └── routes/
    │       ├── list.ts
    │       ├── me.ts
    │       └── detail.ts
    ├── teeth/
    │   ├── service.ts
    │   └── routes/
    │       ├── status.ts
    │       ├── update.ts
    │       └── procedures.ts
    └── images/
        ├── service.ts
        └── routes/
            ├── upload.ts
            ├── list.ts
            ├── detail.ts
            └── delete.ts
```

---

## Endpoints

> **Legenda:**
> - 🔓 Publiczny (bez tokenu)
> - 🔑 Wymaga tokenu JWT (dowolna rola)
> - 👤 Tylko `USER` (pacjent)
> - 🩺 Tylko `DOCTOR`
> - 🛡️ Tylko `ADMIN`
> - 🩺👤 `DOCTOR` lub `USER` (z ograniczeniami właściciela)

---

### Auth

#### `POST /auth/login` 🔓

Logowanie. Zwraca token JWT.

**Body:**
```json
{
  "email": "jan@example.com",
  "password": "haslo123"
}
```

**Odpowiedź `200`:**
```json
{
  "token": "eyJ...",
  "user": {
    "id": 1,
    "email": "jan@example.com",
    "role": "USER"
  }
}
```

**Błędy:** `400` brak pól, `401` nieprawidłowe dane

---

#### `POST /auth/register` 🔓

Rejestracja nowego pacjenta.

**Body:**
```json
{
  "email": "jan@example.com",
  "password": "haslo123",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "address": "Adres 123a",
  "phoneNumber": "111222333" 
}
```

**Odpowiedź `201`:**
```json
{
  "token": "eyJ...",
  "user": { "id": 1, "email": "jan@example.com", "role": "USER" }
}
```

**Błędy:** `400` brak pól, `409` email już istnieje

---

#### `GET /auth/me` 🔑

Zwraca profil zalogowanego użytkownika.

**Odpowiedź `200`:**
```json
{
  "id": 1,
  "email": "jan@example.com",
  "role": "USER",
  "active": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "address": "ul. Zębowa 1, Warszawa",
  "phoneNumber": "500600700"
}
```

---

### Visits

#### `GET /visits` 🔑

Lista wizyt zalogowanego użytkownika. Pacjent widzi swoje, lekarz widzi swoje.

**Odpowiedź `200`:** tablica obiektów `Visit` posortowana malejąco po `dateTime`

---

#### `GET /visits/doctor/:doctorId/slots?date=YYYY-MM-DD` 🔑

Zajęte sloty lekarza w danym dniu. Służy do wyświetlania kalendarza przy umawianiu.

**Parametry:**
- `:doctorId` — id lekarza (integer)
- `?date` — data w formacie `YYYY-MM-DD` (wymagany)

**Odpowiedź `200`:**
```json
{
  "bookedSlots": [
    { "dateTime": "2024-06-01T09:00:00.000Z", "durationMinutes": 60 }
  ]
}
```

**Błędy:** `400` brak parametru `date`

---

#### `GET /visits/:id` 🔑

Szczegóły konkretnej wizyty. Pacjent może pobrać tylko własną, lekarz tylko swoją.

**Błędy:** `403` brak dostępu, `404` nie znaleziono

---

#### `POST /visits` 🩺👤

Umów wizytę.

- `USER` podaje `doctorId` — umawia siebie do lekarza
- `DOCTOR` podaje `patientId` — umawia pacjenta do siebie

**Body:**
```json
{
  "doctorId": 5,
  "dateTime": "2024-06-01T10:00:00.000Z",
  "durationMinutes": 60,
  "description": "Kontrola"
}
```

**Odpowiedź `201`:** obiekt `Visit`

**Błędy:** `400` brak pól, `404` lekarz nie znaleziony, `409` kolizja terminu

---

#### `PATCH /visits/:id` 🔑

Zmiana terminu lub opisu wizyty. Tylko wizyty o statusie `BOOKED`. Właściciel wizyty.

**Body** (wszystkie pola opcjonalne):
```json
{
  "dateTime": "2024-06-02T11:00:00.000Z",
  "durationMinutes": 45,
  "description": "Zmieniony opis"
}
```

**Błędy:** `400` status != BOOKED, `403` brak dostępu, `409` kolizja terminu

---

#### `POST /visits/:id/cancel` 🔑

Anulowanie wizyty. Tylko wizyty o statusie `BOOKED`. Właściciel wizyty.

Ustawia `status: "CANCELLED"` oraz `cancelledAd: now()`.

**Błędy:** `400` status != BOOKED, `403` brak dostępu, `404` nie znaleziono

---

### Procedures

#### `GET /procedures` 🔑

Historia leczenia.

- `USER` — widzi tylko swoje procedury
- `DOCTOR` — widzi swoje procedury, opcjonalnie filtruje po `?patientId=X`
- `ADMIN` — widzi wszystkie, filtruje po `?patientId=X`

**Query params:** `?patientId=1` (opcjonalny)

**Odpowiedź `200`:** tablica `MedicalProcedure` z wypełnionym `treatments.catalogItemId`

---

#### `GET /procedures/:id` 🔑

Szczegóły procedury. Pacjent widzi tylko swoje, lekarz tylko swoje.

---

#### `POST /procedures` 🩺

Utwórz procedurę medyczną po wizycie.

**Body:**
```json
{
  "patientId": 3,
  "visitId": "664abc123...",
  "date": "2024-06-01T10:30:00.000Z",
  "description": "Leczenie kanałowe",
  "treatments": [
    {
      "tooth": "36",
      "catalogItemId": "664def456...",
      "description": "Kanał boczny",
      "cost": 350
    }
  ]
}
```

> Jeśli podano `visitId` i wizyta jest `BOOKED` i należy do tego lekarza i pacjenta — wizyta zostaje automatycznie oznaczona jako `COMPLETED` i podlinkowana do procedury.

**Odpowiedź `201`:** obiekt `MedicalProcedure`

**Błędy:** `400` brak wymaganych pól lub nieaktywna pozycja katalogu

---

#### `PATCH /procedures/:id` 🩺

Edycja procedury. Tylko lekarz który ją utworzył.

**Body** (wszystkie pola opcjonalne):
```json
{
  "description": "Zaktualizowany opis",
  "date": "2024-06-01T11:00:00.000Z",
  "treatments": [ ... ]
}
```

> Koszt (`cost`) jest automatycznie przeliczany jako suma `treatments[].cost`.

---

### Payments

#### `GET /payments` 🔑

Lista płatności.

- `USER` — własne płatności
- `DOCTOR` — płatności powiązane z jego procedurami
- `ADMIN` — wszystkie płatności

---

#### `GET /payments/:id` 🔑

Szczegóły płatności. Pacjent widzi tylko swoje, lekarz widzi powiązane ze swoimi procedurami.

---

#### `POST /payments` 🩺

Wystaw płatność za procedurę medyczną.

**Body:**
```json
{
  "medicalProcedureId": "664abc...",
  "amount": 350,
  "successUrl": "https://example.com/success",
  "errorUrl": "https://example.com/error"
}
```

Płatność otrzymuje unikalny `token` (UUID) do użycia w linku dla pacjenta.

**Błędy:** `400` brak pól, `403` cudza procedura, `404` procedura nie istnieje, `409` płatność już istnieje

---

#### `POST /payments/pay/:token` 🔓

**Mock bramki płatniczej** — bez autoryzacji. Pacjent otwiera link z tokenem.

Ustawia `status: "COMPLETED"` i `paidAt: now()`.

**Odpowiedź `200`:**
```json
{
  "success": true,
  "message": "Płatność zrealizowana",
  "redirectUrl": "https://example.com/success"
}
```

**Błędy:** `400` płatność już zrealizowana lub anulowana, `404` nie znaleziono

---

#### `POST /payments/fail/:token` 🔓

**Mock nieudanej płatności** — tylko do testów. Ustawia `status: "FAILED"`.

**Błędy:** `400` płatność nie jest w statusie `PENDING`

---

### Catalog

#### `GET /catalog` 🔑

Lista aktywnych zabiegów. Admin może dodać `?includeInactive=true` żeby zobaczyć też nieaktywne.

**Odpowiedź `200`:**
```json
[
  {
    "_id": "664abc...",
    "name": "Leczenie kanałowe",
    "descritpion": "Opis zabiegu",
    "defaultCost": 300,
    "active": true
  }
]
```

> ⚠️ Literówka `descritpion` pochodzi ze schematu Mongo — nie zmieniać bez migracji danych.

---

#### `GET /catalog/:id` 🔑

Szczegóły pozycji katalogu.

---

#### `POST /catalog` 🛡️

Dodaj nowy zabieg do katalogu.

**Body:**
```json
{
  "name": "Wybielanie zębów",
  "description": "Zabieg wybielania",
  "defaultCost": 400
}
```

---

#### `PATCH /catalog/:id` 🛡️

Edycja zabiegu. Można zmienić `name`, `description`, `defaultCost`, `active`.

---

#### `DELETE /catalog/:id` 🛡️

**Miękkie usunięcie** — ustawia `active: false`. Dane historyczne pozostają nienaruszone.

---

### Patients

#### `GET /patients` 🩺🛡️

Lista wszystkich pacjentów (`role = USER`) z danymi osobowymi.

---

#### `GET /patients/me` 🔑

Własny profil z danymi osobowymi.

---

#### `PATCH /patients/me` 🔑

Aktualizacja własnych danych osobowych.

**Body:**
```json
{
  "firstName": "Jan",
  "lastName": "Kowalski",
  "address": "ul. Zębowa 1, Warszawa",
  "phoneNumber": "500600700"
}
```

---

#### `GET /patients/:id` 🔑

Profil pacjenta. Pacjent może pobrać tylko własny, lekarz i admin każdego.

---

### Teeth

#### `GET /patients/:patientId/teeth` 🔑

Stan wszystkich zębów pacjenta. Pacjent widzi tylko swoje, lekarz każdego.

**Odpowiedź `200`:**
```json
[
  { "tooth": "11", "status": "zdrowy" },
  { "tooth": "36", "status": "leczony kanalowo" }
]
```

> Jeśli pacjent nie ma jeszcze rekordu w Mongo — zostaje automatycznie utworzony z pustą listą.

---

#### `PUT /patients/:patientId/teeth` 🩺

Zastąp cały stan zębów pacjenta (operacja na całej tablicy).

**Body:**
```json
{
  "toothStatusList": [
    { "tooth": "11", "status": "zdrowy" },
    { "tooth": "36", "status": "wypełnienie" }
  ]
}
```

---

#### `PATCH /patients/:patientId/teeth/:tooth` 🩺

Aktualizacja statusu jednego zęba. Jeśli ząb nie istnieje na liście — zostaje dodany.

**Parametry:** `:tooth` — numer zęba wg. notacji FDI np. `11`, `36`, `48`

**Body:**
```json
{ "status": "do ekstrakcji" }
```

---

#### `GET /patients/:patientId/teeth/:tooth/procedures` 🔑

Wszystkie zabiegi wykonane na konkretnym zębie. Pacjent widzi tylko swoje, lekarz każdego.

**Odpowiedź `200`:**
```json
[
  {
    "procedureId": "664abc...",
    "date": "2024-06-01T10:00:00.000Z",
    "doctorId": 5,
    "treatments": [
      {
        "tooth": "36",
        "catalogItemId": { "name": "Leczenie kanałowe", "defaultCost": 300 },
        "cost": 350
      }
    ]
  }
]
```

---

### Images

#### `GET /patients/:patientId/images` 🔑

Lista zdjęć pacjenta. Każde zdjęcie zawiera presigned URL ważny **1 godzinę**.

Pacjent widzi tylko swoje, lekarz każdego.

**Odpowiedź `200`:**
```json
[
  {
    "id": "664abc...",
    "filename": "rtg_36.jpg",
    "mimeType": "image/jpeg",
    "uploadedBy": 5,
    "createdAt": "2024-06-01T10:00:00.000Z",
    "url": "http://storage:3902/patient-images/patients/3/uuid.jpg?X-Amz-..."
  }
]
```

---

#### `POST /patients/:patientId/images` 🩺

Wgraj zdjęcie pacjenta (RTG, zdjęcie kliniczne itp.).

**Content-Type:** `multipart/form-data`

**Body:** pole `file` — plik binarny

**Ograniczenia:**
- Dozwolone formaty: `image/jpeg`, `image/png`, `image/webp`
- Maksymalny rozmiar: **10 MB**

**Odpowiedź `201`:** obiekt `PatientImage` (bez presigned URL — pobierz przez `GET`)

**Błędy:** `400` brak pliku, `413` za duży plik, `415` niedozwolony format

---

#### `GET /patients/:patientId/images/:imageId` 🔑

Szczegóły jednego zdjęcia z presigned URL.

---

#### `DELETE /patients/:patientId/images/:imageId` 🩺

Usuwa zdjęcie — zarówno z bazy Mongo jak i z Garage S3.

---

## Schematy baz danych

### PostgreSQL (Drizzle ORM)

```
users
  id            serial PK
  email         text NOT NULL UNIQUE
  password_hash text NOT NULL
  role          enum(USER, DOCTOR, ADMIN) DEFAULT USER
  active        boolean DEFAULT true
  created_at    timestamp DEFAULT now()
  first_name    text
  last_name     text
  address       text
  phone_number  text
```

### MongoDB (Mongoose)

```
patients
  patientId       Number (unique)
  toothStatusList [{ tooth: String, status: String }]

procedureCatalogs
  name            String
  descritpion     String   ← (literówka w schemacie, nie zmieniać)
  defaultCost     Number
  active          Boolean
  createdAt       Date
  updatedAt       Date

medicalProcedures
  patientId       Number
  doctorId        Number
  date            Date
  cost            Number
  description     String
  treatments      [{ tooth, catalogItemId → ObjectId, descritpion, cost }]
  createdAt       Date
  updatedAt       Date

visits
  doctorId           Number
  patientId          Number
  dateTime           Date
  durationMinutes    Number DEFAULT 60
  description        String
  status             enum(BOOKED, COMPLETED, CANCELLED) DEFAULT BOOKED
  medicalProcedureId ObjectId → medicalProcedures
  cancelledAd        Date
  createdAt          Date
  updatedAt          Date

payments
  patientId          Number
  medicalProcedureId ObjectId → medicalProcedures
  amount             Number
  status             enum(PENDING, COMPLETED, FAILED) DEFAULT PENDING
  token              String (UUID, unique)
  successUrl         String
  errorUrl           String
  paidAt             Date
  createdAt          Date
  updatedAt          Date

patientImages
  patientId   Number
  s3Key       String
  filename    String
  mimeType    String
  uploadedBy  Number (doctorId)
  createdAt   Date
  updatedAt   Date
```
