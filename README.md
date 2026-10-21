# Coffee Order Automation

## Cíl projektu
Automatická správa objednávek kávových produktů (a případně dalších položek) s důrazem na maximální zjednodušení procesu pro zákazníka i obsluhu.

## Tech Stack
* **Frontend:** Angular, Ionic (TS/JS, HTML, CSS)
* **Backend:** Node.js / Python (REST API, WebSockets)
* **Platformy:** Mobilní a desktopová aplikace (responzivní design)

## Popis aplikace
Cílem systému je kompletně zautomatizovat objednávání pomocí umělé inteligence. Uživatel může provést objednávku mluveným slovem v telefonu nebo prostřednictvím textové konverzace v chatu. 

**Workflow:**
1. Zákazník nahraje hlasový požadavek (např. *"Dobrý den, poprosím kilo kávy"*).
2. Aplikace záznam zpracuje a automaticky doplní parametry (1 kg Káva Zrno -> objednat na adresu zákazníka).
3. Systém čeká na potvrzení a případně řeší nesrovnalosti ve špatně rozpoznané objednávce.

## Struktura aplikace
* **Nová objednávka:** Vložení audio záznamu nebo textový chat.
* **Historie objednávek:** Přehled a informace o stavu vyřízení.
* **Správa zákazníků:** Založení a správa profilů klientů pro automatické párování adres.

Aplikace podporuje **offline mód** s automatickou synchronizací. Data se ukládají lokálně a po připojení k internetu probíhá odesílání (POST/PUT) a stahování (GET) ze vzdáleného serveru pomocí REST API a WebSockets.
