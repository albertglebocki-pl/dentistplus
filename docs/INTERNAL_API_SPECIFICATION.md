## Dokumentacja wewnętrzna API Dentist+

> Dokumentacja ma charakter **wewnętrzny**.  
> Backend API działa wyłącznie w prywatnej sieci Docker i nie jest dostępny publicznie z Internetu.
>
> Jedynym klientem backendu jest usługa Frontend komunikująca się z API przez wewnętrzną sieć `frontend-backend`.

---

## Backend API Dentist+

### Informacje ogólne

#### Technologia

Backend został zbudowany z wykorzystaniem:

- Node.js
- TypeScript
- Hono
- PostgreSQL
- MongoDB
- Garage S3 Storage

---

### Architektura backendu

Backend pełni funkcję centralnej warstwy logiki biznesowej systemu.

#### Odpowiedzialność backendu

- autoryzacja użytkowników,
- zarządzanie rolami,
- obsługa wizyt,
- obsługa procedur medycznych,
- obsługa płatności,
- zarządzanie katalogiem zabiegów,
- obsługa statusów uzębienia,
- upload oraz pobieranie zdjęć pacjentów,
- integracja z PostgreSQL,
- integracja z MongoDB,
- integracja z Garage S3 Storage.

---

## Adres API

```text
http://backend:3000
```

---

## Autoryzacja

Backend wykorzystuje JWT Bearer Token.

### Header autoryzacji

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## Role użytkowników

| Rola | Opis |
|---|---|
| USER | Pacjent |
| DOCTOR | Lekarz |
| ADMIN | Administrator |

---

## Middleware bezpieczeństwa

### `authMiddleware`

Wymaga poprawnego tokenu JWT.

Dodaje do kontekstu:

```ts
{
  userId: number;
  role: "USER" | "DOCTOR" | "ADMIN";
  exp: number;
}
```

---

### `requireRole([...])`

Middleware ograniczający dostęp do endpointów na podstawie roli użytkownika.

Przykład:

```ts
requireRole(["ADMIN"])
```

---

## Endpointy API

## Ping

### GET `/ping`

Endpoint testowy.

#### Response

```json
{
  "message": "pong"
}
```

---

## Auth API

### POST `/auth/register`

Rejestracja użytkownika.

#### Request

```json
{
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "address": "Warsaw",
  "phoneNumber": "123456789",
  "rememberMe": true
}
```

#### Response

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "role": "USER"
  }
}
```

#### Uwagi

- pierwszy użytkownik systemu automatycznie otrzymuje rolę `ADMIN`,
- hasła są hashowane przez `bcrypt`.

---

### POST `/auth/login`

Logowanie użytkownika.

#### Request

```json
{
  "email": "john@example.com",
  "password": "password123",
  "rememberMe": true
}
```

#### Response

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "role": "USER"
  }
}
```

---

### POST `/auth/me`

Pobranie danych aktualnie zalogowanego użytkownika.

#### Wymagana autoryzacja

Tak

#### Response

```json
{
  "id": 1,
  "email": "john@example.com",
  "role": "USER",
  "active": true,
  "createdAt": "2026-01-01T10:00:00.000Z",
  "firstName": "John",
  "lastName": "Doe",
  "address": "Warsaw",
  "phoneNumber": "123456789"
}
```

---

### PATCH `/auth/me`

Aktualizacja danych użytkownika.

#### Request

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "address": "Warsaw",
  "phoneNumber": "123456789"
}
```

---

### PATCH `/auth/me/password`

Zmiana hasła użytkownika.

#### Request

```json
{
  "oldPassword": "oldPassword",
  "newPassword": "newPassword123"
}
```

---

## Admin API

## Doctors

### POST `/admin/doctors`

Tworzenie konta lekarza.

#### Dostęp

`ADMIN`

#### Request

```json
{
  "email": "doctor@example.com",
  "password": "password123",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "phoneNumber": "123456789"
}
```

---

## Users

### GET `/admin/users`

Lista wszystkich użytkowników.

#### Dostęp

`ADMIN`

---

### PATCH `/admin/users/:id/block`

Blokowanie użytkownika.

#### Dostęp

`ADMIN`

---

### PATCH `/admin/users/:id/unblock`

Odblokowanie użytkownika.

#### Dostęp

`ADMIN`

---

## Doctors API

### GET `/doctors`

Lista lekarzy.

#### Wymagana autoryzacja

Tak

#### Response

```json
[
  {
    "id": 2,
    "email": "doctor@example.com",
    "role": "DOCTOR"
  }
]
```

---

## Patients API

### GET `/patients`

Lista pacjentów.

#### Dostęp

`DOCTOR`, `ADMIN`

---

### GET `/patients/me`

Pobranie profilu aktualnego pacjenta.

---

### PATCH `/patients/me`

Aktualizacja danych pacjenta.

#### Request

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "address": "Warsaw",
  "phoneNumber": "123456789"
}
```

---

### GET `/patients/:id`

Pobranie danych pacjenta.

#### Uprawnienia

- USER może pobrać wyłącznie własny profil,
- DOCTOR oraz ADMIN posiadają dostęp do wszystkich pacjentów.

---

## Visits API

## Model wizyty

### Statusy wizyt

```ts
["BOOKED", "COMPLETED", "CANCELLED"]
```

---

### GET `/visits`

Lista wizyt użytkownika.

#### Zachowanie

##### USER

Pobiera własne wizyty.

##### DOCTOR

Pobiera wizyty przypisane do lekarza wraz z podstawowymi danymi pacjentów.

---

### GET `/visits/:id`

Pobranie szczegółów wizyty.

---

### POST `/visits`

Tworzenie wizyty.

#### Dostęp

`USER`, `DOCTOR`

#### Request

```json
{
  "doctorId": 2,
  "dateTime": "2026-05-10T10:00:00.000Z",
  "durationMinutes": 60,
  "description": "Kontrola"
}
```

#### Walidacje

- brak możliwości rezerwacji w przeszłości,
- godziny pracy: 08:00–18:00 (Europe/Warsaw),
- sprawdzanie konfliktów terminów lekarza.

---

### PATCH `/visits/:id`

Aktualizacja wizyty.

#### Możliwe pola

```json
{
  "dateTime": "2026-05-10T10:00:00.000Z",
  "durationMinutes": 60,
  "description": "Nowy opis"
}
```

---

### POST `/visits/:id/cancel`

Anulowanie wizyty.

#### Warunki

- można anulować wyłącznie wizyty `BOOKED`.

---

## Visit Slots API

### GET `/visits/doctor/:doctorId/slots?date=YYYY-MM-DD`

Pobranie zajętych slotów lekarza dla konkretnego dnia.

---

### GET `/visits/doctor/:doctorId/all-booked`

Pobranie wszystkich przyszłych terminów lekarza.

---

### GET `/visits/patient/:patientId/all-booked`

Pobranie wszystkich aktywnych wizyt pacjenta.

#### Dostęp

`DOCTOR`

---

### GET `/visits/full-slots`

Pobranie terminów, w których wszyscy lekarze są zajęci.

---

## Procedures API

## Model procedury

### Kolekcja `MedicalProcedure`

| Pole | Typ | Opis |
|---|---|---|
| patientId | Number | ID pacjenta |
| doctorId | Number | ID lekarza |
| date | Date | Data wykonania |
| description | String | Opis |
| treatments | Array | Lista zabiegów |

---

### GET `/procedures`

Lista procedur.

#### Zachowanie

##### USER

Widzi wyłącznie własne procedury.

##### DOCTOR

Widzi wyłącznie własne procedury.

##### ADMIN

Widzi wszystkie procedury.

---

### GET `/procedures/:id`

Szczegóły procedury.

---

### POST `/procedures`

Tworzenie procedury medycznej.

#### Dostęp

`DOCTOR`

#### Request

```json
{
  "patientId": 1,
  "visitId": "OBJECT_ID",
  "description": "Leczenie kanałowe",
  "treatments": [
    {
      "tooth": "16",
      "catalogItemId": "OBJECT_ID",
      "cost": 300
    }
  ]
}
```

#### Zachowanie

- automatyczna aktualizacja statusów uzębienia,
- możliwość powiązania z wizytą,
- automatyczne oznaczenie wizyty jako `COMPLETED`.

---

### PATCH `/procedures/:id`

Aktualizacja procedury.

#### Dostęp

`DOCTOR`

---

## Procedure Catalog API

## Kolekcja `ProcedureCatalog`

| Pole | Typ | Opis |
|---|---|---|
| name | String | Nazwa |
| description | String | Opis |
| defaultCost | Number | Domyślny koszt |
| active | Boolean | Aktywność |
| setsToothStatus | String | Status zęba po zabiegu |
| blockedByStatuses | String[] | Statusy blokujące |
| infoColor | String | Kolor UI |

---

### GET `/catalog`

Lista procedur katalogowych.

#### Query params

| Parametr | Opis |
|---|---|
| includeInactive=true | Pokazuje nieaktywne procedury (ADMIN only) |

---

### GET `/catalog/:id`

Szczegóły procedury katalogowej.

---

### POST `/catalog`

Tworzenie wpisu katalogowego.

#### Dostęp

`ADMIN`

---

### PATCH `/catalog/:id`

Aktualizacja wpisu katalogowego.

#### Dostęp

`ADMIN`

---

### DELETE `/catalog/:id`

Dezaktywacja procedury.

#### Dostęp

`ADMIN`

---

## Teeth API

### GET `/patients/:patientId/teeth`

Pobranie statusów uzębienia pacjenta.

---

### PUT `/patients/:patientId/teeth`

Nadpisanie całej listy statusów uzębienia.

#### Dostęp

`DOCTOR`

---

### PATCH `/patients/:patientId/teeth/:tooth`

Aktualizacja pojedynczego zęba.

#### Request

```json
{
  "status": "HEALTHY"
}
```

---

### GET `/patients/:patientId/teeth/:tooth/procedures`

Historia procedur dla konkretnego zęba.

---

## Payments API

## Model płatności

### Statusy płatności

```ts
["PENDING", "COMPLETED"]
```

---

### GET `/payments`

Lista płatności.

#### Zachowanie

##### USER

Widzi wyłącznie własne płatności.

##### DOCTOR

Widzi płatności dotyczące własnych procedur.

##### ADMIN

Widzi wszystkie płatności.

---

### GET `/payments/:id`

Szczegóły płatności.

---

### POST `/payments`

Tworzenie płatności.

#### Dostęp

`DOCTOR`

#### Request

```json
{
  "medicalProcedureId": "OBJECT_ID",
  "amount": 500,
  "successUrl": "https://frontend/success",
  "errorUrl": "https://frontend/error"
}
```

---

### POST `/payments/pay/:id`

Symulacja opłacenia płatności.

#### Zachowanie

- ustawia status `COMPLETED`,
- zapisuje `paidAt`.

---

## Images API

## Kolekcja `PatientImage`

| Pole | Typ | Opis |
|---|---|---|
| patientId | Number | ID pacjenta |
| s3Key | String | Klucz pliku |
| filename | String | Nazwa pliku |
| mimeType | String | Typ MIME |
| uploadedBy | Number | ID użytkownika |

---

### POST `/patients/:patientId/images`

Upload zdjęcia pacjenta.

#### Dostęp

`DOCTOR`

#### Obsługiwane formaty

- image/jpeg
- image/png
- image/webp

#### Limit

```text
10 MB
```

#### Typ requestu

```http
multipart/form-data
```

#### Pole formularza

```text
file
```

---

### GET `/patients/:patientId/images`

Lista zdjęć pacjenta.

---

### GET `/patients/:patientId/images/:imageId`

Pobranie metadanych zdjęcia oraz presigned URL.

---

### GET `/patients/:patientId/images/:imageId/download`

Pobranie pliku ze storage.

---

### DELETE `/patients/:patientId/images/:imageId`

Usunięcie zdjęcia.

#### Dostęp

`DOCTOR`

---

## Integracje backendu

## PostgreSQL

### Odpowiedzialność

Przechowuje:

- użytkowników,
- role,
- dane logowania.

---

## MongoDB

### Odpowiedzialność

Przechowuje:

- wizyty,
- procedury,
- płatności,
- katalog procedur,
- statusy uzębienia,
- zdjęcia pacjentów.

---

## Garage S3 Storage

### Odpowiedzialność

Przechowuje fizyczne pliki zdjęć pacjentów.

Backend zapisuje w MongoDB wyłącznie metadane plików.

---

## Bezpieczeństwo API

### Zasady bezpieczeństwa

#### JWT Authentication

Każdy endpoint prywatny wymaga tokenu JWT.

---

#### Role Based Access Control

Dostęp do endpointów kontrolowany jest przez role użytkowników.

---

#### Izolacja danych

Pacjent (`USER`) posiada dostęp wyłącznie do:

- własnych wizyt,
- własnych procedur,
- własnych płatności,
- własnych zdjęć,
- własnych danych medycznych.

---

#### Walidacja uploadów

Upload zdjęć posiada:

- whitelistę MIME type,
- limit rozmiaru pliku,
- kontrolę autoryzacji.

---
