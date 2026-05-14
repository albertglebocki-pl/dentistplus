# Dokumentacja użytkownika końcowego Dentist+

> Dokumentacja przeznaczona jest dla użytkowników systemu Dentist+.
>
> System umożliwia:
>
> - rejestrację i logowanie użytkowników,
> - zarządzanie wizytami,
> - przegląd historii leczenia,
> - dostęp do zdjęć medycznych,
> - podgląd płatności,
> - obsługę panelu lekarza oraz administratora.

---

# Role użytkowników

| Rola | Opis |
|---|---|
| USER | Pacjent korzystający z systemu |
| DOCTOR | Lekarz zarządzający leczeniem pacjentów |
| ADMIN | Administrator systemu |

---

# Logowanie i rejestracja

## Rejestracja konta

Aby utworzyć konto pacjenta:

1. Otwórz formularz rejestracji.
2. Wprowadź:
   - adres email,
   - hasło,
   - imię,
   - nazwisko,
   - numer telefonu,
   - adres.
3. Zatwierdź formularz.

Po poprawnej rejestracji użytkownik zostaje automatycznie zalogowany.

---

## Logowanie

Aby zalogować się do systemu:

1. Otwórz ekran logowania.
2. Wprowadź email i hasło.
3. Kliknij przycisk „Zaloguj”.

Opcja „Zapamiętaj mnie” pozwala utrzymać sesję użytkownika przez dłuższy czas.

---

## Zmiana hasła

Zalogowany użytkownik może zmienić swoje hasło w ustawieniach konta.

Wymagane jest podanie:

- aktualnego hasła,
- nowego hasła.

---

# Konto użytkownika

## Edycja profilu

Użytkownik może aktualizować:

- imię,
- nazwisko,
- adres,
- numer telefonu.

---

## Dane konta

W panelu użytkownika dostępne są:

- adres email,
- rola konta,
- status aktywności konta,
- data utworzenia konta.

---

# Wizyty

## Rezerwacja wizyty

Pacjent może utworzyć nową wizytę poprzez:

1. wybór lekarza,
2. wybór terminu,
3. określenie czasu wizyty,
4. dodanie opisu wizyty.

---

## Ograniczenia rezerwacji

System automatycznie:

- blokuje rezerwacje w przeszłości,
- sprawdza konflikty terminów lekarza,
- pozwala rezerwować wizyty wyłącznie w godzinach pracy gabinetu.

---

## Statusy wizyt

| Status | Opis |
|---|---|
| BOOKED | Wizyta zaplanowana |
| COMPLETED | Wizyta zakończona |

---

## Lista wizyt

Pacjent może przeglądać:

- nadchodzące wizyty,
- zakończone wizyty.

Lekarz widzi wyłącznie wizyty przypisane do siebie.

---

# Procedury medyczne

## Historia leczenia

Pacjent posiada dostęp do historii swoich procedur medycznych.

Dostępne informacje:

- data wykonania,
- lekarz prowadzący,
- opis procedury,
- wykonane zabiegi,
- koszty leczenia.

---

## Zabiegi

Procedura może zawierać wiele zabiegów wykonanych podczas jednej wizyty.

Każdy zabieg może zawierać:

- nazwę procedury,
- leczony ząb,
- koszt,
- opis.

---

# Status uzębienia

## Karta uzębienia

System umożliwia podgląd aktualnego statusu uzębienia pacjenta.

Lekarz może:

- aktualizować statusy zębów,
- przeglądać historię leczenia konkretnego zęba.

---

# Zdjęcia pacjenta

## Przegląd zdjęć

Pacjent może przeglądać przesłane zdjęcia medyczne.

---

## Upload zdjęć

Zdjęcia mogą być dodawane wyłącznie przez lekarza.

Obsługiwane formaty:

- JPEG,
- PNG,
- WEBP.

Maksymalny rozmiar pliku:

```text
10 MB
```

---

# Płatności

## Historia płatności

Pacjent może przeglądać:

- listę płatności,
- status płatności,
- kwoty,
- daty opłacenia.

---

## Statusy płatności

| Status | Opis |
|---|---|
| PENDING | Oczekuje na płatność |
| COMPLETED | Płatność zakończona |

---

# Panel lekarza

## Możliwości lekarza

Lekarz posiada dostęp do:

- listy pacjentów,
- wizyt,
- procedur medycznych,
- statusów uzębienia,
- zdjęć pacjentów,
- płatności dotyczących własnych procedur.

---

## Tworzenie procedur

Lekarz może:

- dodawać nowe procedury medyczne,
- przypisywać zabiegi,
- aktualizować statusy zębów,
- kończyć wizyty.

---

# Panel administratora

## Możliwości administratora

Administrator może:

- zarządzać użytkownikami,
- tworzyć konta lekarzy,
- blokować użytkowników,
- zarządzać katalogiem procedur,
- przeglądać wszystkie dane systemowe.

---

# Katalog procedur

## Procedury medyczne

System posiada katalog procedur medycznych zawierający:

- nazwę procedury,
- opis,
- domyślny koszt,
- informacje o wpływie na status uzębienia.

---

# Bezpieczeństwo

## Autoryzacja

System wymaga logowania do wszystkich prywatnych funkcji.

---

## Ochrona danych

Pacjent posiada dostęp wyłącznie do własnych danych medycznych.

---

## Kontrola dostępu

Uprawnienia systemowe zależą od roli użytkownika:

- pacjent,
- lekarz,
- administrator.

---
